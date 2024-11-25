import User from "../model/user.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  // Validate input fields
  if (!username || !email || !password || username.trim() === "" || email.trim() === "" || password.trim() === "") {
    return res.status(400).json({ success: false, message: "All fields are required." });
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
    console.error("Error during signup:", error.message);
    next(error); // Pass error to the global error handler
  }
};
