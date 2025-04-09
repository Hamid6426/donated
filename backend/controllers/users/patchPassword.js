import bcrypt from "bcryptjs";
import User from "../../models/User.js";
import logger from "../../config/logger.js";

const patchPassword = async (req, res) => {
  const { userId } = req; // Assuming userId is attached by auth middleware
  const { currentPassword, newPassword } = req.body;

  // Validate that both passwords are provided
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Both current and new passwords are required." });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    // Compare current password with hashed password in the database
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect." });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user password and save
    user.password = hashedPassword;
    await user.save();

    logger.info(`User ${userId} password updated successfully`);
    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    logger.error(`Error updating password for user ${userId}: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

export default patchPassword;
