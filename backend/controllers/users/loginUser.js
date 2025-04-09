import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";
import logger from "../../config/logger.js";

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      logger.warn(`Login attempt with non-existing email: ${email}`);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if email is verified
    if (!user.isVerified) {
      logger.warn(`Login blocked for unverified email: ${email}`);
      return res.status(401).json({ message: "Please verify your email before logging in" });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logger.warn(`Incorrect password attempt for email: ${email}`);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT tokens
    const accessToken = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Store refresh token
    user.refreshToken = refreshToken;
    await user.save();

    // Send tokens as cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      maxAge: 3600000, // 1 hour
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      maxAge: 604800000, // 7 days
    });

    logger.info(`User logged in: ${email}`);

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    logger.error(`Login error for ${email}: ${err.message}`);
    return res.status(500).json({ message: "Server error during login" });
  }
};
