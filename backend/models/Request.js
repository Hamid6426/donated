import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    // The item that is being requested.
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    // The user who is making the request.
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Optional message from the requester explaining their need.
    message: {
      type: String,
      trim: true,
    },
    // Status of the request.
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    // Optional reference to a Chat document in case a conversation is initiated.
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
  },
  { timestamps: true }
);

const Request = mongoose.model("Request", requestSchema);

export default Request;
