import { ShoppingRepository } from "../database/repository/shopping-repository";
import { RPCRequest, formatData } from "../utils";
import { IPlaceOrder } from "./shopping-service.dto";

class ShoppingService {
  repository;
  constructor() {
    this.repository = new ShoppingRepository();
  }


  async AddCartItem(customerId: string,productId:string,qty:number){
      const productResponse= await RPCRequest("PRODUCT_RPC",{
        type:"VIEW_PRODUCT",
        data:productId
      })
      console.log(productResponse)
      if(productResponse){
        const data = await this.repository.ManageCart(customerId,productResponse,qty,false);
        return data;
      }
     
  }
  async RemoveCartItem(customerId: string,productId:string){
      return await this.repository.ManageCart(customerId,{_id:productId},0,true);
  }


  async GetCart(_id: string) {
    try {
      const cart = await this.repository.getCart(_id);
      return formatData(cart);
    } catch (error) {
      console.log(error);
    }
  }

  //Wishlist
  async AddToWishList(customerId: string,productId:string){
   return this.repository.ManageWishlist(customerId,productId);
  }

  async RemoveFromWishList(customerId: string,productId:string){
    return this.repository.ManageWishlist(customerId,productId,true);
  }

  async GetWishList(customerId: string){

   const wishlist= await this.repository.GetWishListByCustomerId(customerId);
   if(!wishlist) return {};
   const {products} = wishlist;
   if(Array.isArray(products)){
    const ids = products.map(({_id}) =>_id);
    const productResponse= await RPCRequest("PRODUCT_RPC",{
      type:"VIEW_PRODUCTS",
      data:ids
    });
    if(productResponse){
      return productResponse;
    }
   }
  }

  async CreateOrder(customerId:string, transactionId :string) {
    try {

      const order = await this.repository.CreateNewOrder(customerId, transactionId);
      return formatData(order);
    } catch (error) {
      console.log(error);
    }
  }

  async GetOrders(customerId: string) {
    try {
      const orders = await this.repository.getOrders(customerId);
      return formatData(orders);
    } catch (error) {
      console.log(error);
    }
  }

  async GetOrder(orderId: string) {
    try {
      const orders = await this.repository.getOrder(orderId);
      return formatData(orders);
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProfile(customerId:string){
      return this.repository.deleteProfileData(customerId);
  }

  async SubscriberEvents(payload:any){
    payload = JSON.parse(payload);
    const{event, data} = payload;
    console.log(data)
    switch (event){
      case "DELETE_PROFILE":
        await this.deleteProfile(data.userId)
        break;
    }
  }
}

export default ShoppingService;
