import express from "express";
import cors from "cors";
import logger from "morgan";
//import { Product,appEvent } from "./api";
import { Channel } from "amqplib";
import { Merchant } from "./api";

export const expressApp = async (app: express.Application,channel: Channel | undefined) => {
  app.use(express.json());
  
  app.use(logger("dev"));

  app.use(cors());
 
  Merchant(app)

};
 