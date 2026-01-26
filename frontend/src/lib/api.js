/**
 * API utility functions for making authenticated requests
 */
import { API_BASE_URL } from '../config/api'

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

// Appointment API helpers
export async function rescheduleAppointment(id, newDate) {
  return apiRequest(`/appointments/${id}/reschedule`, {
    method: "POST",
    body: JSON.stringify({ appointment_date: newDate })
  })
}

export async function addAppointmentNote(id, noteText) {
  return apiRequest(`/appointments/${id}/notes`, {
    method: "POST",
    body: JSON.stringify({ note_text: noteText })
  })
}

export async function getAppointmentNotes(id) {
  return apiRequest(`/appointments/${id}/notes`)
}

export async function updateAppointmentColor(id, color) {
  return apiRequest(`/appointments/${id}/color`, {
    method: "PUT",
    body: JSON.stringify({ color })
  })
}

export async function createRecurringAppointment(data) {
  return apiRequest("/appointments/recurring", {
    method: "POST",
    body: JSON.stringify(data)
  })
}

export async function cancelRecurringSeries(id) {
  return apiRequest(`/appointments/recurring/${id}`, {
    method: "DELETE"
  })
}

export async function getSlotBlockers(filters = {}) {
  const params = new URLSearchParams()
  if (filters.staff_id) params.append('staff_id', filters.staff_id)
  if (filters.start_date) params.append('start_date', filters.start_date)
  if (filters.end_date) params.append('end_date', filters.end_date)
  const query = params.toString()
  return apiRequest(`/slot-blockers${query ? `?${query}` : ''}`)
}

export async function createSlotBlocker(data) {
  return apiRequest("/slot-blockers", {
    method: "POST",
    body: JSON.stringify(data)
  })
}

export async function updateSlotBlocker(id, data) {
  return apiRequest(`/slot-blockers/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  })
}

export async function deleteSlotBlocker(id) {
  return apiRequest(`/slot-blockers/${id}`, {
    method: "DELETE"
  })
}

export async function getResources() {
  return apiRequest("/resources")
}

export async function createResource(data) {
  return apiRequest("/resources", {
    method: "POST",
    body: JSON.stringify(data)
  })
}

export async function updateResource(id, data) {
  return apiRequest(`/resources/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  })
}

export async function deleteResource(id) {
  return apiRequest(`/resources/${id}`, {
    method: "DELETE"
  })
}

export async function exportCalendar(format = 'ical', filters = {}) {
  const params = new URLSearchParams()
  params.append('format', format)
  if (filters.start_date) params.append('start_date', filters.start_date)
  if (filters.end_date) params.append('end_date', filters.end_date)
  const url = `${API_BASE_URL}/appointments/calendar/export?${params.toString()}`
  window.open(url, '_blank')
}
