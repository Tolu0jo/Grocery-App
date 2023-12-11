import express from "express";
import cors from "cors";
import logger from "morgan";
import { Customer,
  //appEvent 
} from "./api";
import { Channel } from "amqplib";

export const expressApp = async (app: express.Application,channel: Channel | undefined) => {
  app.use(express.json());
              
  app.use(logger("dev"));

  app.use(cors());


 await Customer(app,channel)

  

};
 