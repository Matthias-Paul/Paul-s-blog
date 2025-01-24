import { errorHandler } from "../utils/error.js";
import Post from "../model/post.model.js";

export const createPost = async (req, res, next) => {
  // Check if user is authorized
  if (!req.user || !req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to create a post!"));
  }
   
  // Check for title and content in the request body
  if (!req.body || !req.body.title || !req.body.content) {
    return next(errorHandler(400, "Please provide title and content"));
  }

  // Generate unique slug
  const slug = `${req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "")}`;
    
  const newPost = new Post({
    ...req.body,
    userId: req.user.id,
    userEmail: req.user.userEmail,
    username: req.user.username,
    slug,
  });  

  try {
    // Save the post to the database
    const createdPost = await newPost.save();

    // Return success response
    res.status(201).json({
      success: true,
      message: "Post created successfully!",
      createdPost,
    });
  } catch (error) {
    // Handle errors
    next(error);
    console.error("Error creating post:", error);
  }
};
