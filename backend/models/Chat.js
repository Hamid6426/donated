import mongoose from "mongoose";

// Schema for individual messages in the chat.
const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  // Timestamp of when the message was created.
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Main Chat schema to store conversation details.
const chatSchema = new mongoose.Schema(
  {
    // Participants of the chat.
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    // Array of message subdocuments.
    messages: [messageSchema],
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
