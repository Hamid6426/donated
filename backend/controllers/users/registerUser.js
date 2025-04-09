import User from "../../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import logger from "../../config/logger.js"; // Assuming you have a logger setup

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

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

    // Create a new user with the hashed password
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    logger.info(`New user created: ${newUser._id}`);

    // Generate a JWT token
    const token = jwt.sign(
      { userId: newUser._id, username: newUser.username, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    logger.info(`JWT token generated for user: ${email}`);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (err) {
    logger.error(`Error during registration for email ${email}: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
};
