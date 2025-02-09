import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import User from "../model/user.model.js";

export const test = (req, res) => {
  res.send("API Call");
};

export const updateUser = async (req, res, next) => {
  try {
    // Ensure req.user is properly populated
    if (!req.user || !req.user.id) {
      return next(errorHandler(401, "Unauthorized. User not authenticated."));
    }

    console.log("Authenticated user:", req.user);

    // Check if the user has permission to update
    if (req.user.id !== req.params.userId) {
      return next(errorHandler(403, "You are not allowed to update this user"));
    }

    // Validate password, if provided
    if (req.body.password) {
      if (req.body.password.length < 6) {
        return next(errorHandler(400, "Password must be at least 6 characters long"));
      }
      req.body.password = bcryptjs.hashSync(req.body.password, 10); // Hash the password
    }

    // Validate username, if provided  
    if (req.body.username) {
      const username = req.body.username.trim();
      if (username.length < 5 || username.length > 20) {
        return next(errorHandler(400, "Username must be between 5 and 20 characters"));
      }
      if (/\s/.test(username)) {
        return next(errorHandler(400, "Username must not contain spaces"));
      }
      req.body.username = username; // Trim whitespace
    }

    // Update user data
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          ...(req.body.password && { password: req.body.password }), // Only include password if updated
        },
      },
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedUser) {
      return next(errorHandler(404, "User not found"));
    }

    // Exclude the password from the response
    const { password, ...rest } = updatedUser._doc;

    res.status(200).json({
        user:rest,
    });
  } catch (error) {
    next(error);
  }
};


export const deleteUser = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.userId) {
      return next(errorHandler(403, "You are not allowed to delete this account"));
    }

    await User.findByIdAndDelete(req.params.userId);
    
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    next(errorHandler(500, "Failed to delete account"));
  }
};

export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to see all users"));
  }

  try {
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const totalUsers = await User.countDocuments(); 
    const users = await User.find().sort({ updatedAt: sortDirection }); 

    const userWithoutPassword = users.map((user) => { 
      const { password, ...rest } = user._doc;
      return rest;
    });

    res.status(200).json({
      users: userWithoutPassword,
      totalUsers,
    });
  } catch (error) {
    next(error);
  }
};


