import mongoose from 'mongoose';

export let dbConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/employix';

  try {
    await mongoose.connect(uri);

    dbConnected = true;
    console.log('MongoDB Connected');
  } catch (error) {
    dbConnected = false;
    console.error("========== MongoDB Connection Error ==========");
    console.error(error.message || error);
    console.error("==============================================");
  }
};