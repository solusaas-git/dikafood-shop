import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Import base config to extend
import baseConfig from './vite.config';

// Define a debug configuration specifically for finding circular dependencies
export default defineConfig({
  ...baseConfig,
  plugins: [
    ...baseConfig.plugins || [],
    // Add additional debugging plugins if needed
  ],

  // Server configuration for debugging
  server: {
    ...baseConfig.server,
    host: '0.0.0.0',
    open: true,
    hmr: {
      overlay: true,
    }
  },

  // Override build options for debugging
  build: {
    ...baseConfig.build,
    // Disable minification to make code more readable
    minify: false,

    // Keep source maps for better debugging
    sourcemap: true,

    // Override rollup options for debugging
    rollupOptions: {
      ...baseConfig.build.rollupOptions,
      output: {
        // Use a more descriptive naming pattern
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/chunks/[name].[hash].js',
        // Don't use manual chunks in debug mode to better see dependencies
        manualChunks: undefined,
      },
    },

    // Don't drop console logs in debug mode
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: false,
      },
      keep_fnames: true,
      keep_classnames: true,
    },
  },

  // Add additional debug flags
  define: {
    __DEBUG_MODE__: JSON.stringify(true),
  },
});