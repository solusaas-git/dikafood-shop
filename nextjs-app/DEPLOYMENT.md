# DIKAFOOD - Vercel Deployment Guide

This guide will help you deploy the DIKAFOOD e-commerce platform to Vercel.

## 🚀 Quick Deployment

### Method 1: Deploy Button (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/solusaas-git/dikafood-shop&project-name=dikafood-shop&repository-name=dikafood-shop)

### Method 2: Manual Deployment

1. **Fork/Clone the Repository**
   ```bash
   git clone https://github.com/solusaas-git/dikafood-shop.git
   cd dikafood-shop
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with your GitHub account
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect it's a Next.js project

3. **Configure Environment Variables**
   In your Vercel dashboard, add these environment variables:

## 🔧 Required Environment Variables

### Database Configuration
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dikafood?retryWrites=true&w=majority
```

### Authentication
```env
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-minimum-32-characters-long
NEXTAUTH_SECRET=your-nextauth-secret-key-minimum-32-characters-long
NEXTAUTH_URL=https://your-domain.vercel.app
```

### Application Settings
```env
NODE_ENV=production
APP_NAME=DIKAFOOD
APP_URL=https://your-domain.vercel.app
ADMIN_EMAIL=admin@dikafood.com
```

## 📋 Step-by-Step Deployment

### Step 1: Prepare Your Database

1. **Create MongoDB Database**
   - Use MongoDB Atlas (recommended) or your own MongoDB instance
   - Create a new database named `dikafood`
   - Get your connection string

2. **Database Security**
   - Whitelist Vercel's IP addresses or use `0.0.0.0/0` for all IPs
   - Create a database user with read/write permissions

### Step 2: Configure Vercel Project

1. **Project Settings**
   - Framework Preset: `Next.js` (auto-detected)
   - Node.js Version: `18.x` (recommended)

2. **Build Settings**
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)
   - Install Command: `npm install` (auto-detected)

### Step 3: Add Environment Variables

In your Vercel dashboard → Settings → Environment Variables, add:

| Variable | Value | Environment |
|----------|-------|-------------|
| `MONGODB_URI` | Your MongoDB connection string | Production, Preview, Development |
| `JWT_SECRET` | Random 32+ character string | Production, Preview, Development |
| `JWT_REFRESH_SECRET` | Different random 32+ character string | Production, Preview, Development |
| `NEXTAUTH_SECRET` | Random 32+ character string | Production, Preview, Development |
| `NEXTAUTH_URL` | Your Vercel domain URL | Production, Preview |
| `NODE_ENV` | `production` | Production |

### Step 4: Deploy

1. **Automatic Deployment**
   - Push to your main branch
   - Vercel will automatically build and deploy

2. **Manual Deployment**
   ```bash
   npx vercel --prod
   ```

## 🔒 Security Configuration

### Environment Variables Security

Generate secure secrets:
```bash
# Generate JWT secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use online generator
# https://generate-secret.vercel.app/32
```

### Domain Configuration

1. **Custom Domain (Optional)**
   - Go to Vercel Dashboard → Domains
   - Add your custom domain
   - Update `NEXTAUTH_URL` to your custom domain

2. **SSL Certificate**
   - Vercel automatically provides SSL certificates
   - No additional configuration needed

## 📊 Performance Optimization

### Vercel-Specific Optimizations

1. **Edge Functions**
   - API routes automatically use Vercel Edge Runtime where possible
   - Optimized for global performance

2. **Image Optimization**
   - Next.js Image component works seamlessly with Vercel
   - Automatic WebP/AVIF conversion
   - Global CDN delivery

3. **Caching**
   - Static assets cached globally
   - API responses cached based on headers
   - ISR (Incremental Static Regeneration) enabled

### Build Optimization

```json
// vercel.json
{
  "functions": {
    "src/app/api/**/*.js": {
      "maxDuration": 30
    }
  },
  "regions": ["fra1"]
}
```

## 🗄️ Database Setup

### Initial Data Setup

After deployment, you may want to seed your database:

1. **Create Admin User**
   ```javascript
   // Use MongoDB Compass or CLI
   db.users.insertOne({
     email: "admin@dikafood.com",
     password: "$2a$12$...", // Use bcrypt to hash
     role: "admin",
     firstName: "Admin",
     lastName: "User",
     isActive: true,
     createdAt: new Date(),
     updatedAt: new Date()
   })
   ```

2. **Seed Cities (Optional)**
   ```bash
   # If you have access to the server
   npm run seed:cities
   ```

## 🔍 Monitoring & Analytics

### Vercel Analytics

1. **Enable Analytics**
   - Go to Vercel Dashboard → Analytics
   - Enable Web Analytics
   - Add analytics script to your app (optional)

2. **Performance Monitoring**
   - Monitor Core Web Vitals
   - Track page load times
   - Monitor API response times

### Error Tracking

Consider integrating:
- Sentry for error tracking
- LogRocket for session replay
- Vercel's built-in logging

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Check build logs in Vercel dashboard
   # Common issues:
   - Missing environment variables
   - TypeScript errors
   - Import path issues
   ```

2. **Database Connection Issues**
   ```bash
   # Verify:
   - MongoDB URI is correct
   - Database user has proper permissions
   - IP whitelist includes Vercel IPs
   ```

3. **API Route Timeouts**
   ```javascript
   // Increase timeout in vercel.json
   {
     "functions": {
       "src/app/api/**/*.js": {
         "maxDuration": 30
       }
     }
   }
   ```

### Debug Mode

Enable debug logging:
```env
DEBUG=1
VERCEL_ENV=preview
```

## 📞 Support

### Getting Help

1. **Vercel Documentation**
   - [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
   - [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

2. **Project Issues**
   - Create an issue on GitHub
   - Check existing documentation
   - Contact support team

### Useful Commands

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs [deployment-url]
```

## 🎉 Post-Deployment

### Final Steps

1. **Test Your Deployment**
   - Visit your Vercel URL
   - Test user registration/login
   - Test product browsing
   - Test cart functionality
   - Test admin panel access

2. **Configure DNS (If using custom domain)**
   - Update your domain's DNS settings
   - Point to Vercel's nameservers or add CNAME record

3. **Set up Monitoring**
   - Enable Vercel Analytics
   - Set up error tracking
   - Configure uptime monitoring

Congratulations! Your DIKAFOOD e-commerce platform is now live on Vercel! 🎊
