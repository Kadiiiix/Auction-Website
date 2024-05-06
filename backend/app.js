// app.js

const express = require('express');
const { MongoClient } = require('mongodb');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(express.json());
app.use('/users', userRoutes);

const uri = "mongodb+srv://kasapovicm:Ux3ekVeLxabRf6Ll@izlozba.qhvhcuo.mongodb.net/?retryWrites=true&w=majority&appName=IzlozBa";

const client = new MongoClient(uri);

async function start() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    // Start your Express server after successful MongoDB connection
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

start();
