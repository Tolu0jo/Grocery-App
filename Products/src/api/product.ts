import ProductService from "../services/product-service";
import express, { Response, Request, NextFunction } from "express";
import userAuth from "./middleware/auth";

import { Channel } from "amqplib";
import { RPCObserver } from "../utils";


export const Product = (app: express.Application,channel: Channel | undefined) => {
  const service = new ProductService();
  RPCObserver("PRODUCT_RPC",service);
  app.post(
    "/add",
    userAuth,
    async (req: Request, res: Response, next: NextFunction) => {
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
        const data = await service.ProductCreate({
          name,
          desc,
          banner,
          type,
          unit,
          price,
          available,
          supplier,
        });

        return res.status(201).json(data);
      } catch (error) {
        console.log(error);
      }
    }
  );

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

//ADD WISHLIST;
// app.put(
//   "/wishlist",
//   userAuth,
//   async (req: Request | any, res: Response, next: NextFunction) => {
//     const { _id } = req.user;

//     const data = await service.GetProductPayload(
//       _id,
//       { productId: req.body._id, qty: req.body.qty },
//       "ADD_TO_WISHLIST" 
//     );

//     // PublishCustomerEvent(JSON.stringify(data));
//     await PublishMesage(channel,CUSTOMER_BINDING_KEY,JSON.stringify(data));
//     res.status(200).json(data.data.product);
//   }
// );

// //DELETE WISHLIST

// app.delete("/wishlist/:id",userAuth, async (req: Request | any, res: Response, next: NextFunction) => {
//   try {
//    const{id}=req.params;
//    const { _id } = req.user;
//    const data = await service.GetProductPayload(
//     _id,
//     { productId:id, qty: req.body.qty},
//     "REMOVE_FROM_WISHLIST" 
//   );
//   // PublishCustomerEvent(JSON.stringify(data));
//   await PublishMesage(channel,CUSTOMER_BINDING_KEY,JSON.stringify(data));

//   res.status(200).json(data.data.product);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({Error: "Internal Server Error"})
//   }
// })

//   app.put(
//     "/cart",
//     userAuth,
//     async (req: Request | any, res: Response, next: NextFunction) => {
//       try {
//         const { _id } = req.user;

//         const data = await service.GetProductPayload(
//           _id,
//           { productId: req.body._id, qty: req.body.qty },
//           "ADD_TO_CART"
//         );
   

//       await PublishMesage(channel,CUSTOMER_BINDING_KEY,JSON.stringify(data));
     
//        await PublishMesage(channel,SHOPPING_BINDING_KEY,JSON.stringify(data));
  
//         const response ={
//           product:data.data.product,
//           unit:data.data.qty,   
//         }
//         res.status(200).json(response);
      
//       } catch (error) {
//         console.log(error);
//         res.status(500).json({Error: "Internal Server Error"})
//       }
//     }
//   );

//   app.delete("/cart/:id",userAuth, async (req: Request | any, res: Response, next: NextFunction) => {
//     try {
//      const{id}=req.params;
//      const { _id } = req.user;
//      const data = await service.GetProductPayload(
//       _id,
//       { productId:id, qty: req.body.qty },
//       "REMOVE_FROM_CART" 
//     );
    
   
//    await PublishMesage(channel,CUSTOMER_BINDING_KEY,JSON.stringify(data));

//    await PublishMesage(channel,SHOPPING_BINDING_KEY,JSON.stringify(data));
//     const response ={
//       product:data.data.product,
//       unit:data.data.qty,
//     }
//     res.status(200).json(response);
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({Error: "Internal Server Error"})
//     }
//   })
 };
