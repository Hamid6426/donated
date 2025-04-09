import User from "../../models/User.js";
import logger from "../../config/logger.js";

const logoutUser = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(204).send(); // No content, already logged out or no token
    }

    // Optional: Find the user and remove the refresh token from DB
    const user = await User.findOne({ refreshToken });
    if (user) {
      user.refreshToken = null;
      await user.save();
      logger.info(`Refresh token invalidated for user: ${user.email}`);
    }

    // Clear cookies
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });

    logger.info(`User logged out`);
    return res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    logger.error(`Error during logout: ${err.message}`);
    return res.status(500).json({ message: "Server error during logout" });
  }
};

export default logoutUser;

