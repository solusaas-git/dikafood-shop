import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/database.js';
import Customer from '../../../../models/Customer.js';
import User from '../../../../models/User.js';

export async function POST(req) {
  try {
    await connectDB();
    
    const { email, code } = await req.json();
    
    if (!email || !code) {
      return NextResponse.json({
        success: false,
        error: 'Email and verification code are required'
      }, { status: 400 });
    }

    // Find user in both Customer and User collections
    const [customer, user] = await Promise.all([
      Customer.findOne({ 
        email: email.toLowerCase(),
        emailVerificationToken: code,
        emailVerificationExpires: { $gt: Date.now() }
      }),
      User.findOne({ 
        email: email.toLowerCase(),
        emailVerificationToken: code,
        emailVerificationExpires: { $gt: Date.now() }
      })
    ]);

    const account = customer || user;

    if (!account) {
      return NextResponse.json({
        success: false,
        error: 'Invalid or expired verification code'
      }, { status: 400 });
    }

    // Update account verification status
    account.isEmailVerified = true;
    account.emailVerificationToken = undefined;
    account.emailVerificationExpires = undefined;
    await account.save();

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully! You can now access all features.'
    });

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json({
      success: false,
      error: 'Email verification failed'
    }, { status: 500 });
  }
}
