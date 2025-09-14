import { NextResponse } from 'next/server';
import { authenticate } from '../../../../lib/auth.js';

// Validation function for profile update
async function validateProfileRequest(req) {
  const data = await req.json();
  const errors = [];
  
  // First name validation
  if (data.firstName !== undefined && (data.firstName.trim().length < 2 || data.firstName.trim().length > 50)) {
    errors.push({ field: 'firstName', message: 'First name must be between 2 and 50 characters' });
  }
  
  // Last name validation
  if (data.lastName !== undefined && (data.lastName.trim().length < 2 || data.lastName.trim().length > 50)) {
    errors.push({ field: 'lastName', message: 'Last name must be between 2 and 50 characters' });
  }
  
  // Phone validation (optional)
  if (data.phone !== undefined && data.phone.trim() && !/^\+[1-9]\d{1,14}$/.test(data.phone)) {
    errors.push({ field: 'phone', message: 'Please provide a valid phone number in international format' });
  }
  
  // Bio validation
  if (data.profile?.bio !== undefined && data.profile.bio.length > 500) {
    errors.push({ field: 'profile.bio', message: 'Bio must not exceed 500 characters' });
  }
  
  // Language validation
  if (data.profile?.preferences?.language !== undefined && 
      !['fr', 'ar', 'en'].includes(data.profile.preferences.language)) {
    errors.push({ field: 'profile.preferences.language', message: 'Language must be one of: fr, ar, en' });
  }
  
  // Currency validation
  if (data.profile?.preferences?.currency !== undefined && 
      !['MAD', 'EUR', 'USD'].includes(data.profile.preferences.currency)) {
    errors.push({ field: 'profile.preferences.currency', message: 'Currency must be one of: MAD, EUR, USD' });
  }
  
  return { data, errors };
}

export async function PUT(req) {
  try {
    // Authenticate user
    const user = await authenticate(req);
    
    // Validate request
    const { data, errors } = await validateProfileRequest(req);
    
    if (errors.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'Validation failed',
        errors,
        code: 'VALIDATION_ERROR'
      }, { status: 400 });
    }

    const { firstName, lastName, phone, profile } = data;

    // Update allowed fields
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (phone !== undefined) user.phone = phone;
    
    // Update profile fields
    if (profile) {
      if (profile.bio !== undefined) {
        if (!user.profile) user.profile = {};
        user.profile.bio = profile.bio;
      }
      if (profile.preferences) {
        if (!user.profile) user.profile = {};
        if (!user.profile.preferences) user.profile.preferences = {};
        
        if (profile.preferences.language) {
          user.profile.preferences.language = profile.preferences.language;
        }
        if (profile.preferences.currency) {
          user.profile.preferences.currency = profile.preferences.currency;
        }
        if (profile.preferences.notifications) {
          user.profile.preferences.notifications = {
            ...user.profile.preferences.notifications,
            ...profile.preferences.notifications
          };
        }
      }
    }

    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: user.toJSON()
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    
    const status = error.code === 'TOKEN_EXPIRED' ? 401 : 
                   error.code === 'INVALID_TOKEN' ? 401 : 500;
    const code = error.code || 'PROFILE_UPDATE_ERROR';
    
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to update profile',
      code
    }, { status });
  }
}
