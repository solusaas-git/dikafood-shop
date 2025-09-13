import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Import database connection
import connectDB from './config/database.js';

// Import middleware
import { errorHandler, notFound } from './middleware/errorHandler.js';
import {
  securityHeaders,
  generalRateLimit,
  compressionMiddleware,
  requestLogger,
  corsOptions,
  sanitizeRequest
} from './middleware/security.js';

// Import routes
import authRoutes from './routes/auth.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Create Express app
const app = express();

// Trust proxy (for rate limiting and IP detection)
app.set('trust proxy', 1);

// Security middleware
app.use(securityHeaders);
app.use(compressionMiddleware);

// CORS middleware
app.use(cors(corsOptions));

// Request parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Request sanitization
app.use(sanitizeRequest);

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(requestLogger);
} else {
  app.use(morgan('combined'));
}

// Rate limiting
app.use(generalRateLimit);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'DikaFood API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/auth', authRoutes);

// Welcome endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to DikaFood API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      health: '/health'
    },
    documentation: 'https://api.dikafood.com/docs'
  });
});

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(`
🚀 DikaFood API Server Started
📍 Environment: ${process.env.NODE_ENV || 'development'}
🌐 Server running on port ${PORT}
🔗 API URL: http://localhost:${PORT}/api
💾 Database: Connected to MongoDB
🛡️  Security: Enabled with Helmet, CORS, Rate Limiting
📊 Logging: ${process.env.NODE_ENV === 'development' ? 'Development' : 'Production'} mode

Available endpoints:
• GET  /health              - Health check
• GET  /api                 - API info
• POST /api/auth/register   - User registration
• POST /api/auth/login      - User login
• POST /api/auth/logout     - User logout
• POST /api/auth/refresh    - Refresh token
• GET  /api/auth/me         - Get user profile
• PUT  /api/auth/profile    - Update profile
• PUT  /api/auth/change-password - Change password

🎯 Ready to handle requests!
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔄 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('🔄 SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Process terminated');
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error('❌ Unhandled Promise Rejection:', err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  process.exit(1);
});

export default app;
