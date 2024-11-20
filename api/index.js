import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js"
import authRoutes from "./routes/auth.route.js"

dotenv.config();

const PORT = process.env.PORT 
const MONGO = process.env.MONGO

const app = express();

// Middleware
app.use(express.json());

// Database Connection
mongoose
  .connect(MONGO)
  .then(() => console.log("MongoDB is connected"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

// Routes
app.use("/api/user", userRoutes)
app.use("/api/auth", authRoutes)


// Start Server 
app.listen(PORT, () => {
  console.log("App is running on port", PORT);
})