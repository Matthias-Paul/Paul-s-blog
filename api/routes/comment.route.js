import express from "express"
import { postComment, getComment, likeComment, editComment, deleteComment } from "../controllers/comment.js"
import { verifyToken } from "../utils/verifyUser.js"

const router = express.Router()

router.post("/create-comment", verifyToken, postComment)
router.get("/get-comment/:postId", getComment)
router.put("/like-comment/:commentId", verifyToken, likeComment)
router.put("/edit-comment/:commentId", verifyToken, editComment)
router.delete("/delete-comment/:commentId", verifyToken, deleteComment)


export default router;