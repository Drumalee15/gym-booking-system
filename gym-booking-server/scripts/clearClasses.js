const mongoose = require("mongoose");
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const clearClasses = async () => {
  await connectDB();

  try {
    const result = await mongoose.connection.db.collection('classes').deleteMany({});
    console.log(`${result.deletedCount} documents deleted.`);
    mongoose.connection.close();
  } catch (error) {
    console.error("Error clearing classes:", error);
    mongoose.connection.close();
  }
};

clearClasses();
