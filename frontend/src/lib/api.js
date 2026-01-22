/**
 * API utility functions for making authenticated requests
 */
const API_BASE_URL = 'http://localhost:5001/api'

/**
 * Get auth headers with user ID
 */
export function getAuthHeaders() {
  const userStr = localStorage.getItem('salon_user')
  if (!userStr) return {}
  
  try {
    const user = JSON.parse(userStr)
    return {
      'X-User-Id': user.id.toString(),
      'Content-Type': 'application/json'
    }
  } catch (e) {
    return { 'Content-Type': 'application/json' }
  }
}

/**
 * Make an authenticated API request
 */
export async function apiRequest(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`
  const headers = {
    ...getAuthHeaders(),
    ...(options.headers || {})
  }
  
  const response = await fetch(url, {
    ...options,
    headers
  })
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(error.error || `HTTP ${response.status}`)
  }
  
  return response.json()
}

/**
 * Check if current user is admin
 */
export function isAdmin() {
  const userStr = localStorage.getItem('salon_user')
  if (!userStr) return false
  
  try {
    const user = JSON.parse(userStr)
    return user.role === 'admin'
  } catch (e) {
    return false
  }
}

/**
 * Check if current user is manager
 */
export function isManager() {
  const userStr = localStorage.getItem('salon_user')
  if (!userStr) return false
  
  try {
    const user = JSON.parse(userStr)
    return user.role === 'manager'
  } catch (e) {
    return false
  }
}

/**
 * Get current user
 */
export function getCurrentUser() {
  const userStr = localStorage.getItem('salon_user')
  if (!userStr) return null
  
  try {
    return JSON.parse(userStr)
  } catch (e) {
    return null
  }
}
