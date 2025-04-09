import User from "../../models/User.js";
import logger from "../../config/logger.js"

const fetchAllUsers = async (req, res) => {
  try {
    logger.info("Received request to fetch all users");

    const users = await User.find({});
    logger.info(`Successfully fetched ${users.length} users`);

    res.status(200).json({ success: true, data: users });
  } catch (error) {
    logger.error(`Error fetching users: ${error.message}`);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export default fetchAllUsers;