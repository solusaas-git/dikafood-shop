# DikaFood API Server

A robust Node.js/Express API server for the DikaFood application with MongoDB integration.

## Features

- **Authentication System**: Complete JWT-based auth with refresh tokens
- **Security**: Helmet, CORS, rate limiting, request sanitization
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Express-validator for request validation
- **Error Handling**: Comprehensive error handling and logging
- **Performance**: Compression and request optimization

## Quick Start

### Prerequisites

- Node.js 18+ 
- MongoDB (local or remote)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit environment variables
nano .env
```

### Environment Variables

```bash
# Server Configuration
NODE_ENV=development
PORT=3001

# MongoDB
MONGODB_URI=mongodb://dev:oB4f29iC0fI6fy5t@176.9.26.121:27017/DIKAFOOD

# JWT Secrets
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000,https://dikafood.com
```

### Running the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| POST | `/api/auth/logout` | Logout user | ✅ |
| POST | `/api/auth/logout-all` | Logout from all devices | ✅ |
| POST | `/api/auth/refresh` | Refresh access token | ❌ (refresh token) |
| GET | `/api/auth/me` | Get user profile | ✅ |
| PUT | `/api/auth/profile` | Update user profile | ✅ |
| PUT | `/api/auth/change-password` | Change password | ✅ |
| GET | `/api/auth/verify-email/:token` | Verify email | ❌ |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health check |
| GET | `/api` | API information |

## Request Examples

### Register User

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "phone": "+212612345678"
  }'
```

### Login User

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!",
    "rememberMe": true
  }'
```

### Get Profile (with token)

```bash
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE",
  "errors": [] // Validation errors if applicable
}
```

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Request rate limiting
- **Request Sanitization**: XSS prevention
- **JWT**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Refresh Tokens**: Secure token refresh mechanism

## Database Schema

### User Model

```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: String (user|admin|manager),
  isEmailVerified: Boolean,
  isActive: Boolean,
  profile: {
    avatar: String,
    bio: String,
    preferences: {
      language: String,
      currency: String,
      notifications: Object
    }
  },
  addresses: Array,
  refreshTokens: Array,
  createdAt: Date,
  updatedAt: Date
}
```

## Development

### Project Structure

```
server/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   └── authController.js    # Auth logic
├── middleware/
│   ├── auth.js             # Authentication middleware
│   ├── errorHandler.js     # Error handling
│   └── security.js         # Security middleware
├── models/
│   └── User.js             # User schema
├── routes/
│   └── auth.js             # Auth routes
├── utils/
│   └── jwt.js              # JWT utilities
├── .env                    # Environment variables
├── server.js               # Main server file
└── package.json            # Dependencies
```

### Adding New Routes

1. Create controller in `/controllers`
2. Create route file in `/routes`
3. Import and use in `server.js`

### Error Handling

All errors are handled by the global error handler. Custom errors can be thrown using:

```javascript
const error = new Error('Custom error message');
error.statusCode = 400;
error.code = 'CUSTOM_ERROR_CODE';
throw error;
```

## Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT secrets
- [ ] Configure proper CORS origins
- [ ] Set up MongoDB replica set
- [ ] Configure reverse proxy (nginx)
- [ ] Set up SSL certificates
- [ ] Configure logging service
- [ ] Set up monitoring

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## Monitoring

The server includes:
- Request logging
- Error tracking
- Health check endpoint
- Performance metrics

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Add tests
5. Submit pull request

## License

Private - DikaFood Team Only
