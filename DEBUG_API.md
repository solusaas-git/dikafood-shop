# 🚀 DIKAFOOD API Debugging Guide for Vercel

## Step 1: Test Basic API Endpoint
Try accessing a simple API endpoint directly in your browser:

```
https://your-vercel-domain.vercel.app/api/health
```

Expected response: Should return a JSON response if the API is working.

## Step 2: Check Vercel Function Logs
1. Go to your Vercel dashboard
2. Click on your project
3. Go to "Functions" tab
4. Look for any API route functions
5. Click on any function to see logs and errors

## Step 3: Test API Endpoints

### Test these endpoints in order:

1. **Health Check** (if exists):
   ```
   GET https://your-domain.vercel.app/api/health
   ```

2. **Products API**:
   ```
   GET https://your-domain.vercel.app/api/products
   ```

3. **Authentication API**:
   ```
   POST https://your-domain.vercel.app/api/auth/login
   Content-Type: application/json
   
   {
     "email": "test@example.com",
     "password": "testpassword"
   }
   ```

## Step 4: Common Issues to Check

### A. Environment Variables
Ensure these are set in Vercel Dashboard → Settings → Environment Variables:
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_ACCESS_TOKEN_EXPIRATION`
- `JWT_REFRESH_TOKEN_EXPIRATION`
- Any email service variables

### B. Database Connection
- MongoDB connection string format
- Network access settings in MongoDB Atlas
- IP whitelist (set to 0.0.0.0/0 for Vercel)

### C. CORS Issues
- Check browser console for CORS errors
- Verify API routes return proper headers

## Step 5: Debug with Browser Dev Tools

1. Open browser dev tools (F12)
2. Go to Network tab
3. Try to use your app (login, load products, etc.)
4. Look for failed API requests
5. Check the response status and error messages

## Step 6: Test Specific Functionality

Try these actions in your deployed app:
- [ ] Load the homepage (should load products)
- [ ] Navigate to shop page
- [ ] Try to login to admin
- [ ] Submit contact form
- [ ] Add item to cart

Note which specific actions fail and what error messages appear.
