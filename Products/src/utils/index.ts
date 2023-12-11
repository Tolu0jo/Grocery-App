import { verify} from "jsonwebtoken";
import { APP_SECRET, CUSTOMER_BINDING_KEY, EXCHANGE_NAME, MESSAGE_BROKER_URL, QUEUE_NAME } from "../config";
import amqp from "amqplib"
import{v4 as uuid4} from "uuid"



let amqplibConnection:any = null;

export const formatData = (data: any) => {
  if (data) {
    return data;
  }
  throw new Error("Data not found");
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

//subscribe messages
export const SubscribeMessage= async(channel:any,service:any)=>{
try {
  const appQueue = await channel.assertQueue(QUEUE_NAME);
  channel.bindQueue(appQueue.queue,EXCHANGE_NAME,CUSTOMER_BINDING_KEY);
  channel.consume(appQueue.queue,(data:any)=>{
    console.log("recieved data: IN PRODUCT")
    // console.log(data.content.toString());
    channel.ack(data)
  })
} catch (error) {
  console.log(error)
} }


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
        console.log(msg)
        // DB Operation
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






