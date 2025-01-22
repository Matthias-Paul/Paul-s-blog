import User from "../model/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

// SIGNUP FUNCTION
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  // Validate input fields
  if (!username || !email || !password || username.trim() === "" || email.trim() === "" || password.trim() === "") {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already in use.",
      });
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

    res.status(201).json({
      success: true,
      message: "Signup successful!",
    });
  } catch (error) {
    console.error("Error during signup:", error.message);
    next(error);
  }
};

// SIGNIN FUNCTION
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  // Validate input fields
  if (!email || !password || email.trim() === "" || password.trim() === "") {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    // Check if user exists
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(400, "User not found"));
    }

    // Validate password
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid password"));
    }

    // Generate Token
    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin  }, // Include user ID
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    

    // Send Token in Response and Cookie
    const { password: pass, ...rest } = validUser._doc;

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        user:rest,
        token,
      });
  } catch (error) {
    console.error("Signin Error:", error.message);
    next(error);
  }
};

export const google = async (req, res, next) => {
  
  const { name, email, googlePhotoURL } = req.body;

  try {
    const user = await User.findOne({ email });
      
    if (user) {
      // Existing user, sign in and generate token
      const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
      const { password, ...rest } = user._doc;
      
      res.status(200).cookie("access_token", token, { httpOnly: true }).json({
        token,
        user:rest,
       
      });
    } else {
      // New user, create account and generate token
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashPassword = bcryptjs.hashSync(generatedPassword, 10);

      const newUser = new User({
        username: name.toLowerCase().split(" ").join("") + Math.random().toString().slice(-4),
        email,
        password: hashPassword,
        profilePicture: googlePhotoURL,  
      });   
     
      await newUser.save();      
        
      const token = jwt.sign({ id: newUser._id, isAdmin:newUser.isAdmin }, process.env.JWT_SECRET);
      const { password, ...rest } = newUser._doc; 
          
      res        
        .status(201)
        .cookie("access_token", token, { httpOnly: true })
        .json({
          token,
          user:rest,
         
        });       
    }      

  } catch (error) {
    next(error);
  }
};
