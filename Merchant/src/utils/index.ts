import { sign, verify} from "jsonwebtoken";
import { APP_SECRET, CUSTOMER_BINDING_KEY, EXCHANGE_NAME, MERCHANT_BINDING_KEY, MESSAGE_BROKER_URL, QUEUE_NAME } from "../config";
import amqp from "amqplib"
import{v4 as uuid4} from "uuid"
import { genSalt, hash } from "bcryptjs";


export const GenerateSalt = async () => {
    return await genSalt();
  };
  
  export const GeneratePassword  = (password: string, salt: string) => {
    return hash(password, salt);
  };

  export const validatePassword = async (
    enteredPassword: string,
    savedPassword: string,
    salt: string
  ) => {
    return (await GeneratePassword(enteredPassword, salt)) === savedPassword;
  };
let amqplibConnection:any = null;



export const GenerateSignature = (payload: string | object | Buffer) => {
    return sign(payload, APP_SECRET, { expiresIn: "1d" });
  };

export const validateSignature = async (req: Request | any) => {
  try {
    const signature = await req.get("Authorization");

    const payload = verify(signature.split(" ")[1], APP_SECRET);
    req.user = payload;
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

//message broker

export const getChannel = async () => {
  if (amqplibConnection === null) {
    amqplibConnection = await amqp.connect(MESSAGE_BROKER_URL);
  }
  return await amqplibConnection.createChannel();
};

//create channel
export const CreateChannel = async()=>{
  try {
  const channel = await getChannel();
  await channel.assertExchange (EXCHANGE_NAME,"direct",{ durable: true });
 return channel;
  } catch (error) {
    console.log(error);
  }
}
//publish messages
export const PublishMesage = async(channel:any,binding_key:string,message:any)=>{

  try {
    await channel.publish(EXCHANGE_NAME,binding_key,Buffer.from(message));
  } catch (error) {
    console.log(error);
  }
}



export const RPCObserver = async(RPC_QUEUE_NAME:string, service:any) => {
  const channel = await getChannel();
  await channel.assertQueue(RPC_QUEUE_NAME, {
    durable: false,
  });
  channel.prefetch(1);
  channel.consume(
    RPC_QUEUE_NAME,
    async (msg:any) => {
      if (msg.content) {
      
        const payload = JSON.parse(msg.content.toString());
        const response = await service.serveRPCRequest(payload);
        channel.sendToQueue(
          msg.properties.replyTo,
          Buffer.from(JSON.stringify(response)),
          {
            correlationId: msg.properties.correlationId,
          }
        );
        channel.ack(msg);
      }
    },
    {
      noAck: false,
    }
  );
  
};

export const requestData = async (RPC_QUEUE_NAME:string, requestPayload:any, uuid:string) => {
  try {
    const channel = await getChannel();

    const q = await channel.assertQueue("", { exclusive: true });

    channel.sendToQueue(
      RPC_QUEUE_NAME,
      Buffer.from(JSON.stringify(requestPayload)),
      {
        replyTo: q.queue,
        correlationId: uuid,
      }
    );

    return new Promise((resolve, reject) => {
      // timeout n
    
      channel.consume(
        q.queue,
        (msg:any) => {
          if (msg.properties.correlationId == uuid) {
            resolve(JSON.parse(msg.content.toString()));
          
          } else {
            reject("data Not found!");
          }
        },
        {
          noAck: true,
        }
      );
    });
  } catch (error) {
    console.log(error);
    return "error";
  }
};

export const RPCRequest = async (RPC_QUEUE_NAME:string, requestPayload:any) => {
  const uuid = uuid4(); // correlationId
  return await requestData(RPC_QUEUE_NAME, requestPayload, uuid);
};






