import User from "../../models/User.js";
import logger from "../../config/logger.js";

export const patchProfile = async (req, res) => {
  const { userId } = req; // userId from the token in middleware
  const updates = req.body;
  const allowedFields = ["name", "email"];

  // Filter out fields that are not allowed to be updated
  const filteredUpdates = Object.keys(updates).reduce((acc, key) => {
    if (allowedFields.includes(key)) {
      acc[key] = updates[key];
    }
    return acc;
  }, {});

  try {
    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user with the filtered fields
    Object.assign(user, filteredUpdates);
    await user.save();

    logger.info(`User ${userId} updated successfully`);

    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    logger.error(`Error updating user ${userId}: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};