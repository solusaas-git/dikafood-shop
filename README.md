# DikaFood Next.js Migration

This is the migrated version of the DikaFood project from React + Vite to Next.js 14 with App Router.

## 🚀 Migration Overview

The project has been successfully migrated from a React SPA using Vite to a Next.js application with the following improvements:

### ✅ What's Been Migrated

- **App Router Structure**: Converted from React Router to Next.js App Router
- **Server-Side Rendering**: Ready for SSR/SSG capabilities
- **API Routes**: Can now add server-side API endpoints
- **Image Optimization**: Next.js Image component ready for implementation
- **SEO Optimization**: Enhanced metadata and SEO capabilities
- **Performance**: Better code splitting and optimization

### 📁 Project Structure

```
nextjs-app/
├── src/
│   ├── app/                    # App Router pages
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   ├── shop/              # Shop page
│   │   ├── produits/          # Product pages
│   │   ├── checkout/          # Checkout page
│   │   └── ...                # Other pages
│   ├── components/            # All React components
│   ├── contexts/              # React contexts
│   ├── hooks/                 # Custom hooks
│   ├── services/              # API services
│   ├── utils/                 # Utility functions
│   └── data/                  # Static data
├── public/                    # Static assets
├── next.config.js            # Next.js configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── package.json              # Dependencies
```

### 🔄 Key Changes Made

1. **Routing System**:
   - React Router → Next.js App Router
   - File-based routing with dynamic routes
   - Layout components for shared UI

2. **Component Updates**:
   - Added `'use client'` directive to client components
   - Updated imports from React Router to Next.js navigation
   - Adapted components to work with SSR

3. **Configuration**:
   - Next.js config with image optimization
   - TypeScript support
   - Updated Tailwind configuration
   - Environment variables setup

4. **Dependencies**:
   - Removed Vite-specific packages
   - Added Next.js and related packages
   - Updated build scripts

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Navigate to the Next.js app directory**:
   ```bash
   cd nextjs-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Copy `.env.local` and update values as needed
   - Configure API endpoints

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   - Visit `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
NEXT_PUBLIC_USE_MOCK_API=false
NODE_ENV=development
```

### API Configuration

The API configuration has been updated in `src/config.js` to work with Next.js environment variables.

## 🚀 New Capabilities

With Next.js, you can now add:

1. **Server-Side Rendering (SSR)**
2. **Static Site Generation (SSG)**
3. **API Routes** (`/api` endpoints)
4. **Image Optimization**
5. **Built-in SEO optimization**
6. **Automatic code splitting**
7. **Edge runtime support**

## 📝 Migration Notes

### Components That Required Updates

- **MainLayout**: Updated to use Next.js navigation hooks
- **ProductDetailPage**: Modified to accept props instead of using useParams
- **All client components**: Added `'use client'` directive

### Routing Changes

| Old Route (React Router) | New Route (Next.js) |
|-------------------------|---------------------|
| `/` | `/` |
| `/shop` | `/shop` |
| `/menu` | `/shop` (redirect) |
| `/produits/:productId` | `/produits/[productId]` |
| `/checkout` | `/checkout` |
| `/verify-email` | `/verify-email` |

### Known Issues & TODOs

- [ ] Test all components for SSR compatibility
- [ ] Implement Next.js Image component for better performance
- [ ] Add API routes for server-side functionality
- [ ] Optimize for production deployment
- [ ] Add proper error boundaries
- [ ] Implement proper loading states

## 🔄 Development Workflow

1. **Development**: `npm run dev`
2. **Build**: `npm run build`
3. **Start**: `npm start`
4. **Lint**: `npm run lint`

## 📚 Next Steps

1. **Test the application thoroughly**
2. **Implement server-side features as needed**
3. **Optimize images with Next.js Image component**
4. **Add API routes for backend functionality**
5. **Deploy to production**

## 🆘 Troubleshooting

### Common Issues

1. **Hydration Errors**: Make sure client-only code is properly handled
2. **Import Errors**: Check path aliases in `tsconfig.json`
3. **Environment Variables**: Ensure they're prefixed with `NEXT_PUBLIC_` for client-side access

### Getting Help

- Check Next.js documentation: https://nextjs.org/docs
- Review the migration guide: https://nextjs.org/docs/app/building-your-application/upgrading

---

**Migration completed successfully!** 🎉

The DikaFood application is now running on Next.js 14 with modern features and improved performance capabilities.
