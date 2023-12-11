import mongoose, { Schema } from "mongoose";

export interface IOrder {
  orderId: string;
  customerId: string;
  amount: number;
  status: string;
  transactionId: string;
  items: Array<Object>;
}
const OrderSchema = new Schema(
  {
  orderId: String,
  customerId: String,
  amount: Number,
  status: String,
  transactionId: String,
  items: [
    {
      product: {
        _id: { type: String, require: true },
        name: { type: String },
        desc: { type: String },
        type: { type: String },
        unit: { type: String },
        banner: { type: String },
        supplier: { type: String },
        price: { type: Number },
      },
      unit: { type: Number, require: true },
    }
  ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

export const OrderModel = mongoose.model<IOrder>(
  "order",
  OrderSchema
);
