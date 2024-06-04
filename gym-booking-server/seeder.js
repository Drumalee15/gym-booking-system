const mongoose = require("mongoose");
const dotenv = require("dotenv");
const classes = require("./data/classes");
const Class = require("./models/Class");
const connectDB = require("./config/db");

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Class.deleteMany(); // Deletes all existing documents in the Class collection

    await Class.insertMany(classes); // Inserts the sample classes into the Class collection

    console.log("Data Imported!");
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();
