import {hash,genSalt} from "bcryptjs"
import {verify,sign} from "jsonwebtoken"
import { APP_SECRET, EXCHANGE_NAME, MESSAGE_BROKER_URL, QUEUE_NAME, SHOPPING_BINDING_KEY } from "../config"
import amqp from "amqplib"
import {v4 as uuid4} from "uuid";
let amqplibConnection:any = null




export const GenerateSalt= async()=>{
    return await genSalt()
}

export const GneratePassword=(password:string,salt:string)=>{
   return hash(password, salt)
}

export const GenerateSignature = (payload:string|object|Buffer) =>{
    return sign(payload,APP_SECRET,{expiresIn:"1d"})

}

export const formatData =(data:any)=>{
    if(data){
        return data
    }
    throw new Error('Data not found');
}

export const validateSignature = async(req:Request | any)=>{
    try {
      const signature = await req.get("Authorization")
      
      const payload = verify(signature.split(" ")[1],APP_SECRET)
      req.user = payload;
      return true;
    } catch (error) {
      console.log(error)
      return false;
    }  
  }

  // export const PublishCustomerEvent = async(payload:any)=>{
  //   await axios.post("http://localhost:8000/app-events", {payload})
  //  }
  //message broker

//create channel

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
//subscribe messages
export const SubscribeMessage= async(channel:any,service:any)=>{
try {
  const appQueue = await channel.assertQueue(QUEUE_NAME);
  channel.bindQueue(appQueue.queue,EXCHANGE_NAME,SHOPPING_BINDING_KEY);
  channel.consume(appQueue.queue,(data:any)=>{
    console.log("recieved data:IN SHOPPING ")
    console.log(data.content.toString());
    service.SubscriberEvents(data.content.toString())  
    channel.ack(data)
  })
} catch (error) {
  
}
  
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
      const timeout = setTimeout(() => {
        channel.close();
        resolve("API could not fullfil the request!");
      }, 8000);
      channel.consume(
        q.queue,
        (msg:any) => {
          if (msg.properties.correlationId == uuid) {
            resolve(JSON.parse(msg.content.toString()));
            clearTimeout(timeout);
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
