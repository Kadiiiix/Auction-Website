const User = require('../models/userModel');
const bcrypt = require('bcrypt');

exports.registerUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered." });
    }

    // Check if the username is already taken
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: "Username already taken." });
    }

    // Password validation
    const passwordIsValid = validatePassword(password);
    if (!passwordIsValid) {
      return res.status(400).json({ error: "Invalid password. Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character." });
    }

    // Password hashing
    const hashedPassword = await hashPassword(password);

    // Create a new user with hashed password
    const newUser = new User({ email, username, password: hashedPassword });
    await newUser.save();

    return res.status(200).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    // If user doesn't exist, return error
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Incorrect password." });
    }

    // If user exists and password is correct, return success message
    return res.status(200).json({ message: "Login successful.", user });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// Password validation function
function validatePassword(password) {
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
  return passwordRegex.test(password);
}

// Password hashing function
async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}
