const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { verifyToken } = require("../middleware/middleware");

// Generate JWT token function
const generateToken = (user) => {
  return jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn: '1h' }); // Expires in 1 hour
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

exports.changePassword = async (req, res) => {
  const userId = req.params.userId;
  const { currentPassword, newPassword } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the current password matches the stored hashed password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect current password' });
    }

    // Validate the new password
    if (!validatePassword(newPassword)) {
      return res.status(400).json({
        error: "Invalid new password. Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character.",
      });
    }

    // Hash the new password
    const hashedNewPassword = await hashPassword(newPassword);

    // Update the user's password
    user.password = hashedNewPassword;
    await user.save();

    return res.status(200).json({ message: 'Password changed successfully.' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Other user controller functions...
exports.searchUser = async (req, res) => {
  const { query } = req.query;

  try {
    // Search for users whose username matches the query
    const users = await User.find({ username: { $regex: query, $options: 'i' } });

    res.status(200).json(users);
  } catch (error) {
    console.error('Error searching for users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.editUserInfo = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { fullname, phone_number, email, city } = req.body;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user information
    if (fullname) user.fullname = fullname;
    if (phone_number) user.phone_number = phone_number;
    if (email) user.email = email;
    if (city) user.city = city;

    // Save the updated user information
    await user.save();

    return res.status(200).json({ message: 'User information updated successfully.' });
  } catch (error) {
    console.error('Error editing user information:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.editUserImage = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(`Edit image request for user: ${userId}`); // Log userId
    const { imageUrl } = req.body;
    console.log(`Image URL: ${imageUrl}`);

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user information
    if (imageUrl) user.photo = imageUrl;

    // Save the updated user information
    await user.save();

    return res.status(200).json({ message: 'User information updated successfully.' });
  } catch (error) {
    console.error('Error editing user information:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getUsernameFromUserId = async (req, res) => {
  try {
      const userId = req.params.userId;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(user);
    
  } catch (error) {
    console.error('Error getting username:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

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
      return res
        .status(400)
        .json({
          error:
            "Invalid password. Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character.",
        });
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

    // If user exists and password is correct, generate token
    const token = generateToken(user);

    // Return success message along with the token
    return res.status(200).json({ message: "Login successful.", token, userId: user._id });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

exports.listFavorites = async (req, res) => {
  try {
      const userId = req.params.userId;
      const user = await User.findById(userId).populate('favorites');
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(user.favorites);
    
  } catch (error) {
    console.error('Error listing favorites:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.addVendorRating = async (req, res) => {
  try {
    const { userId } = req.params;
    const { rating, raterId } = req.body; // Assuming raterId is sent in the request body

    // Find the user to rate
    const userToRate = await User.findById(userId);

    if (!userToRate) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the vendorRatings
    userToRate.vendorRatings.push(rating);

    // Add raterId to ratedBy array
    userToRate.ratedBy.push(raterId);

    // Calculate vendorRating
    const totalRatings = userToRate.vendorRatings.length;
    const sumRatings = userToRate.vendorRatings.reduce((acc, curr) => acc + curr, 0);
    userToRate.vendorRating = sumRatings / totalRatings;

    // Save the updated user
    await userToRate.save();

    res.status(200).json({ message: "User rated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


exports.getRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate("favorites");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const likedAuctions = user.favorites;
    const categories = likedAuctions.map((auction) => auction.category);

    const recommendedAuctions = await Auction.find({
      category: { $in: categories },
      _id: { $nin: likedAuctions.map((auction) => auction._id) }, // Exclude liked auctions
    });

    res.json(recommendedAuctions);
  } catch (error) {
    console.error("Error getting recommendations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
