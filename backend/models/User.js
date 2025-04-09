import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "is invalid"], // Validates email format
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // This ensures password is not included in find queries by default
      match: [],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      trim: true,
      default: null,
    },
    verificationTokenExpires: {
      type: Date, // Expiry date for verification token
      default: null,
    },
    refreshToken: {
      type: String,
      trim: true,
      default: null,
    },
    refreshTokenExpires: {
      type: Date, // Expiry date for verification token
      default: null,
    },
    resetPasswordToken: {
      type: String,
      trim: true,
      default: null,
    },
    resetPasswordTokenExpires: {
      type: Date, // Expiry date for verification token
      default: null,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    profilePictureUrl: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    street: {
      type: String,
      trim: true,
    },
    postalCode: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["donor", "receiver", "admin", "super-admin"],
      default: "receiver",
    },
    donationPreferences: [
      {
        type: String,
        enum: ["books", "electronics", "clothes"],
      },
    ],
    notificationPreferences: [
      {
        type: String,
        enum: ["sms", "email", "in-app"],
      },
    ],
    socialLinks: {
      facebook: { type: String, trim: true },
      instagram: { type: String, trim: true },
      linkedin: { type: String, trim: true },
      twitter: { type: String, trim: true },
      whatsapp: { type: String, trim: true },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
