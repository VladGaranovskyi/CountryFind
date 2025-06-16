import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Enable MongoDB Atlas Vector Search
    const db = conn.connection.db;
    
    // Check if vector search index exists
    try {
      const collections = await db.listCollections({ name: 'countries' }).toArray();
      if (collections.length > 0) {
        console.log('📊 Countries collection found');
      }
    } catch (error) {
      console.log('⚠️  Vector search index may need to be created manually in MongoDB Atlas');
    }

  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('📴 MongoDB connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
});