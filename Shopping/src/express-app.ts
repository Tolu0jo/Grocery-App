import express from "express";
import cors from "cors";
import logger from "morgan";
import { Shopping, appEvent } from "./api";
import { Channel } from "amqplib";


export const expressApp = async (app: express.Application,channel: Channel | undefined) => {
 
  app.use(express.json());
  
  app.use(logger("dev"));

  app.use(cors());
 

  //appEvent(app)
  //Api
   await Shopping(app,channel)

};
 