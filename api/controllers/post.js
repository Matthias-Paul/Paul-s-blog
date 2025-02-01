import { errorHandler } from "../utils/error.js";
import Post from "../model/post.model.js";

export const createPost = async (req, res, next) => {
  // Check if user is authorized
  if (!req.user || !req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to create a post!"));
  }
   
  // Check for title and content in the request body
  if (!req.body || !req.body.title || !req.body.content) {
    return next(errorHandler(400, "Please provide a title and a content"));
  }

  if (req.body.content.length < 30) {
    return next(errorHandler(400, "Content must be more than 30 characters"));;
  }

  // Generate unique slug
  const slug = `${req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "")}`;
    const uniqueSlug = `${slug}-${Date.now()}`;

  const newPost = new Post({
    ...req.body,
    userId: req.user.id,
    userEmail: req.user.userEmail,
    username: req.user.username,
    slug: uniqueSlug,
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