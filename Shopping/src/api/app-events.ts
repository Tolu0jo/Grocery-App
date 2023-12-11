
import express, { Request, Response, NextFunction } from "express";
import ShoppingService from "../services/shopping-service";

export const appEvent = (app: express.Application) => {
  const service = new ShoppingService();

  app.use("/app-events", async (req: Request, res: Response, next: NextFunction) => {
    const { payload } = req.body;
   // service.SubscriberEvents(payload);
   console.log("================= SHOPPING SERVICE RECIEVED EVENT =================")
    res.status(200).json(payload);
  });
};
