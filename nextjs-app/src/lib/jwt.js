import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dikafood_super_secret_key_2024_production_ready';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dikafood_refresh_secret_key_2024_production_ready';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

// Generate access token
export const generateAccessToken = (userId) => {
  return jwt.sign(
    { userId },
    JWT_SECRET,
    { 
      expiresIn: JWT_EXPIRES_IN,
      issuer: 'dikafood-api',
      audience: 'dikafood-app'
    }
  );
};

// Generate refresh token
export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    JWT_REFRESH_SECRET,
    { 
      expiresIn: JWT_REFRESH_EXPIRES_IN,
      issuer: 'dikafood-api',
      audience: 'dikafood-app'
    }
  );
};

// Generate both tokens
export const generateTokens = (userId) => {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);
  
  return {
    accessToken,
    refreshToken,
    accessTokenExpiry: new Date(Date.now() + (60 * 60 * 1000)), // 1 hour
    refreshTokenExpiry: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)) // 7 days
  };
};

// Verify token
export const verifyToken = (token, secret = JWT_SECRET) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw error;
  }
};

// Verify refresh token
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET);
  } catch (error) {
    throw error;
  }
};

// Decode token without verification (for expired tokens)
export const decodeToken = (token) => {
  try {
    return jwt.decode(token, { complete: true });
  } catch (error) {
    return null;
  }
};

// Check if token is expired
export const isTokenExpired = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) {
      return true;
    }
    
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

// Get token expiry date
export const getTokenExpiry = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) {
      return null;
    }
    
    return new Date(decoded.exp * 1000);
  } catch (error) {
    return null;
  }
};

// Extract user ID from token
export const getUserIdFromToken = (token) => {
  try {
    const decoded = jwt.decode(token);
    return decoded?.userId || null;
  } catch (error) {
    return null;
  }
};
