import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      console.log("Authorization header missing");
      return next(errorHandler(401, "Access token is missing. Unauthorized"));
    }

    if (!authHeader.startsWith("Bearer ")) {
      console.log("Authorization header does not start with 'Bearer'");
      return next(errorHandler(401, "Access token format is invalid. Unauthorized"));
    }

    // Extract the token
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error("Token verification error:", err.message);
        return next(errorHandler(403, "Invalid or expired token. Unauthorized"));
      }

      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error("Token verification failed:", error.message);
    next(errorHandler(500, "An internal server error occurred."));
  }
};
