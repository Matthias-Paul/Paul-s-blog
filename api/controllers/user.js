import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import User from "../model/user.model.js";
import Post from "../model/post.model.js";

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

    // Update user data in the database
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: req.body }, // Spread all updates
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return next(errorHandler(404, "User not found"));
    }

   
    // Update only username, email, and profilePicture in all posts where userId matches
   const post=  await Post.updateMany(
      { userId: req.params.userId }, 
      {
        $set: {
          username: updatedUser.username, 
          userEmail: updatedUser.email, 
          profilePicture: updatedUser.profilePicture
        }
      }
    );
     console.log("post", post) 
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
      .sort({ updatedAt: sortDirection })
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

