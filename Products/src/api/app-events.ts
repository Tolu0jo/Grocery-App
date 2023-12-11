import express, { Request, Response, NextFunction } from "express";

export const appEvent = (app: express.Application) => {


  app.use("/app-events", async (req: Request, res: Response, next: NextFunction) => {
    const { payload } = req.body;
    
   console.log("================= PRODUCT SERVICE RECIEVED EVENT =================")
    res.status(200).json(payload);
  });
};
