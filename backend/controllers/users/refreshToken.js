import jwt from "jsonwebtoken";
import User from "../../models/User.js";

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies; // Get the refresh token from cookies

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token found" });
    }

    // Verify refresh token
    jwt.verify(refreshToken, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }

      const user = await User.findById(decoded.userId);
      if (!user || user.refreshToken !== refreshToken) {
        return res.status(403).json({ message: "Refresh token does not match" });
      }

      const newAccessToken = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      const newRefreshToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      user.refreshToken = newRefreshToken;
      await user.save();

      // Send new access token as a cookie
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Secure cookies in production
        sameSite: "None", // Cross-origin requests need SameSite=None
        maxAge: 3600000, // 1 hour expiration for access token
      });

      return res.json({ message: "Access token refreshed", accessToken: newAccessToken });
    });
  } catch (err) {
    console.error("Error during refresh token verification:", err);
    res.status(500).json({ message: "Server error while refreshing token" });
  }
};
