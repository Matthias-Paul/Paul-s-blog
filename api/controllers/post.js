import { errorHandler } from "../utils/error.js";
import Post from "../model/post.model.js";
import User from "../model/user.model.js";

export const createPost = async (req, res, next) => {
  try {
    // Check if user is authenticated and is an admin
    if (!req.user || !req.user.isAdmin) {
      return next(errorHandler(403, "You are not allowed to create a post!"));
    }

    // Validate title and content
    const { title, content } = req.body;
    if (!title || !content) {
      return next(errorHandler(400, "Please provide a title and content"));
    }

    if (content.length < 30) {
      return next(errorHandler(400, "Content must be more than 30 characters"));
    }

    // Find user data
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    // Generate unique slug
    const slug = title.trim().toLowerCase().replace(/[^a-zA-Z0-9-]/g, "").split(" ").join("-");
    const uniqueSlug = `${slug}-${Date.now()}`;

    // Create new post object
    const newPost = new Post({
      ...req.body,
      userId: req.user.id,
      slug: uniqueSlug,
      userEmail: user.email,
      username: user.username,
      profilePicture: user.profilePicture,
    });

    // Save to database
    const createdPost = await newPost.save();

    // Send success response
    res.status(201).json({
      success: true,
      message: "Post created successfully!",
      createdPost,
    });

    console.log("Post Created:", createdPost);
  } catch (error) {
    console.error("Error creating post:", error);
    next(error);
  }
};


export const getPosts = async (req, res, next) => {
  try {
    console.log(req.query); // Debugging the query parameters

    // Parsing and validating query parameters
    const startIndex = parseInt(req.query.startIndex, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    // Constructing dynamic query filters
    const filters = {
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
    };

    // Fetching posts with pagination
    const posts = await Post.find(filters)
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)  // Using startIndex for pagination
      .limit(limit);     // Limiting the number of posts returned

    // Counting total posts in the collection (unfiltered)
    const totalPosts = await Post.countDocuments();

    // Sending response with pagination data
    res.status(200).json({
      posts,
      totalPosts,  // Total posts available for the query
    });
  } catch (error) {
    console.error("Error in getPosts:", error);
    next(error); // Passing the error to the middleware
  }
};









export const deletePost = async (req, res, next) => {
  const { postId, userId } = req.params;

  // Check if the user is authorized to delete the post
  if (!req.user.isAdmin && req.user._id !== userId) {
    return next({ status: 403, message: "You are not allowed to delete this post!" });
  }

  try {
    // Attempt to delete the post from the database
    const deletedPost = await Post.findByIdAndDelete(postId);

    if (!deletedPost) {
      return next({ status: 404, message: "Post not found!" });
    }

    res.status(200).json({ message: "Post deleted successfully", deletedPost });
  } catch (error) {
    next(error);
  }
};





export const editPost = async (req, res, next) => {
  try {
    // Authorization check: Allow admin or post owner
    // Convert req.user._id to a string for a proper comparison.
    if (!req.user.isAdmin && req.user._id.toString() !== req.params.userId) {
      return next(errorHandler(403, "You are not allowed to update this post!"));
    }

    // Update post
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,   
      {
        $set: {  
          title: req.body.title,
          category: req.body.category,
          content: req.body.content,
          image: req.body.image,
        },
      },
      { new: true } // Return updated document
    );

    if (!updatedPost) {
      return next(errorHandler(404, "Post not found!"));
    }

    res.status(200).json({
      message: "Post updated successfully!",
      updatedPost,
    });
  } catch (error) {
    next(error);
  }
};


