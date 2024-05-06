const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = 3000;

// MongoDB connection setup
const uri = "mongodb+srv://kasapovicm:Ux3ekVeLxabRf6Ll@izlozba.qhvhcuo.mongodb.net/?retryWrites=true&w=majority&appName=IzlozBa";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Middleware to parse JSON bodies
app.use(express.json());

// Define a schema for user data
const userSchema = {
  email: String,
  username: String,
  password: String,
};

// Route for user registration
app.post('/register', async (req, res) => {
  try {
    const userData = req.body;

    await client.connect();
    const database = client.db("IzlozBa");
    const usersCollection = database.collection("users");

    // Check if the email is already registered
    const existingUser = await usersCollection.findOne({ email: userData.email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered." });
    }

    // Check if the username is already taken
    const existingUsername = await usersCollection.findOne({ username: userData.username });
    if (existingUsername) {
      return res.status(400).json({ error: "Username already taken." });
    }

    // Insert the new user data into the database
    await usersCollection.insertOne(userData);
    return res.status(200).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ error: "Internal server error." });
  } finally {
    await client.close();
  }
});

// Route for user login
app.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      await client.connect();
      const database = client.db("IzlozBa");
      const usersCollection = database.collection("users");
  
      // Find the user by email
      const user = await usersCollection.findOne({ email });
  
      // If user doesn't exist, return error
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }
  
      // Check if password matches
      if (user.password !== password) {
        return res.status(401).json({ error: "Incorrect password." });
      }
  
      // If user exists and password is correct, return success message
      return res.status(200).json({ message: "Login successful.", user });
    } catch (error) {
      console.error("Error logging in:", error);
      return res.status(500).json({ error: "Internal server error." });
    } finally {
      await client.close();
    }
  });
  

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
