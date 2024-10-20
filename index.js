const mongoose = require("mongoose");
require("dotenv").config();
const fs = require("fs");
const path = require("path");  // bulk insert

async function main() {
  /**--------------- Not allowed to be edited - start - --------------------- */
  const mongoUri = process.env.MONGODB_URI;
  const collection = process.env.MONGODB_COLLECTION;

  const args = process.argv.slice(2);

  const command = args[0];
  /**--------------- Not allowed to be edited - end - --------------------- */

  // Connect to MongoDB
  await mongoose.connect(mongoUri);


  // Define a schema for the collection
  const schema = new mongoose.Schema({}, { strict: false });
  const Model = mongoose.model(collection, schema);

  switch (command) {
    case "check-db-connection":
      await checkConnection();
      break;
    case "reset-db":               // reset-db
      await resetDb(Model);
      break;      
      
      default:
      throw Error("command not found");
  }
  await mongoose.disconnect();
  return;
}

async function checkConnection() {
  console.log("check db connection started...");
  try {
    await mongoose.connection.db.admin().ping();
    console.log("MongoDB connection is successful!");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
  console.log("check db connection ended...");
}

// Fungsi reset-db
async function resetDb(Model) {
  console.log("reset-db started...");
  try {
    await Model.deleteMany({});
    console.log("All data in the collection has been deleted.");
  } catch (err) {
    console.error("Failed to reset the database:", err);
  }
  console.log("reset-db ended...");
}


main();
