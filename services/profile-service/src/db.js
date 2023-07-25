// db.js
const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017"; // My MongoDB connection string
const client = new MongoClient(uri);

let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db("student-management-profiles"); // My database name
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

function getDB() {
  return db;
}

module.exports = { connectDB, getDB };
