import dotEnv from "dotenv";

if(process.env.NODE_ENV !== "prod"){
  const configFile = `.env.${process.env.
NODE_ENV}`;
require('dotenv').config({
path: configFile
})
}else{
    dotEnv.config();
}

export const PORT= process.env.PORT;
export const DB_URL= process.env.DB_URL as string;
export const APP_SECRET= process.env.APP_SECRET as string;
export const MESSAGE_BROKER_URL = process.env.MESSAGE_BROKER_URL as string;
export const EXCHANGE_NAME = process.env.EXCHANGE_NAME as string;
export const SHOPPING_BINDING_KEY = process.env.SHOPPING_BINDING_KEY as string;
export const CUSTOMER_BINDING_KEY = process.env.CUSTOMER_BINDING_KEY as string;
export const QUEUE_NAME= process.env.QUEUE_NAME as string;
