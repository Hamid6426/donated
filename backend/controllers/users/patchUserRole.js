import User from "../../models/User.js";
import logger from "../../config/logger.js";

const patchUserRole = async (req, res) => {
  const { userId: currentUserId, role: currentUserRole } = req.user; // From auth middleware
  const { newRole } = req.body;

  const allowedSelfRoles = ["donor", "receiver"];

  // Reject if user tries to change to an invalid role
  if (!allowedSelfRoles.includes(newRole)) {
    return res.status(400).json({
      message: "Invalid role. You can only switch between 'donor' and 'receiver'.",
    });
  }

  try {
    const user = await User.findById(currentUserId);
    if (!user) return res.status(404).json({ message: "User not found." });

    // Prevent unnecessary updates
    if (user.role === newRole) {
      return res.status(400).json({ message: `You are already a '${newRole}'.` });
    }

    user.role = newRole;
    await user.save();

    logger.info(`User ${currentUserId} changed role from ${currentUserRole} to ${newRole}`);

    res.status(200).json({
      message: "Role updated successfully.",
      role: user.role,
    });
  } catch (error) {
    logger.error(`Error changing role for user ${currentUserId}: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

export default patchUserRole;