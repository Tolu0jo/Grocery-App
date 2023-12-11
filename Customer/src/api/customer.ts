import CustomerService from "../services/customer-service";
import express, { Response, Request, NextFunction } from "express";
import userAuth from "./middleware/auth";
import { Channel } from "amqplib";
import { PublishMesage} from "../utils";
import { CUSTOMER_BINDING_KEY, SHOPPING_BINDING_KEY } from "../config";

export const Customer = async (app: express.Application,channel:Channel | undefined) => {
  const service = new CustomerService();

 
  app.post(
    "/signup",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email, password, phone } = req.body;
        const data = await service.SignUp({ email, password, phone });
        return res.status(201).json(data);
      } catch (error) {
        console.log(error);
        return res.status(500).json({ Error: "Internal Server Error" });
      }
    }
  );

  app.post("/login", async (req: Request, res: Response,next:NextFunction) => {
    try {
      const { email, password } = req.body;

      const data = await service.Login({ email, password });

      return res.status(200).json({ message: "Login successful", data });
    } catch (error) {
      return res.status(500).json({ Error: "Internal Server Error" });
    }
  });


  app.post("/address", userAuth, async (req: Request | any, res: Response) => {
    try {
      const { _id } = req.user;
      const { street, city, country } = req.body;
      const address = await service.AddAdress(_id, { street, city, country });
      if (address)
        return res
          .status(201)
          .json({ message: "Address Added successful", address });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ Error: "Internal Server Error" });
    }
  });


  app.get("/profile", userAuth, async (req: Request | any, res: Response) => {
    try {
      const { _id } = req.user;
      const user = await service.GetProfile(_id);
      if (user) return res.status(200).json(user);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ Error: "Internal Server Error" });
    }
  });

  app.delete("/profile", userAuth,async (req: Request | any, res: Response) => {
    try {
      const {_id} = req.user
      const response:any = await service.DeleteCustomer(_id)
      const{data,payload} = response
      PublishMesage(channel,SHOPPING_BINDING_KEY,JSON.stringify(payload));
      return res.status(200).json({data}); 
    } catch (error) {
      console.log(error);
      return res.status(500).json({ Error: "Internal Server Error" });
    }
  })
};
