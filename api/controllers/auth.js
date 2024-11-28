import User from "../model/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js"
import jwt from "jsonwebtoken"

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  // Validate input fields
  if (!username || !email || !password || username.trim() === "" || email.trim() === "" || password.trim() === "") {
   next(errorHandler(400, "All fields are required"))
  
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email is already in use." });
    }

    // Hash the password
    const hashPassword = await bcryptjs.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashPassword,
    });

    // Save the user
    await newUser.save();

    res.status(201).json({ success: true, message: "Signup successful!" });
  } catch (error) {
    console.error("Error during signup:", error.message)
    next(error); // Pass error to the global error handler;
  }
};

export const signin = async (req, res, next)=>{
    
  const { email, password } = req.body;
  // Validate input fields
  if (!email || !password || email.trim() === "" || password.trim() === "") {
   next(errorHandler(400, "All fields are required"))
  }

  try {
    const validUser = await User.findOne({ email });
    if(!validUser ) {
     return next(errorHandler(400, "User not found"))
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if(!validPassword ) {
      return  next(errorHandler(400, "Invalid password"));
    }

    const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET);

    const { password: pass, ...rest } = validUser._doc;
     res.status(200).cookie("access-token", token, {
      httpOnly:true
     }).json(rest)
  } catch (error) {
    next(error);
  }

}




