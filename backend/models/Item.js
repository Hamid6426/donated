import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    photos: [
      {
        type: String, // URLs pointing to image locations
      },
    ],
    category: {
      type: String,
      enum: ["books", "electronics", "clothes", "furniture", "others"],
      required: true,
    },
    condition: {
      type: String,
      enum: ["new", "like new", "used", "worn"],
      default: "used",
    },
    status: {
      type: String,
      enum: ["available", "pending", "donated"],
      default: "available",
    },
    location: {
      country: { type: String, trim: true },
      state: { type: String, trim: true },
      city: { type: String, trim: true },
      postalCode: { type: String, trim: true },
    },
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Request",
      },
    ],
  },
  { timestamps: true }
);

const Item = mongoose.model("Item", itemSchema);

export default Item;
