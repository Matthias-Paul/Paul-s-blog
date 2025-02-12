import express from "express"
import {  updateUser, deleteUser, getUsers, getOneUser } from "../controllers/user.js";
import { verifyToken } from "../utils/verifyUser.js"


      

const router = express.Router();
      
router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.get("/get-users", verifyToken, getUsers)   
router.get("/get-user/:userId", getOneUser)

export default router;
 
