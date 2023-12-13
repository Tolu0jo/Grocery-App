import express, { Request, Response } from "express";
import { Channel } from "amqplib";
import MerchantService from "../service/merchant-services";
import merchantAuth from "./middleware/auth";
import { PublishMesage, RPCObserver} from "../utils";
import { PRODUCT_BINDING_KEY } from "../config";

export const Merchant = async (app: express.Application, channel: Channel|undefined) => {
  const service = new MerchantService();

  app.post("/signup", async (req: Request, res: Response) => {
    try {
      const { email, password, phone} = req.body;
      const response = await service.merchantSignUp(
        email,
        password,
        phone,
      );
      return res.status(201).json({response});
    } catch (error) {
      console.log(error);
      res.status(500).json({ Error: "Internal Server Error" });
    }
  });

  app.post("/signin", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const response = await service.merchantSignIn(email, password);
      return res.status(200).json(response);
    } catch (error) {
      console.log(error);
      res.status(500).json({ Error: "Internal Server Error" });
    }
  });

  app.post(
    "/create_product",
    merchantAuth,
    async (req: Request | any, res: Response) => {
      try {
        const { name, desc, banner, type, unit, price, available, supplier } =
          req.body;
        const {id} = req.user;
        const data = {
          name,
          desc,
          banner,
          type,
          unit,
          price,
          available,
          supplier,
          merchantId: id,
        };

        const payload:any = {
          event: "CREATE_PRODUCT",
          data,
        };
        PublishMesage(channel,PRODUCT_BINDING_KEY, JSON.stringify(payload));
        res.status(201).json({ data });
      } catch (error) {
        console.log(error);
        res.status(500).json({ Error: "Internal Server Error" });
      }
    }
  );

 app.get("/merchant_products",merchantAuth,async(req: Request | any, res: Response)=>{
  try {
    const {id} = req.user;
    const products = await service.getmerchantProducts(id);
    res.status(200).json({ products });
  } catch (error) {
    console.log(error);
    res.status(500).json({ Error: "Internal Server Error" });
  } 
 
 })
  app.get("/me", merchantAuth, async (req: Request | any, res: Response) => {
    try {
      const {id} = req.user;
      const response = await service.getmerchant(id);
      return res.status(200).json(response);
    } catch (error) {
      console.log(error);
      res.status(500).json({ Error: "Internal Server Error" });
    }
  });
};
