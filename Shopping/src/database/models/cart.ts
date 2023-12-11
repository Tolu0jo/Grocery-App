import mongoose, { Schema } from "mongoose";

export interface ICart {
  customerId: string;
  items: Array<object>;
}
const CartSchema = new Schema(
  {
    customerId: String,
    items: [
      {
        product: {
          _id: { type: String, require: true },
          name: { type: String },
          unit: { type: String },
          img: { type: String },
          price: { type: Number },
        },
        unit: { type: Number, require: true },
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret._v;
      },
    },
    timestamps: true,
  }
);

export const CartModel = mongoose.model("cart", CartSchema);
