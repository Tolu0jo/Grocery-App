import ProductService from "../services/product-service";
import express, { Response, Request, NextFunction } from "express";
import merchantAuth from "./middleware/auth";

import { Channel } from "amqplib";
import { RPCObserver } from "../utils";


export const Product = (app: express.Application,channel: Channel | undefined) => {
  const service = new ProductService();
  RPCObserver("PRODUCT_RPC",service);
  app.post(
    "/add",
    merchantAuth,
    async (req: Request|any, res: Response, next: NextFunction) => {
      try {
        const {
          name,
          desc,
          banner,
          type,
          unit,
          price,
          available,
          supplier,
        } = req.body;
        const id = req.user;
        const data = await service.ProductCreate({
          name,
          desc,
          banner,
          type,
          unit,
          price,
          available,
          supplier,
          merchantId:id,
        });

        return res.status(201).json(data);
      } catch (error) {
        console.log(error);
      }
    }
  );

  app.get("/product",merchantAuth,async (req: Request | any, res: Response, next: NextFunction)=>{
    try{ 
      const id = req.user
     const products = await service.GetMerchantProducts(id)
     return res.status(200).json(products)
    } catch (error) {
      console.log(error);
      res.status(500).json({Error: "Internal Server Error"})
    }
  })

//GET PRODUCT BY CATEGORY
  app.get("/category/:type",async (req: Request | any, res: Response, next: NextFunction)=>{
    try {
      const{type}=req.params;
     const products = await service.GetProductsByCategory(type)
     return res.status(200).json(products)
    } catch (error) {
      console.log(error);
      res.status(500).json({Error: "Internal Server Error"})
    }
  })

  //GET ALL PRODUCT
  app.get("/",async (req: Request | any, res: Response, next: NextFunction)=>{
    try {
      const products = await service.GetProducts()
      return res.status(200).json(products)
    } catch (error) {
      console.log(error);
      res.status(500).json({Error: "Internal Server Error"})
    }
  })

  //GET SINGLE PRODUCT
  app.get("/:id",async (req: Request, res: Response, next: NextFunction)=>{
    try {
      const{id}=req.params;
      const product = await service.GetProductById(id);
      return res.status(200).json(product)
    } catch (error) {
      console.log(error);
      res.status(500).json({Error: "Internal Server Error"})
    }
  }
);


//GET SELECT PRODUCTS
app.post("/products",async (req: Request, res: Response, next: NextFunction)=>{
  try {
    const{productIds}=req.body;
    const products = await service.GetSelectedProducts(productIds);
    return res.status(200).json(products)
  } catch (error) {
    console.log(error);
    res.status(500).json({Error: "Internal Server Error"})
  }
})


 };
