import express from "express"
import { verifyToken } from "../utils/verifyUser.js"
import {createPost, getPosts, deletePost, editPost} from "../controllers/post.js"

const router = express.Router()


    
router.post("/create-post", verifyToken, createPost)
router.get("/get-post", getPosts)     
router.delete("/delete-post/:postId/:userId", verifyToken, deletePost)
router.put("/edit-post/:postId/:userId", verifyToken, editPost) 
              
export default router;

