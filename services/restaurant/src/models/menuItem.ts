import mongoose, { Schema, Document } from "mongoose";

export interface MenuItem extends Document {
  restaurantID: mongoose.Types.ObjectId;
  name: string;
  price: number;
  description: string;
  image?: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const menuItemSchema = new Schema<MenuItem>(
  {
    restaurantID: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// menuItemSchema.methods.toJSON = function () {
//   const menuItem = this;
//   const { __v, _id, ...object } = menuItem.toObject();
//   object.id = menuItem.id;
//   return object;
// };

export default mongoose.model<MenuItem>("MenuItem", menuItemSchema);
