import { CartModel, ICart, OrderModel, WishlistModel } from "../models";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";
export class ShoppingRepository {

async Cart(customerId: string){
return await CartModel.findOne({customerId})
}

    //ADD CART ITEM
    async ManageCart(
      customerId: string,
      product: any,
      qty: number,
      isRemove: boolean
    ) {
      try {
        const cart =await CartModel.findOne({customerId})
        
         if(cart){
         
         if(isRemove){
        const cartItems =_.filter(
         cart.items,(item:any)=> item.product._id !== product._id
          );
          cart.items = cartItems;

       }else{
        const cartIndex= _.findIndex(cart.items,{product:{_id:product._id}})
        console.log(cartIndex)
        if( cartIndex > -1){ 
         cart.items[cartIndex].unit = qty;
        }else{
          cart.items.push({product:{...product},unit:qty});
        }
        }
         return await cart.save();
        }else{

          return await CartModel.create({customerId,
            items: [{product:{
              ...product},unit:qty
            }]
         })}
      } catch (error) {
        console.log(error);
      }
    }

async ManageWishlist( customerId: string,
  productId: string,
  isRemove: boolean=false){
    try {
      const wishlist =await WishlistModel.findOne({customerId})
      
       if(wishlist){
       
       if(isRemove){
      const wishlistItems =_.filter(
       wishlist.products,(item:any)=> item.product._id !== productId
        );
        wishlist.products = wishlistItems;

     }else{
      const wishlistIndex= _.findIndex(wishlist.products,{_id:productId})
      
      if( wishlistIndex < 0){ 
     
        wishlist.products.push({_id:productId});
      }
      }
       return await wishlist.save();
      }else{

        return await WishlistModel.create({customerId,
          products: [{_id:
            productId
          }]
       })}
    } catch (error) {
      console.log(error);
    }
}

async GetWishListByCustomerId(customerId: string){
  return await WishlistModel.findOne({customerId})
}


  // get Orders

  async getOrders(customerId: string) {
    try {
      const orders = await OrderModel.find({ customerId });
      return orders;
    } catch (error) {
      console.log(error);
    }
  }

  async getOrder(orderId: string) {
    try {
      const orders = await OrderModel.find({ orderId });
      return orders;
    } catch (error) {
      console.log(error);
    }
  }

  //GET CART
  async getCart(customerId: string) {
    try {
      const cart = await CartModel.find({ customerId });
      return cart;
    } catch (error) {
      console.log(error);
    }
  }



  //CREATE NEW ORDER
  async CreateNewOrder(customerId: string, transactionId: string) {
    try {
      const cart = await CartModel.findOne({ customerId });

      if (cart) {
        let amount = 0;
        let cartItems = cart.items;

        if (cartItems.length > 0) {
          cartItems.map((item: any) => {
            amount += item.product.price * item.unit;
          });
          const orderId = uuidv4();

          const order = new OrderModel({
            orderId,
            customerId,
            amount,
            transactionId,
            status: "recieved",
            items: cartItems,
          });

          cart.items = [];
          
           await cart.save()
          const orderResult = await order.save();
          return orderResult;
        }
      }
      return {};
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProfileData(customerId: string){
     return Promise.all([CartModel.findOneAndDelete({customerId}),
         WishlistModel.findOneAndDelete({customerId})])
     ;

  }
}
