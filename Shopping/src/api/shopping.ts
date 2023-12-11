import express, { Response, Request, NextFunction } from "express";
import userAuth from "./middleware/auth";
import ShoppingService from "../services/shopping-service";
//import { PublishCustomerEvent } from "../utils";
import { Channel } from "amqplib";
import { PublishMesage, SubscribeMessage } from "../utils";
import { CUSTOMER_BINDING_KEY } from "../config";

export const Shopping =async (app: express.Application,channel: Channel | undefined) => {

  const service = new ShoppingService();

 await SubscribeMessage(channel, service)
 
 app.post("/cart",userAuth,async(req:Request|any,res:Response)=>{
   const{_id} = req.user;
   const{productId,qty}=req.body
  const data=await service.AddCartItem(_id,productId,qty);
  res.status(200).send(data);
})

app.delete("/cart/:id",userAuth,async(req:Request|any,res:Response)=>{
  const{_id} = req.user;
  const productId = req.params.id
 const data=await service.RemoveCartItem(_id,productId);
 res.status(200).send(data);
})
  app.get("/cart", userAuth, async (req: Request | any, res: Response) => {
    try {
      const { _id } = req.user;
      const cart = await service.GetCart(_id);
      if (cart) return res.status(200).json(cart);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ Error: "Internal Server Error" });
    }
  });


app.post("/wishlist",userAuth,async(req: Request | any, res: Response)=>{
  try {
    const {_id}=req.user;
    const{productId}=req.body
    const data = await service.AddToWishList(_id,productId)
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ Error: "Internal Server Error" });
  }

})

app.get("/wishlist",userAuth,async(req: Request | any, res: Response)=>{
try {
  const { _id } = req.user;
  const cart = await service.GetWishList(_id);
  return res.status(200).json(cart);
} catch (error) {
  console.log(error);
  return res.status(500).json({ Error: "Internal Server Error" });
}
})

app.delete("/wishlist/:id",userAuth,async(req: Request | any, res: Response)=>{
try {
  const{_id} = req.user;
  const productId = req.params.id
 const data=await service.RemoveFromWishList(_id,productId);
 res.status(200).send(data);
} catch (error) {
  console.log(error);
  return res.status(500).json({ Error: "Internal Server Error" });
}
})


  //PLACE ORDER
  app.post("/order", userAuth, async (req: Request | any, res: Response) => {
    try {
      const { _id } = req.user;
      const { transactionId } = req.body;
      const data = await service.CreateOrder( _id, transactionId );
     // const payload = await service.GetOrderPayload(_id, order, "CREATE_ORDER");


      // PublishMesage(channel, CUSTOMER_BINDING_KEY,JSON.stringify(payload))  
    return res.status(201).json(data);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ Error: "Internal Server Error" });
    }
  });

  //GET ORDERS
  app.get("/order/:id", userAuth, async (req: Request | any, res: Response) => {
    try {
      const { _id } = req.user;
      const {orderId}=req.params
      const order = await service.GetOrder(orderId);
      //const totalPrice = order.reduce((total:number ,order:{amount:number})=> total + order.amount,0)
      if (order) return res.status(200).json({order});
    } catch (error) {
      console.log(error);
      return res.status(500).json({ Error: "Internal Server Error" })
    }
  });

  app.get("/orders", userAuth, async (req: Request | any, res: Response) => {
    try {
      const { _id } = req.user;
      const order = await service.GetOrders(_id);
      const totalPrice = order.reduce((total:number ,order:{amount:number})=> total + order.amount,0)
      if (order) return res.status(200).json({order,totalPrice});
    } catch (error) {
      console.log(error);
      return res.status(500).json({ Error: "Internal Server Error" })
    }
  });
};
