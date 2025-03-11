import bcryptjs from "bcryptjs";
import mongoose from "mongoose"; // Import mongoose to use ObjectId conversion
import { errorHandler } from "../utils/error.js";
import User from "../model/user.model.js";
import Post from "../model/post.model.js";
import Comment from "../model/comment.model.js";

export const updateUser = async (req, res, next) => {
  try {
    // Ensure user authentication
    if (!req.user || !req.user.id) {
      return next(errorHandler(401, "Unauthorized. User not authenticated."));
    }

    console.log("Authenticated user:", req.user);

    // Check if the user has permission to update
    if (req.user.id !== req.params.userId) {
      return next(errorHandler(403, "You are not allowed to update this user"));
    }

    // Validate and hash password if provided
    if (req.body.password) {
      if (req.body.password.length < 6) {
        return next(errorHandler(400, "Password must be at least 6 characters long"));
      }
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    // Validate username if provided  
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

    // Update user data in the database and return updated document
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: req.body }, 
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return next(errorHandler(404, "User not found"));
    }

    console.log("Updated user:", updatedUser);

    // Convert userId to ObjectId if necessary
    const userId = new mongoose.Types.ObjectId(req.params.userId);

    // Update posts where userId matches
    const postUpdate = await Post.updateMany(
      { userId: userId }, // Ensure correct type
      {
        $set: {
          username: updatedUser.username, 
          userEmail: updatedUser.email, 
          profilePicture: updatedUser.profilePicture
        }
      }
    );

    console.log("Posts updated:", postUpdate.modifiedCount);

    // Update comments where userId matches
    const commentUpdate = await Comment.updateMany(
      { userId: userId },
      {    
        $set: {   
          username: updatedUser.username, 
          profilePicture: updatedUser.profilePicture
        }
      }
    );

    console.log("Comments updated:", commentUpdate.modifiedCount);

    // Exclude the password from the response
    const { password, ...rest } = updatedUser._doc;

    res.status(200).json({ user: rest });

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
  if (!req.user || !req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to see all users"));
  }

  try {
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const startIndex = Math.max(parseInt(req.query.startIndex, 10) || 0, 0);
    const limit = Math.max(parseInt(req.query.limit, 10) || 9, 1);

    const users = await User.find()
      .sort({ createdAt: sortDirection })    
      .skip(startIndex)
      .limit(limit);

    const totalUsers = await User.countDocuments();

    const userWithoutPassword = users.map((user) => {
      const { password, ...rest } = user.toObject();
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

export const getOneUser = async (req, res, next) => {
  

  try {
    const { userId} = req.params
    const oneUser = await User.findById(userId)

    const { password, ...rest } = oneUser._doc;
    res.status(200).json({
      user:rest,

    });
  } catch (error) {
    next(error);
  }
};

