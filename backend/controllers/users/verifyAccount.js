import User from '../../models/User.js';
import logger from '../../config/logger.js';

export const verifyAccount = async (req, res) => {
  const { token } = req.query; // Get the token from the query parameters

  if (!token) {
    return res.status(400).json({ message: 'Verification token is required' });
  }

  try {
    // Find user by the verification token
    const user = await User.findOne({ verificationToken: token });

    // If no user is found or the token is invalid
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    // Check if the token has expired
    if (user.verificationTokenExpires < Date.now()) {
      return res.status(400).json({ message: 'Verification token has expired' });
    }

    // Mark the user as verified and clear the verification token
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null; // Optionally remove the expiration date

    // Save the user with updated verification status
    await user.save();

    logger.info(`User account verified successfully for ${user.email}`);

    // Return a success message
    res.status(200).json({ message: 'Your account has been successfully verified' });
  } catch (error) {
    logger.error(`Error during account verification: ${error.message}`);
    res.status(500).json({ message: 'Server error during account verification' });
  }
};
