import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import Inspect from 'vite-plugin-inspect';
import path from 'path';

// Import base config to extend
import baseConfig from './vite.config';

// Define a development configuration that extends the base config
export default defineConfig({
  ...baseConfig,
  plugins: [
    ...baseConfig.plugins || [],
    Inspect({ // only applies in dev mode
      build: true,
      outputDir: '.vite-inspect'
    }),
  ],
  server: {
    ...baseConfig.server,
    host: '0.0.0.0',
    open: true,
    hmr: {
      overlay: true,
    }
  },
  // Enable sourcemaps for better debugging
  build: {
    ...baseConfig.build,
    sourcemap: true,
    minify: false, // Disable minification to see actual component names
  }
});