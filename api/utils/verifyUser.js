import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = (req, res, next) => {
  try {
    // Retrieve token from Authorization header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // "Bearer <token>"

    if (!token) {
      return next(errorHandler(401, "Access token is missing. Unauthorized"));
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error("Token verification error:", err.message);
        return next(errorHandler(403, "Invalid or expired token. Unauthorized"));
      }

      console.log("Decoded Token:", decoded); // Debugging - Ensure `id` is present
      req.user = decoded; // Attach the decoded payload to the request

      next(); // Continue to the next middleware or route
    });
  } catch (error) {
    console.error("Token verification failed:", error.message);
    next(errorHandler(500, "An internal server error occurred."));
  }
};
