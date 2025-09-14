/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router is now stable, no need for experimental flag
  
  // Fix workspace root warning
  outputFileTracingRoot: __dirname,
  
  // Performance optimizations
  // Note: swcMinify is now default in Next.js 15
  
  // Turbopack configuration (replaces experimental.turbo)
  turbopack: {
    rules: {
      '*.svg': ['@svgr/webpack'],
    },
  },
  
  // Experimental features for better performance
  experimental: {
    // Optimize CSS
    optimizeCss: true,
    // Enable webpack build worker
    webpackBuildWorker: true,
  },
  
  // Image optimization
  images: {
    domains: ['dikafood.com', 'api.dikafood.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/menu',
        destination: '/shop',
        permanent: true,
      },
    ];
  },
  
  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // Webpack configuration for performance
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Optimize for development
    if (dev) {
      // Enable webpack caching for faster rebuilds
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
      };
      
      // Optimize resolve for faster module resolution
      config.resolve.symlinks = false;
      
      // Enable parallel processing
      config.optimization = {
        ...config.optimization,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
      };
    }
    
    return config;
  },
  
  // Output configuration for static export if needed
  // output: 'export',
  // trailingSlash: true,
  
  // Sass support
  sassOptions: {
    includePaths: ['./src/styles'],
  },
};

module.exports = nextConfig;
