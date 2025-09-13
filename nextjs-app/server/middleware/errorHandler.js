// Global error handling middleware
export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error('🚨 Error:', err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = {
      success: false,
      message,
      code: 'RESOURCE_NOT_FOUND',
      statusCode: 404
    };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = {
      success: false,
      message,
      code: 'DUPLICATE_FIELD',
      statusCode: 400
    };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = {
      success: false,
      message: message.join(', '),
      code: 'VALIDATION_ERROR',
      statusCode: 400
    };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = {
      success: false,
      message,
      code: 'INVALID_TOKEN',
      statusCode: 401
    };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = {
      success: false,
      message,
      code: 'TOKEN_EXPIRED',
      statusCode: 401
    };
  }

  // Default error
  const statusCode = error.statusCode || err.statusCode || 500;
  const message = error.message || 'Server Error';
  const code = error.code || 'SERVER_ERROR';

  res.status(statusCode).json({
    success: false,
    message,
    code,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Handle 404 routes
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Async error handler wrapper
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
