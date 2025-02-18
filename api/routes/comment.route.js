import express from "express"
import { postComment, getComment } from "../controllers/comment.js"
import { verifyToken } from "../utils/verifyUser.js"

const router = express.Router()

router.post("/create-comment", verifyToken, postComment)
router.get("/get-comment/:postId", getComment)

export default router;