import mongoose, { Schema } from "mongoose";

export interface ICustomer {
  email: string;
  password: string;
  salt: string;
  phone: string;
 
  address: Array<Object>;

}
const CustomerSchema = new Schema(
  {
    email: String,
    password: String,
    salt: String,
    phone: String,
   
    address: [
      {
        type: Schema.Types.ObjectId,
        ref: "address",
        require: true,
      },
    ],

  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.salt;
      },
    },
    timestamps: true,
  }
);

export const CustomerModel = mongoose.model<ICustomer>(
  "customer",
  CustomerSchema
);
