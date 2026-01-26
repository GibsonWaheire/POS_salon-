/**
 * API Configuration
 * Uses environment variable VITE_API_BASE_URL or defaults to localhost for development
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api'
