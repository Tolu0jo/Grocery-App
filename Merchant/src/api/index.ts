import express, { Request, Response } from "express";
import { Channel } from "amqplib";
import MerchantService from "../service/admin-service";
import merchantAuth from "./middleware/auth";

export const Merchant = async (
  app: express.Application,

) => {
  const service = new MerchantService();
  app.post("signup", async (req: Request, res: Response) => {
    try {
      const { email, password, phone, category } = req.body;
      const response = await service.merchantSignUp(email, password, phone, category);
      return res.status(201).json(response);
    } catch (error) {
      console.log(error);
      res.status(500).json({ Error: "Internal Server Error" });
    }
  });

  app.post("signin", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const response = await service.merchantSignIn(email, password);
      return res.status(200).json(response);
    } catch (error) {
      console.log(error);
      res.status(500).json({ Error: "Internal Server Error" });
    }
  });

  app.get("me", merchantAuth, async(req: Request | any, res: Response) => {
    try {
      const id = req.user;
      const response = await service.getmerchant(id);
      return res.status(200).json(response);
    } catch (error) {
      console.log(error);
      res.status(500).json({ Error: "Internal Server Error" });
    }
  });
};
