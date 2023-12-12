import { validateSignature } from "../../utils";
import express,{Request, Response,NextFunction} from "express";

const merchantAuth= async(req:Request, res:Response, next:NextFunction)=>{
    const isAuthorized = await (validateSignature(req))
     if(isAuthorized) {
        return next();
     }
     return res.status(403).json({Error: "Not Authorized"});  
}
export default merchantAuth