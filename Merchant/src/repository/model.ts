import mongoose, { Schema } from "mongoose";

export type IMerchant = {
  email: string;
  password: string;
  salt: string;
  phone: string;
  isMerchant:boolean;
};

const MerchantSchema = new Schema(
  {
    email: String,
    password: String,
    salt: String,
    phone: String,
    isMerchant: Boolean,
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

export const MerchantModel = mongoose.model<IMerchant>("Merchant", MerchantSchema);
