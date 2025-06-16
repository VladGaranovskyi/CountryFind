import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/country-similarity';
    
    // Set a shorter timeout for connection attempts
    const options = {
      serverSelectionTimeoutMS: 5000, // 5 seconds
      connectTimeoutMS: 5000,
    };
    
    await mongoose.connect(mongoUri, options);
    
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.warn('MongoDB connection failed:', error.message);
    console.warn('Running in development mode without database connection');
    // Don't throw the error - allow the server to start without DB
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('MongoDB disconnected successfully');
    }
  } catch (error) {
    console.error('MongoDB disconnection error:', error);
    throw error;
  }
};