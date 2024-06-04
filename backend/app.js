// app.js
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const userRoutes = require("./routes/userRoutes");
const auctionRoutes = require("./routes/auctionRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const messageRoutes = require("./routes/messageRoutes");
const passwordRecoveryRoutes = require("./routes/passwordRecoveryRoutes");
const reportRoutes = require("./routes/reportRoutes");

const multer = require("multer");
const admin = require("firebase-admin");
const app = express();
const port = 4000;
const fs = require("fs");
const path = require("path");

const uri =
  "mongodb+srv://kasapovicm:Ux3ekVeLxabRf6Ll@izlozba.qhvhcuo.mongodb.net/?retryWrites=true&w=majority&appName=IzlozBa";

const transporter = nodemailer.createTransport({
  service: "hotmail",
  host: "smtp-mail.outlook.com",
  secure: false,
  port: 587,
  auth: {
    user: "izlozba2024@hotmail.com",
    pass: "AminaKenanMeliha",
  },
});

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());
app.set("transporter", transporter);

const serviceAccountPath = path.resolve("serviceAccountKey.json");
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://izlozba-f010b.appspot.com", // Replace with your Firebase project ID
});

const bucket = admin.storage().bucket();

// Mount userRoutes middleware
app.use("/api/users", userRoutes);
app.use("/api/auctions", auctionRoutes);
app.use("/api/favorite", favoriteRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/pass", passwordRecoveryRoutes);
app.use("/api/report", reportRoutes);
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

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/api/upload/additional-images", upload.array("additionalImages", 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const imageUrls = [];

    for (const file of req.files) {
      const blob = bucket.file(file.originalname);
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });

      await new Promise((resolve, reject) => {
        blobStream.on("error", (err) => {
          console.error("Error uploading image:", err);
          reject(err);
        });

        blobStream.on("finish", async () => {
          try {
            await blob.makePublic();
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
            imageUrls.push(publicUrl);
            resolve();
          } catch (err) {
            console.error("Error making image public:", err);
            reject(err);
          }
        });

        blobStream.end(file.buffer);
      });
    }

    res.status(200).json({ imageUrls });
  } catch (err) {
    console.error("Error uploading images:", err);
    res.status(500).json({ error: "Error uploading images" });
  }
});

// Image upload route
app.post("/api/upload/single-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    blobStream.on("error", (err) => {
      console.error("Error uploading image:", err);
      res.status(500).json({ error: "Error uploading image" });
    });

    blobStream.on("finish", async () => {
      try {
        await blob.makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        res.status(200).json({ imageUrl: publicUrl });
      } catch (err) {
        console.error("Error making image public:", err);
        res.status(500).json({ error: "Error making image public" });
      }
    });

    blobStream.end(req.file.buffer);
  } catch (err) {
    console.error("Error uploading image:", err);
    res.status(500).json({ error: "Error uploading image" });
  }
});
