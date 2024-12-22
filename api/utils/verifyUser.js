import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = (req, res, next) => {
  try {
    // Safely access cookies
    const token = req.cookies && req.cookies["access-token"];
    console.log("Cookies:", req.cookies);
    console.log("Access Token:", token);
    console.log("Raw Cookies:", req.headers.cookie);
    console.log("Parsed Cookies:", req.cookies);
 

    if (!token) {
      return next(errorHandler(401, "Access token is missing. Unauthorized"));
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return next(errorHandler(403, "Invalid or expired token. Unauthorized"));
      }
      
      // Attach user information to the request object
      req.user = user;
      next();
    });
  } catch (error) {
    console.error("Error in verifyToken middleware:", error);
    next(errorHandler(500, "An internal server error occurred"));
  }
};
