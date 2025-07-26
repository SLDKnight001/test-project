import mongoose from 'mongoose';
import { Category } from '../model/Category';

export class Database {
  static async connect(): Promise<void> {
    try {
      const mongoUrl = process.env.MONGO_DB_URL;
      
      if (!mongoUrl) {
        throw new Error('MongoDB URL is not defined in environment variables');
      }

      await mongoose.connect(mongoUrl);
      console.log('✅ Connected to MongoDB successfully');
      
      // Create default categories
      await (Category as any).createDefaults();
      console.log('✅ Default categories initialized');
      
      // Handle connection events
      mongoose.connection.on('error', (error) => {
        console.error('❌ MongoDB connection error:', error);
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️ MongoDB disconnected');
      });

      mongoose.connection.on('reconnected', () => {
        console.log('🔄 MongoDB reconnected');
      });

    } catch (error) {
      console.error('❌ Failed to connect to MongoDB:', error);
      process.exit(1);
    }
  }

  static async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      console.log('👋 Disconnected from MongoDB');
    } catch (error) {
      console.error('❌ Error disconnecting from MongoDB:', error);
    }
  }
}