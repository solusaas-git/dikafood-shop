import { headers } from 'next/headers';
import { cookies } from 'next/headers';
import connectDB from './database.js';
import Session from '../models/Session.js';
import User from '../models/User.js';
import Customer from '../models/Customer.js';
import { verifyToken, generateTokens } from './jwt.js';
import crypto from 'crypto';

/**
 * Enhanced session-based authentication using database sessions
 */

// Generate unique session ID
export function generateSessionId() {
  return crypto.randomBytes(32).toString('hex');
}

// Extract client information
export async function getClientInfo(request) {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  const ipAddress = headersList.get('x-forwarded-for') || 
                   headersList.get('x-real-ip') || 
                   headersList.get('cf-connecting-ip') || 
                   'unknown';
  
  // Parse user agent for device info
  const deviceInfo = {
    browser: extractBrowser(userAgent),
    os: extractOS(userAgent),
    device: extractDevice(userAgent),
    fingerprint: crypto.createHash('sha256').update(userAgent + ipAddress).digest('hex').substring(0, 16)
  };
  
  return { userAgent, ipAddress, deviceInfo };
}

// Simple user agent parsing (you might want to use a library like 'ua-parser-js')
function extractBrowser(userAgent) {
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  return 'Unknown';
}

function extractOS(userAgent) {
  if (userAgent.includes('Windows')) return 'Windows';
  if (userAgent.includes('Mac')) return 'macOS';
  if (userAgent.includes('Linux')) return 'Linux';
  if (userAgent.includes('Android')) return 'Android';
  if (userAgent.includes('iOS')) return 'iOS';
  return 'Unknown';
}

function extractDevice(userAgent) {
  if (userAgent.includes('Mobile')) return 'Mobile';
  if (userAgent.includes('Tablet')) return 'Tablet';
  return 'Desktop';
}

/**
 * Authenticate request using database sessions
 */
export async function authenticateWithSession(request) {
  await connectDB();
  
  // Try to get session from multiple sources
  let sessionId = null;
  let accessToken = null;
  
  // 1. Check Authorization header (for API calls)
  const headersList = await headers();
  const authHeader = headersList.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    accessToken = authHeader.slice(7);
  }
  
  // 2. Check cookies (for web requests)
  const cookieStore = await cookies();
  if (!accessToken) {
    accessToken = cookieStore.get('accessToken')?.value;
  }
  sessionId = cookieStore.get('sessionId')?.value;
  
  // 3. Check session ID from header (for SPA)
  if (!sessionId) {
    sessionId = headersList.get('x-session-id');
  }
  
  if (!accessToken && !sessionId) {
    throw new Error('No authentication credentials provided');
  }
  
  let session = null;
  let user = null;
  
  // If we have a session ID, try to find the session
  if (sessionId) {
    session = await Session.findActiveSession(sessionId);
    if (session && session.userId) {
      // Try to find user in both User and Customer collections
      const [adminUser, customer] = await Promise.all([
        User.findById(session.userId),
        Customer.findById(session.userId)
      ]);
      user = adminUser || customer;
    }
  }
  
  // If we have an access token but no valid session, try token-based auth
  if (!user && accessToken) {
    try {
      const decoded = verifyToken(accessToken);
      // Try to find user in both User and Customer collections
      const [adminUser, customer] = await Promise.all([
        User.findById(decoded.userId),
        Customer.findById(decoded.userId)
      ]);
      user = adminUser || customer;
      
      // Find or create session for this user
      if (user) {
        const clientInfo = await getClientInfo(request);
        session = await Session.findOne({
          userId: user._id,
          accessToken: accessToken,
          isActive: true,
          expiresAt: { $gt: new Date() }
        });
        
        // Create session if it doesn't exist
        if (!session) {
          sessionId = generateSessionId();
          session = await Session.createAuthenticatedSession(
            sessionId,
            user._id,
            accessToken,
            null, // We'll get refresh token from cookies if available
            clientInfo.ipAddress,
            clientInfo.userAgent
          );
        }
      }
    } catch (error) {
      throw new Error('Invalid access token');
    }
  }
  
  if (!user || !session) {
    throw new Error('Authentication failed');
  }
  
  // Update session activity
  await session.updateActivity();
  
  return {
    user,
    session,
    sessionId: session.sessionId
  };
}

/**
 * Create guest session
 */
export async function createGuestSession(request) {
  await connectDB();
  
  const clientInfo = await getClientInfo(request);
  const sessionId = generateSessionId();
  
  const session = await Session.createGuestSession(
    sessionId,
    clientInfo.ipAddress,
    clientInfo.userAgent
  );
  
  return {
    session,
    sessionId: session.sessionId
  };
}

/**
 * Create authenticated session for a user (used after registration)
 */
export async function createSessionForUser(userId, rememberMe = false, request) {
  await connectDB();
  
  // Generate tokens
  const tokens = generateTokens(userId);
  const clientInfo = await getClientInfo(request);
  const sessionId = generateSessionId();
  
  // Create authenticated session
  const session = await Session.createAuthenticatedSession(
    sessionId,
    userId,
    tokens.accessToken,
    tokens.refreshToken,
    clientInfo.ipAddress,
    clientInfo.userAgent,
    rememberMe ? 30 : 7 // 30 days if remember me, otherwise 7 days
  );
  
  return {
    sessionId: session.sessionId,
    session,
    tokens: {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    }
  };
}

/**
 * Authenticate user and create/update session
 */
export async function loginWithSession(email, password, rememberMe = false, request) {
  await connectDB();
  
  // Find user in both User and Customer collections
  const [adminUser, customer] = await Promise.all([
    User.findOne({ 
      email: email.toLowerCase(),
      isActive: true 
    }).select('+password'),
    Customer.findOne({ 
      email: email.toLowerCase(),
      isActive: true 
    }).select('+password')
  ]);
  
  const user = adminUser || customer;
  
  if (!user || !(await user.comparePassword(password))) {
    throw new Error('Invalid email or password');
  }
  
  // Generate tokens
  const tokens = generateTokens(user._id);
  const clientInfo = await getClientInfo(request);
  
  // Check for existing guest session to potentially merge
  const cookieStore = await cookies();
  const existingSessionId = cookieStore.get('sessionId')?.value;
  let existingSession = null;
  
  if (existingSessionId) {
    existingSession = await Session.findActiveSession(existingSessionId);
  }
  
  // Create or update session
  let session;
  if (existingSession && existingSession.sessionType === 'guest') {
    // Convert guest session to authenticated
    session = await existingSession.authenticate(
      user._id,
      tokens.accessToken,
      tokens.refreshToken
    );
  } else {
    // Create new authenticated session
    const sessionId = generateSessionId();
    const expirationDays = rememberMe ? 30 : 7;
    
    session = await Session.createAuthenticatedSession(
      sessionId,
      user._id,
      tokens.accessToken,
      tokens.refreshToken,
      clientInfo.ipAddress,
      clientInfo.userAgent,
      expirationDays
    );
  }
  
  // Update user last login
  user.lastLogin = new Date();
  await user.save();
  
  return {
    user: user.toJSON(),
    session,
    tokens,
    sessionId: session.sessionId
  };
}

/**
 * Logout and terminate session
 */
export async function logoutWithSession(request) {
  await connectDB();
  
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('sessionId')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;
  
  if (sessionId) {
    const session = await Session.findActiveSession(sessionId);
    if (session) {
      await session.terminate('logout');
    }
  }
  
  // Also handle refresh token from User/Customer model (backward compatibility)
  if (refreshToken) {
    const [user, customer] = await Promise.all([
      User.findByRefreshToken(refreshToken),
      Customer.findByRefreshToken ? Customer.findByRefreshToken(refreshToken) : null
    ]);
    
    const account = user || customer;
    if (account) {
      account.removeRefreshToken(refreshToken);
      await account.save();
    }
  }
  
  return true;
}

/**
 * Refresh tokens using session
 */
export async function refreshTokenWithSession(refreshToken) {
  await connectDB();
  
  // Find session by refresh token
  const session = await Session.findByRefreshToken(refreshToken);
  if (!session || !session.userId) {
    throw new Error('Invalid refresh token');
  }
  
  // Generate new tokens
  const newTokens = generateTokens(session.userId._id);
  
  // Update session with new tokens
  session.accessToken = newTokens.accessToken;
  session.refreshToken = newTokens.refreshToken;
  session.lastActivity = new Date();
  await session.save();
  
  return {
    user: session.userId,
    tokens: newTokens,
    sessionId: session.sessionId
  };
}

/**
 * Get user sessions (for admin panel)
 */
export async function getUserSessions(userId, activeOnly = true) {
  await connectDB();
  
  return await Session.findUserSessions(userId, activeOnly);
}

/**
 * Revoke user session (for admin panel)
 */
export async function revokeUserSession(sessionId, reason = 'admin_revoked') {
  await connectDB();
  
  const session = await Session.findOne({ sessionId, isActive: true });
  if (session) {
    await session.terminate(reason);
  }
  
  return true;
}

/**
 * Revoke all user sessions (for security)
 */
export async function revokeAllUserSessions(userId, reason = 'security') {
  await connectDB();
  
  return await Session.revokeAllUserSessions(userId, reason);
}

/**
 * Get session analytics
 */
export async function getSessionAnalytics(userId = null, days = 30) {
  await connectDB();
  
  return await Session.getSessionAnalytics(userId, days);
}

/**
 * Cleanup expired sessions (for maintenance)
 */
export async function cleanupExpiredSessions() {
  await connectDB();
  
  return await Session.cleanupExpiredSessions();
}

/**
 * Optional authentication - doesn't throw if no auth
 */
export async function optionalAuthWithSession(request) {
  try {
    return await authenticateWithSession(request);
  } catch (error) {
    // If authentication fails, check if we have a guest session or create one
    await connectDB();
    
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('sessionId')?.value;
    
    if (sessionId) {
      // Try to find existing guest session
      const session = await Session.findActiveSession(sessionId);
      if (session && session.sessionType === 'guest') {
        return {
          user: null,
          session,
          sessionId: session.sessionId
        };
      }
    }
    
    // Create new guest session
    const guestSession = await createGuestSession(request);
    return {
      user: null,
      session: guestSession.session,
      sessionId: guestSession.sessionId
    };
  }
}
