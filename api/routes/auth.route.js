import express from "express";
import { signup } from "../controllers/auth.js";

const router = express.Router()

router.post("/sign-up", signup)

export default router;