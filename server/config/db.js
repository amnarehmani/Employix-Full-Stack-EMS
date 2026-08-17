import mongoose from 'mongoose';

export let dbConnected = false;

let cachedConnection = null;

if (mongoose.connection && mongoose.connection.readyState === 1) {
  dbConnected = true;
}

export const connectDB = async () => {
  if (cachedConnection) {
    dbConnected = true;
    return cachedConnection;
  }

  if (mongoose.connection.readyState >= 1) {
    cachedConnection = mongoose.connection;
    dbConnected = true;
    return cachedConnection;
  }

  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/employix';

  try {
    await mongoose.connect(uri);
    cachedConnection = mongoose.connection;
    dbConnected = true;
    console.log('MongoDB Connected');
    return cachedConnection;
  } catch (error) {
    dbConnected = false;
    console.error('========== MongoDB Connection Error ==========');
    console.error(error.message || error);
    console.error('=============================================');
    throw error;
  }
};
