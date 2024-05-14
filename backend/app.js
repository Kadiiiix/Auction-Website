// app.js
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const auctionRoutes = require("./routes/auctionRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const app = express();
const port = 4000;

// MongoDB connection setup using the URI
const uri =
  "mongodb+srv://kasapovicm:Ux3ekVeLxabRf6Ll@izlozba.qhvhcuo.mongodb.net/?retryWrites=true&w=majority&appName=IzlozBa";

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());
// Mount userRoutes middleware
app.use("/api/users", userRoutes);
app.use("/api/auctions", auctionRoutes);
app.use("/api/favorite", favoriteRoutes);
app.use("/api/notification", notificationRoutes);
// Start the server after establishing the MongoDB connection
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
