import CustomerService from "../services/customer-service";
import express, { Request, Response, NextFunction } from "express";

// export const appEvent = (app: express.Application) => {
//   const service = new CustomerService();

//   app.use("/app-events", async (req: Request, res: Response, next: NextFunction) => {
//     const { payload } = req.body;
//     service.SubscriberEvents(payload);
//    console.log("================= CUSTOMER SERVICE RECIEVED EVENT =================")
//     res.status(200).json(payload);
//   });
// };
