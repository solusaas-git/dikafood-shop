// Import the new session-based authentication
import { authenticateWithSession } from './sessionAuth.js';

// Middleware to authenticate API requests using database sessions
export async function authenticate(req) {
  try {
    const result = await authenticateWithSession(req);
    return result.user; // Return just the user for backward compatibility
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
}

// Import additional session functions
import { optionalAuthWithSession } from './sessionAuth.js';

// Optional authentication - doesn't fail if no token/session
export async function optionalAuth(req) {
  try {
    const result = await optionalAuthWithSession(req);
    return result ? result.user : null;
  } catch (error) {
    // Silently ignore auth errors for optional auth
    return null;
  }
}

// Authenticate with full session data
export async function authenticateWithFullSession(req) {
  try {
    return await authenticateWithSession(req);
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
}

// Check if user has required role
export function authorize(user, ...roles) {
  if (!user) {
    const error = new Error('Authentication required');
    error.code = 'AUTH_REQUIRED';
    error.status = 401;
    throw error;
  }

  if (!roles.includes(user.role)) {
    const error = new Error('Insufficient permissions');
    error.code = 'INSUFFICIENT_PERMISSIONS';
    error.status = 403;
    throw error;
  }

  return true;
}

// Check if user owns resource or is admin
export function authorizeOwnerOrAdmin(user, resourceUserId) {
  if (!user) {
    const error = new Error('Authentication required');
    error.code = 'AUTH_REQUIRED';
    error.status = 401;
    throw error;
  }

  // Admin can access any resource
  if (user.role === 'admin') {
    return true;
  }

  // Check if user owns the resource
  if (user._id.toString() === resourceUserId) {
    return true;
  }

  const error = new Error('Access denied');
  error.code = 'ACCESS_DENIED';
  error.status = 403;
  throw error;
}

// Import session refresh function
import { refreshTokenWithSession } from './sessionAuth.js';

// Validate refresh token using database sessions
export async function validateRefreshToken(refreshToken) {
  try {
    if (!refreshToken) {
      const error = new Error('Refresh token required');
      error.code = 'REFRESH_TOKEN_REQUIRED';
      error.status = 401;
      throw error;
    }

    const result = await refreshTokenWithSession(refreshToken);
    return { user: result.user, refreshToken: result.tokens.refreshToken };
  } catch (error) {
    console.error('Refresh token validation error:', error);
    
    // Convert session errors to expected format
    const authError = new Error('Invalid refresh token');
    authError.code = 'INVALID_REFRESH_TOKEN';
    authError.status = 401;
    throw authError;
  }
}
