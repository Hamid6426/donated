import User from "../../models/User.js";
import logger from "../../config/logger.js";

export const patchProfile = async (req, res) => {
  const { userId } = req; // From auth middleware
  const updates = req.body;

  // Allowed fields for updates
  const allowedFields = [
    "firstName",
    "lastName",
    "email",
    "phoneNumber",
    "country",
    "state",
    "city",
    "street",
    "postalCode",
    "donationPreferences",
    "notificationPreferences",
    "socialLinks", // This field is a nested object
  ];

  try {
    // Fetch the user document
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Iterate through the updates, and update allowed fields
    for (const key in updates) {
      if (allowedFields.includes(key)) {
        // Check for nested object: specifically socialLinks
        if (key === "socialLinks" && typeof updates[key] === "object" && !Array.isArray(updates[key])) {
          // Merge safely: update only provided keys while keeping the others intact
          user.socialLinks = {
            ...user.socialLinks,
            ...updates.socialLinks,
          };
        } else {
          user[key] = updates[key];
        }
      }
    }

    await user.save();

    logger.info(`User ${userId} profile updated successfully`);

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        country: user.country,
        state: user.state,
        city: user.city,
        street: user.street,
        postalCode: user.postalCode,
        donationPreferences: user.donationPreferences,
        notificationPreferences: user.notificationPreferences,
        socialLinks: user.socialLinks,
      },
    });
  } catch (error) {
    logger.error(`Error updating profile for user ${userId}: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};
