import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { compression } from 'vite-plugin-compression2';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // Enable better support for React with JSX
    react({
      // Add better support for dynamic imports with React.lazy
      fastRefresh: true,
      include: ['**/*.jsx', '**/*.js'],
      babel: {
        plugins: [
          ['@babel/plugin-syntax-dynamic-import'],
        ],
      },
    }),
    // Add Brotli compression for smaller assets
    compression({
      algorithm: 'brotliCompress',
      exclude: [/\.(png|jpe?g|gif|svg|webp|avif)$/i],
    }),
    // Also add standard gzip compression as fallback
    compression({
      algorithm: 'gzip',
      exclude: [/\.(png|jpe?g|gif|svg|webp|avif)$/i],
    }),
  ],

  // Resolve aliases for cleaner imports
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src'),
      '@components': path.resolve(__dirname, '../src/components'),
      '@styles': path.resolve(__dirname, '../src/styles'),
      '@assets': path.resolve(__dirname, '../src/assets'),
      '@utils': path.resolve(__dirname, '../src/utils'),
      '@design-system': path.resolve(__dirname, '../src/design-system'),
      '@layouts': path.resolve(__dirname, '../src/layouts'),
    },
    extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json']
  },

  // Use postcss.config.js from the root
  css: {
    postcss: path.resolve(__dirname, '../postcss.config.js'),
  },

  // Build optimizations
  build: {
    // Specify the entry point
    rollupOptions: {
      input: resolve(__dirname, '../index.html'),
      output: {
        // Clean URLs in production
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',

        // Manual chunking for better caching
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['@phosphor-icons/react', 'tailwind-variants'],
        },
      },
    },

    // Smaller chunks for better caching
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,

    // Increase minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      // Preserve variable names to help debug issues like circular dependencies
      keep_fnames: true,
      keep_classnames: true,
    },

    // Reduce sourcemap size in production
    sourcemap: 'hidden',
  },

  // Dev server settings
  server: {
    port: 5173, // Frontend port (Vite default)
    host: '0.0.0.0', // Expose to all network interfaces
    open: true,
    strictPort: false,
    cors: true,
    // Improve error handling during development
    hmr: {
      overlay: true,
    },
    allowedHosts: [
      // Specific ngrok hosts
      '3b31-160-176-156-52.ngrok-free.app',
      // Allow all ngrok domains
      '.ngrok.io',
      '.ngrok-free.app'
    ],
    // Proxy API calls to the backend API server
    proxy: {
      // All /api requests go to the API server
      '/api': {
        target: 'http://localhost:3000', // API server port
        changeOrigin: true,
        secure: false,
        // Keep /api prefix as the backend expects it
      }
    }
  },

  // Improve HMR and code splitting
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@phosphor-icons/react',
      'tailwind-variants',
      'react-helmet-async',
      'react-device-detect',
      'react-international-phone'
    ],
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
        '.jsx': 'jsx',
      },
      jsx: 'automatic',
    },
  },

  // Ensure proper chunk handling
  experimental: {
    renderBuiltUrl(filename) {
      return '/' + filename;
    },
  }
});