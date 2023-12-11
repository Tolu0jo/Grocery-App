import mongoose,{Schema} from "mongoose";

export interface IAddress{
    street:string
    city:string
    country:string 
}
const AddressSchema = new Schema({
    street:String,
    city:String,
    country:String 
},{
    toJSON:{
        transform(doc,ret){
            delete ret.password;
            delete ret.salt;
        }
    },
    timestamps:true
})

export const AddressModel = mongoose.model<IAddress>('address', AddressSchema)