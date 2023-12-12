export interface IProductDto{
    name:string
    desc:string
    banner:string
    type:string 
    unit:number
    price:number
    available:boolean
    supplier:string
    merchantId:string
}

export type ProductPayload ={
   productId:string
   qty:number 
}