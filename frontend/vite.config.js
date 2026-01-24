import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 5173, // Frontend dev server port
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true
      }
    }
  },
  build: {
    // Minification is enabled by default in production
    minify: 'esbuild', // Use esbuild for faster builds (default: 'esbuild')
    // Alternative: 'terser' for better compression (slower)
    // minify: 'terser',
    
    // Chunk size warning limit (in kbs)
    chunkSizeWarningLimit: 1000,
    
    // Build optimizations
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-alert-dialog'
          ],
          'chart-vendor': ['recharts'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod']
        },
        // Optimize chunk file names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },
    
    // CSS minification
    cssMinify: true,
    
    // Source maps for production debugging (set to false for smaller builds)
    sourcemap: false,
    
    // esbuild options for minification
    esbuild: {
      // Remove console logs and debugger statements in production
      drop: ['console', 'debugger'],
      // Minify identifiers
      minifyIdentifiers: true,
      // Minify syntax
      minifySyntax: true,
      // Minify whitespace
      minifyWhitespace: true
    }
  }
})
