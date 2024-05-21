// app.js
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const auctionRoutes = require("./routes/auctionRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const multer = require("multer");
const admin = require("firebase-admin");
const app = express();
const port = 4000;
const fs = require("fs");
const path = require("path");

const uri =
  "mongodb+srv://kasapovicm:Ux3ekVeLxabRf6Ll@izlozba.qhvhcuo.mongodb.net/?retryWrites=true&w=majority&appName=IzlozBa";

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

const serviceAccountPath = path.resolve("C:\\Users\\Kenan\\Desktop\\serviceAccountKey.json");
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://izlozba-f010b.appspot.com'  // Replace with your Firebase project ID
});

const bucket = admin.storage().bucket();

// MongoDB connection setup using the URI
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


const storage = multer.memoryStorage();
const upload = multer({ storage });

// Image upload route
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    blobStream.on('error', (err) => {
      console.error('Error uploading image:', err);
      res.status(500).json({ error: 'Error uploading image' });
    });

    blobStream.on('finish', async () => {
      try {
        await blob.makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        res.status(200).json({ imageUrl: publicUrl });
      } catch (err) {
        console.error('Error making image public:', err);
        res.status(500).json({ error: 'Error making image public' });
      }
    });

    blobStream.end(req.file.buffer);
  } catch (err) {
    console.error('Error uploading image:', err);
    res.status(500).json({ error: 'Error uploading image' });
  }
});

// Mount userRoutes middleware
app.use("/api/users", userRoutes);
app.use("/api/auctions", auctionRoutes);
app.use("/api/favorite", favoriteRoutes);
app.use("/api/notification", notificationRoutes);
