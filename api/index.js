import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js"
import authRoutes from "./routes/auth.route.js"
import postRoutes from "./routes/post.route.js"
import cors from "cors"
import cookieParser from "cookie-parser" 
import path from "path"

dotenv.config();

const PORT = process.env.PORT 
const MONGO = process.env.MONGO

const app = express();


app.use(cors({
  origin: ["http://localhost:5173"], // Add your frontend's deployed URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));



// Middleware
app.use(express.json());
app.use(cookieParser())


const _dirname = path.resolve()
// Database Connection
mongoose  
  .connect(MONGO)
  .then(() => console.log("MongoDB is connected"))
  .catch((err) => console.error("MongoDB connection error:", err.message));   
        
// Routes
app.use("/api/user", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/post", postRoutes)


// Middleware

app.use((err, req, res, next)=>{
 const statusCode = err.statusCode || 500
 const message = err.message || "Internal Server Error"
 res.status(statusCode).json({
  success:false,
  statusCode,
  message,
 })
})


app.use(express.static(path.join(_dirname, "/client/dist")))

app.get("*", (req, res)  => res.sendFile(path.join(_dirname, "/client/dist/index.html")))
  

// Start Server 
app.listen(PORT, () => {
  console.log("App is running on port", PORT);
})