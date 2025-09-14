import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/database.js';
import mongoose from 'mongoose';

export async function GET(request) {
  try {
    // Connect to database
    await connectDB();
    
    // Get all collection names
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    
    // Count documents in key collections
    const counts = {};
    
    try {
      // Check products
      const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
      counts.products = await Product.countDocuments();
    } catch (e) {
      counts.products = `error: ${e.message}`;
    }
    
    try {
      // Check users
      const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({}, { strict: false }));
      counts.users = await User.countDocuments();
    } catch (e) {
      counts.users = `error: ${e.message}`;
    }
    
    return NextResponse.json({
      success: true,
      database: mongoose.connection.name,
      collections: collectionNames,
      documentCounts: counts,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
