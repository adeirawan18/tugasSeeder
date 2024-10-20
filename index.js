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
    case "bulk-insert":            // bulk-insert
      await bulkInsert(Model);
      break;
      case "get-all":                // get-all
      await getAll(Model);
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

// Fungsi bulk-insert
async function bulkInsert(Model) {
  console.log("bulk-insert started...");
  try {
    const dataPath = path.join(__dirname, "seed.json");
    const seedData = JSON.parse(fs.readFileSync(dataPath, "utf8"));
    await Model.insertMany(seedData);
    console.log("Data has been successfully inserted.");
  } catch (err) {
    console.error("Failed to bulk insert data:", err);
  }
  console.log("bulk-insert ended...");
}

// Fungsi get-all
async function getAll(Model) {
  console.log("get-all started...");
  try {
    const data = await Model.find({});
    console.log("Data from the collection:", data);
  } catch (err) {
    console.error("Failed to get all data:", err);
  }
  console.log("get-all ended...");
}

main();
