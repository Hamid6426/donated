import User from "../../models/User.js";
import logger from "../../config/logger.js";

export const addAdmin = async (req, res) => {
  const { role: currentUserRole } = req.user; // Retrieved from the authentication middleware
  const { userId: targetUserId, targetUserNewRole } = req.body;

  // Check if user has permission to assign roles
  if (currentUserRole !== "super-admin") {
    return res.status(403).json({ message: "Only super-admin can assign admin roles." });
  }

  if (targetUserNewRole === "super-admin") {
    return res.status(403).json({ message: "Super admin already exists." });
  }

  try {
    // Find the target user
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) return res.status(404).json({ message: "Target user not found." });

    // Update the user's role to the new one
    targetUser.role = targetUserNewRole;
    await targetUser.save();

    // Log the action
    logger.info(`Super-admin ${req.user.id} updated the role for user ${targetUserId} to ${targetUserNewRole}.`);

    res.status(200).json({
      message: "User role updated successfully.",
      user: {
        id: targetUser._id,
        role: targetUser.role,
      },
    });
  } catch (error) {
    logger.error(`Error updating role for user ${targetUserId} by super-admin ${req.user.id}: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};
