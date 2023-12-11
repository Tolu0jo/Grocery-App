export interface Iuser{
    email: string;
    password: string;
    phone: string;
}

export interface IuserLogin{
    email: string;
    password: string;
  
}
export interface Iproduct{
    _id:string
    name:string
    price:number
    banner:string
  
}

export interface IAdress{
street:string
postalCode:string
city:string
country:string
}
export interface IOrder{
    _id: string;
    ammount:string;
    date:Date
  }