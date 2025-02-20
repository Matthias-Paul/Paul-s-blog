import express from "express"
import { postComment, getComment, likeComment } from "../controllers/comment.js"
import { verifyToken } from "../utils/verifyUser.js"

const router = express.Router()

router.post("/create-comment", verifyToken, postComment)
router.get("/get-comment/:postId", getComment)
router.put("/like-comment/:commentId", verifyToken, likeComment)
export default router;