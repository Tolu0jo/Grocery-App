import ProductService from "../services/product-service";
import express, { Response, Request, NextFunction } from "express";
import merchantAuth from "./middleware/auth";

import { Channel } from "amqplib";
import { PublishMesage, RPCObserver, SubscribeMessage } from "../utils";
import { SHOPPING_BINDING_KEY } from "../config";

export const Product = (
  app: express.Application,
  channel: Channel | undefined
) => {
  const service = new ProductService();
  SubscribeMessage(channel, service);
  RPCObserver("PRODUCT_RPC", service);

  //GET PRODUCT BY CATEGORY
  app.get(
    "/category/:type",
    async (req: Request | any, res: Response, next: NextFunction) => {
      try {
        const { type } = req.params;
        const products = await service.GetProductsByCategory(type);
        return res.status(200).json(products);
      } catch (error) {
        console.log(error);
        res.status(500).json({ Error: "Internal Server Error" });
      }
    }
  );

  //GET ALL PRODUCT
  app.get(
    "/",
    async (req: Request | any, res: Response, next: NextFunction) => {
      try {
        const products = await service.GetProducts();
        return res.status(200).json(products);
      } catch (error) {
        console.log(error);
        res.status(500).json({ Error: "Internal Server Error" });
      }
    }
  );

  //GET SINGLE PRODUCT
  app.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const product = await service.GetProductById(id);
      return res.status(200).json(product);
    } catch (error) {
      console.log(error);
      res.status(500).json({ Error: "Internal Server Error" });
    }
  });

  //DELETE PRODUCT
  app.delete(
    "/:id",
    merchantAuth,
    async (req: Request | any, res: Response, next: NextFunction) => {
      try {
        const merchantId = req.user.id;
        const { id } = req.params;
        const payload = {
          event: "DELETE_PRODUCT",
          data: { productId: id },
        };
        const response = Promise.all([
          service.deleteProduct(merchantId, id),
          PublishMesage(channel, SHOPPING_BINDING_KEY, JSON.stringify(payload)),
        ]);
        return res.status(200).json(response);
      } catch (error) {
        console.log(error);
        res.status(500).json({ Error: "Internal Server Error" });
      }
    }
  );

  //GET SELECT PRODUCTS
  app.post(
    "/products",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { productIds } = req.body;
        const products = await service.GetSelectedProducts(productIds);
        return res.status(200).json(products);
      } catch (error) {
        console.log(error);
        res.status(500).json({ Error: "Internal Server Error" });
      }
    }
  );
};
