import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";
import logger from "../../config/logger.js";
import { sendEmail } from "../../services/sendEmail.js";

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character, and be at least 8 characters long.",
    });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn(`Attempted registration with existing email: ${email}`);
      return res.status(400).json({ message: "User already exists" });
    }

    const usernameCheck = await User.findOne({ username });
    if (usernameCheck) {
      logger.warn(`Attempted registration with existing username`);
      return res.status(400).json({ message: "Username already exists. Try another" });
    }

    logger.info(`Registering user with email: ${email}` + "&" + `${username}`);

    // Hash the password before saving it
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    logger.info(`Password hashed successfully for user: ${email}`);

    // Generate verification token and store it
    const verificationToken = crypto.randomBytes(20).toString("hex");
    const verificationTokenExpires = Date.now() + 3600000; // Token valid for 1 hour

    // Create new user instance
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpires,
    });

    // Save the new user in the database
    await newUser.save();
    logger.info(`New user created with ID: ${newUser._id}`);

    // Generate JWT access token (short-lived)
    const accessToken = jwt.sign(
      { userId: newUser._id, username: newUser.username }, // more info can be added here but this works and a getProfile request is better
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Access token expires in 1 hour
    );
    logger.info(`Access token generated for user: ${email}`);

    // Generate a refresh token (long-lived)
    const refreshToken = jwt.sign(
      { userId: newUser._id }, // access through _id only is better
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // Refresh token expires in 7 days
    );
    logger.info(`Refresh token generated for user: ${email}`);

    // Save the refresh token in the database
    newUser.refreshToken = refreshToken;
    await newUser.save();

    // Send the tokens in cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure cookies in production (only over HTTPS)
      sameSite: "None",
      maxAge: 3600000, // 1 hour expiration for access token
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure cookies in production (only over HTTPS)
      sameSite: "None",
      maxAge: 604800000, // 7 days expiration for refresh token
    });

    // Construct verification link
    const verificationLink = `${process.env.FRONTEND_URL}/verify-account?token=${verificationToken}`;

    // Send verification email
    const subject = "Please Verify Your Account";
    const htmlContent = `
         <p>Hello ${username},</p>
         <p>Thank you for signing up. Please verify your account by clicking the link below:</p>
         <a href="${verificationLink}">Verify Your Account</a>
         <p>If you did not sign up for this account, please ignore this email.</p>
       `;

    // Call the email sending function
    await sendEmail(email, subject, htmlContent);

    res.status(201).json({
      message: "User registered successfully. Please check your email for verification.",
      token, // The JWT token for session or authentication
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (err) {
    logger.error(`Error during registration for email ${email}: ${err.message}`);
    res.status(500).json({ message: "Server error occurred during registration." });
  }
};
