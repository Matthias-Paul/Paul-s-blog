import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = (req, res, next) => {
  try {
    // Ensure cookies are present
    const token = req.cookies?.access_token;
    if (!token) {
      return next(errorHandler(401, "Access token is missing. Unauthorized"));
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return next(errorHandler(403, "Invalid or expired token. Unauthorized"));
      }

      // Attach user information to the request
      req.user = user;
      next();
    });
  } catch (error) {
    next(errorHandler(500, "An internal server error occurred"));
  }
};
