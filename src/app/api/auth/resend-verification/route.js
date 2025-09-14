import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/database.js';
import Customer from '../../../../models/Customer.js';
import User from '../../../../models/User.js';
import crypto from 'crypto';

export async function POST(req) {
  try {
    await connectDB();
    
    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json({
        success: false,
        error: 'Email is required'
      }, { status: 400 });
    }

    // Find user in both Customer and User collections
    const [customer, user] = await Promise.all([
      Customer.findOne({ email: email.toLowerCase() }),
      User.findOne({ email: email.toLowerCase() })
    ]);

    const account = customer || user;

    if (!account) {
      return NextResponse.json({
        success: false,
        error: 'Account not found'
      }, { status: 404 });
    }

    if (account.isEmailVerified) {
      return NextResponse.json({
        success: false,
        error: 'Email is already verified'
      }, { status: 400 });
    }

    // Generate new verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    account.emailVerificationToken = emailVerificationToken;
    account.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    await account.save();

    // TODO: Send verification email (implement email service)
    console.log(`📧 New email verification token for ${email}: ${emailVerificationToken}`);

    return NextResponse.json({
      success: true,
      message: 'Verification code sent successfully'
    });

  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to resend verification code'
    }, { status: 500 });
  }
}
