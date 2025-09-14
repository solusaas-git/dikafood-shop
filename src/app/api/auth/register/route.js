import { NextResponse } from 'next/server';
import { body, validationResult } from 'express-validator';
import User from '../../../../models/User.js';
import Customer from '../../../../models/Customer.js';
import { createSessionForUser } from '../../../../lib/sessionAuth.js';
import connectDB from '../../../../lib/database.js';
import crypto from 'crypto';

// Validation middleware for Next.js
async function validateRequest(req) {
  const data = await req.json();
  
  const errors = [];
  
  // First name validation
  if (!data.firstName || data.firstName.trim().length < 2 || data.firstName.trim().length > 50) {
    errors.push({ field: 'firstName', message: 'First name must be between 2 and 50 characters' });
  }
  
  // Last name validation
  if (!data.lastName || data.lastName.trim().length < 2 || data.lastName.trim().length > 50) {
    errors.push({ field: 'lastName', message: 'Last name must be between 2 and 50 characters' });
  }
  
  // Email validation
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.push({ field: 'email', message: 'Please provide a valid email address' });
  }
  
  // Password validation
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/;
  if (!data.password || data.password.length < 8 || data.password.length > 30 || !passwordRegex.test(data.password)) {
    errors.push({ 
      field: 'password', 
      message: 'Password must be 8-30 characters with at least one uppercase letter, one lowercase letter, one number, and one special character' 
    });
  }
  
  // Phone validation (optional)
  if (data.phone && data.phone.trim() && !/^\+[1-9]\d{1,14}$/.test(data.phone)) {
    errors.push({ field: 'phone', message: 'Please provide a valid phone number in international format' });
  }
  
  return { data, errors };
}

export async function POST(req) {
  try {
    // Connect to database
    await connectDB();
    
    // Validate request
    const { data, errors } = await validateRequest(req);
    
    console.log('🔐 Registration validation:', {
      data: { ...data, password: '[HIDDEN]' },
      errors: errors
    });
    
    if (errors.length > 0) {
      console.error('❌ Registration validation failed:', errors);
      return NextResponse.json({
        success: false,
        message: 'Validation failed',
        errors,
        code: 'VALIDATION_ERROR'
      }, { status: 400 });
    }

    const { firstName, lastName, email, password, phone } = data;

    // Check if user already exists (check both User and Customer collections)
    const [existingUser, existingCustomer] = await Promise.all([
      User.findOne({ email: email.toLowerCase() }),
      Customer.findOne({ email: email.toLowerCase() }).select('+password')
    ]);
    
    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: 'User with this email already exists',
        code: 'USER_EXISTS'
      }, { status: 409 });
    }
    
    // Handle existing customer case
    if (existingCustomer) {
      console.log('🔐 Found existing customer:', {
        id: existingCustomer._id,
        email: existingCustomer.email,
        hasPassword: !!existingCustomer.password,
        passwordPrefix: existingCustomer.password ? existingCustomer.password.substring(0, 13) : 'none',
        isEmailVerified: existingCustomer.isEmailVerified
      });
      
      // Check if this is a guest customer 
      // Guest customers have isEmailVerified: false and were created recently without manual verification
      const isGuestCustomer = !existingCustomer.isEmailVerified && 
                             !existingCustomer.emailVerificationToken &&
                             !existingCustomer.emailVerificationExpires;
      
      console.log('🔐 Guest customer check:', {
        isGuestCustomer,
        isEmailVerified: existingCustomer.isEmailVerified,
        hasEmailVerificationToken: !!existingCustomer.emailVerificationToken,
        hasEmailVerificationExpires: !!existingCustomer.emailVerificationExpires
      });
      
      if (!isGuestCustomer) {
        console.log('❌ Not a guest customer, rejecting registration');
        return NextResponse.json({
          success: false,
          message: 'Customer with this email already exists',
          code: 'CUSTOMER_EXISTS'
        }, { status: 409 });
      }
      
      console.log('✅ Guest customer detected, upgrading to registered customer');
      
      // Upgrade guest customer to registered customer
      existingCustomer.firstName = firstName;
      existingCustomer.lastName = lastName;
      existingCustomer.password = password; // Will be hashed by pre-save middleware
      existingCustomer.phone = phone || existingCustomer.phone;
      existingCustomer.isEmailVerified = process.env.NODE_ENV === 'development'; // Auto-verify in dev
      
      // Generate email verification token for production
      if (process.env.NODE_ENV !== 'development') {
        const emailVerificationToken = crypto.randomBytes(32).toString('hex');
        existingCustomer.emailVerificationToken = emailVerificationToken;
        existingCustomer.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
        console.log(`📧 Email verification token for ${email}: ${emailVerificationToken}`);
      } else {
        existingCustomer.emailVerificationToken = null;
        existingCustomer.emailVerificationExpires = null;
      }
      
      await existingCustomer.save();
      
      // Create database session for the upgraded customer
      const sessionResult = await createSessionForUser(existingCustomer._id, false, req);
      
      // Create response with session data
      const response = NextResponse.json({
        success: true,
        message: 'Account created successfully! Your guest profile has been upgraded.',
        data: {
          customer: existingCustomer.toJSON(),
          sessionId: sessionResult.sessionId,
          tokens: {
            accessToken: sessionResult.tokens.accessToken,
            refreshToken: sessionResult.tokens.refreshToken,
            expiresIn: 3600 // 1 hour in seconds
          }
        }
      }, { status: 201 });
      
      // Set secure cookies
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      };

      response.cookies.set('sessionId', sessionResult.sessionId, cookieOptions);
      response.cookies.set('token', sessionResult.tokens.accessToken, {
        ...cookieOptions,
        maxAge: 60 * 60 * 1000 // 1 hour for access token
      });
      response.cookies.set('refreshToken', sessionResult.tokens.refreshToken, cookieOptions);
      
      return response;
    }

    // Create new customer (defaults to final_customer from landing page)
    const customer = new Customer({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      phone,
      customerType: 'final_customer', // Default type for public signup
      totalOrders: 0,
      totalSpent: 0,
      loyaltyPoints: 0,
      preferredCategories: [],
      averageOrderValue: 0
    });

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    customer.emailVerificationToken = emailVerificationToken;
    customer.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    
    // Auto-verify email in development mode (since we're not sending real emails yet)
    if (process.env.NODE_ENV === 'development') {
      customer.isEmailVerified = true;
      customer.emailVerificationToken = null;
      customer.emailVerificationExpires = null;
    }

    await customer.save();

    // Create database session for the new customer
    const sessionResult = await createSessionForUser(customer._id, false, req); // false = not remember me

    // Create response with session data
    const response = NextResponse.json({
      success: true,
      message: 'Customer registered successfully',
      data: {
        customer: customer.toJSON(),
        sessionId: sessionResult.sessionId,
        tokens: {
          accessToken: sessionResult.tokens.accessToken,
          refreshToken: sessionResult.tokens.refreshToken,
          expiresIn: 3600 // 1 hour in seconds
        }
      }
    }, { status: 201 });

    // Set secure cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    };

    response.cookies.set('sessionId', sessionResult.sessionId, cookieOptions);
    response.cookies.set('token', sessionResult.tokens.accessToken, {
      ...cookieOptions,
      maxAge: 60 * 60 * 1000 // 1 hour for access token
    });
    response.cookies.set('refreshToken', sessionResult.tokens.refreshToken, cookieOptions);

    // TODO: Send verification email (implement email service)
    console.log(`📧 Email verification token for ${email}: ${emailVerificationToken}`);

    return response;

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.code === 11000) {
      return NextResponse.json({
        success: false,
        message: 'User with this email already exists',
        code: 'DUPLICATE_EMAIL'
      }, { status: 409 });
    }

    return NextResponse.json({
      success: false,
      message: 'Registration failed',
      code: 'REGISTRATION_ERROR'
    }, { status: 500 });
  }
}
