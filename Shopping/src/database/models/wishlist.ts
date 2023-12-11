import mongoose, { Schema } from "mongoose";

export interface IWishlist {
  customerId: string;
  products: Array<object>;
}
const WishlistSchema = new Schema(
  {
    customerId: String,
    products: [
      {
          _id: { type: String, require: true },
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

export const WishlistModel = mongoose.model("wishlist", WishlistSchema);
