// middlewares/authMiddlewares.js
import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

export const checkRole = (roles = []) => {
  return async (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({ message: "Authorization token is required" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // Check if the user's role matches the required roles is an array of roles
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Insufficient permissions" });
      }

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      return res.status(401).json({ message: error.message });
    }
  };
};
