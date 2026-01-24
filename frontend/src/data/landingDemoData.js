/**
 * Demo data for Landing page interactive demo section
 */

// Helper function to convert KES to USD (demo data is in KES)
export const convertKESToUSD = (kesAmount) => {
  return kesAmount / 130 // 1 USD = 130 KES
}

export const demoServices = [
  { id: 1, name: "Haircut & Style", price: 1000, duration: 45, category: "hair", description: "Professional haircut and styling" },
  { id: 2, name: "Blowout", price: 750, duration: 30, category: "hair", description: "Professional blow dry styling" },
  { id: 3, name: "Color - Full Head", price: 2500, duration: 120, category: "hair", description: "Full head hair coloring service" },
  { id: 4, name: "Highlights", price: 3000, duration: 150, category: "hair", description: "Hair highlighting service" },
  { id: 5, name: "Balayage", price: 3500, duration: 180, category: "hair", description: "Balayage hair coloring technique" },
  { id: 6, name: "Cornrows", price: 1500, duration: 90, category: "hair", description: "Traditional cornrow braiding" },
  { id: 7, name: "Manicure", price: 800, duration: 45, category: "nails", description: "Professional nail care and polish" },
  { id: 8, name: "Pedicure", price: 1000, duration: 60, category: "nails", description: "Professional foot care and polish" },
  { id: 9, name: "Facial Treatment", price: 2000, duration: 60, category: "facial", description: "Deep cleansing facial treatment" },
  { id: 10, name: "Bridal Package", price: 15000, duration: 240, category: "bridal", description: "Complete bridal makeover package" },
]

export const demoRecentTransactions = [
  { id: 1, client: "Walk-in", time: "05:41", method: "CASH", amount: 750, commission: 323.27 },
  { id: 2, client: "Walk-in", time: "16:31", method: "CASH", amount: 5000, commission: 2155.17 },
  { id: 3, client: "Walk-in", time: "13:09", method: "M_PESA", amount: 6750, commission: 2909.48 },
  { id: 4, client: "Sarah M.", time: "10:15", method: "M_PESA", amount: 2500, commission: 1077.59 },
  { id: 5, client: "John D.", time: "14:22", method: "CASH", amount: 1500, commission: 646.55 },
]

export const demoDashboardStats = {
  today_revenue: 45000,
  total_commission: 18500,
  active_staff_count: 3,
  total_staff_count: 8,
  currently_logged_in: [
    { id: 1, name: "Jane Doe", role: "stylist", login_time: "08:30" },
    { id: 2, name: "Mary Smith", role: "stylist", login_time: "09:15" },
    { id: 3, name: "Peter Kimani", role: "barber", login_time: "10:00" },
  ],
  recent_transactions: demoRecentTransactions.slice(0, 5),
  staff_performance: [
    { id: 1, name: "Jane Doe", sales: 12500, commission: 5387.93, clients: 8 },
    { id: 2, name: "Mary Smith", sales: 9800, commission: 4224.14, clients: 6 },
    { id: 3, name: "Peter Kimani", sales: 15200, commission: 6551.72, clients: 10 },
  ]
}

export const demoStaffList = [
  { id: 1, name: "Jane Doe", phone: "0712345678", email: "jane@example.com", role: "stylist", is_active: true },
  { id: 2, name: "Mary Smith", phone: "0723456789", email: "mary@example.com", role: "stylist", is_active: true },
  { id: 3, name: "Peter Kimani", phone: "0734567890", email: "peter@example.com", role: "barber", is_active: true },
  { id: 4, name: "Grace Wanjiru", phone: "0745678901", email: "grace@example.com", role: "nail_technician", is_active: true },
  { id: 5, name: "David Ochieng", phone: "0756789012", email: "david@example.com", role: "barber", is_active: false },
  { id: 6, name: "Lucy Muthoni", phone: "0767890123", email: "lucy@example.com", role: "stylist", is_active: true },
]

export const demoShifts = [
  { id: 1, staff_name: "Jane Doe", date: "2026-01-24", start_time: "08:00", end_time: "17:00", status: "completed" },
  { id: 2, staff_name: "Mary Smith", date: "2026-01-24", start_time: "09:00", end_time: "18:00", status: "active" },
  { id: 3, staff_name: "Peter Kimani", date: "2026-01-24", start_time: "10:00", end_time: "19:00", status: "active" },
  { id: 4, staff_name: "Grace Wanjiru", date: "2026-01-25", start_time: "08:00", end_time: "17:00", status: "scheduled" },
]

export const demoCommissionPayments = [
  { id: 1, staff_name: "Jane Doe", period: "2026-01-17 to 2026-01-23", amount: 12500, status: "pending" },
  { id: 2, staff_name: "Mary Smith", period: "2026-01-17 to 2026-01-23", amount: 9800, status: "pending" },
  { id: 3, staff_name: "Peter Kimani", period: "2026-01-17 to 2026-01-23", amount: 15200, status: "paid", paid_date: "2026-01-20" },
]

export const demoPayments = [
  { id: 1, date: "2026-01-24", time: "10:15", customer: "Sarah M.", amount: 2500, method: "M_PESA", status: "completed" },
  { id: 2, date: "2026-01-24", time: "14:22", customer: "John D.", amount: 1500, method: "CASH", status: "completed" },
  { id: 3, date: "2026-01-24", time: "16:31", customer: "Walk-in", amount: 5000, method: "CASH", status: "completed" },
]

export const demoSales = [
  { id: 1, date: "2026-01-24", customer: "Sarah M.", items: "Haircut & Style, Blowout", total: 2500, staff: "Jane Doe", status: "completed" },
  { id: 2, date: "2026-01-24", customer: "John D.", items: "Color - Full Head", total: 1500, staff: "Mary Smith", status: "completed" },
  { id: 3, date: "2026-01-24", customer: "Walk-in", items: "Balayage, Manicure", total: 5000, staff: "Peter Kimani", status: "completed" },
]

export const demoAppointments = [
  { id: 1, customer: "Sarah M.", service: "Haircut & Style", date: "2026-01-25", time: "10:00", staff: "Jane Doe", status: "scheduled" },
  { id: 2, customer: "John D.", service: "Color - Full Head", date: "2026-01-25", time: "14:00", staff: "Mary Smith", status: "scheduled" },
  { id: 3, customer: "Grace K.", service: "Bridal Package", date: "2026-01-26", time: "09:00", staff: "Jane Doe", status: "scheduled" },
]

export const demoInventory = [
  { id: 1, name: "Hair Shampoo", category: "Hair Care", quantity: 45, unit: "bottles", low_stock_threshold: 10 },
  { id: 2, name: "Nail Polish - Red", category: "Nail Care", quantity: 32, unit: "bottles", low_stock_threshold: 15 },
  { id: 3, name: "Hair Color - Blonde", category: "Hair Care", quantity: 8, unit: "boxes", low_stock_threshold: 10 },
  { id: 4, name: "Conditioner", category: "Hair Care", quantity: 28, unit: "bottles", low_stock_threshold: 10 },
]

export const demoExpenses = [
  { id: 1, date: "2026-01-20", category: "Supplies", description: "Hair products purchase", amount: 15000, paid_by: "Manager" },
  { id: 2, date: "2026-01-22", category: "Utilities", description: "Electricity bill", amount: 5000, paid_by: "Manager" },
  { id: 3, date: "2026-01-23", category: "Rent", description: "Monthly salon rent", amount: 50000, paid_by: "Manager" },
]

export const demoUsers = [
  { id: 1, name: "Admin User", email: "admin@salonyst.com", role: "admin", is_active: true },
  { id: 2, name: "Manager One", email: "manager1@salonyst.com", role: "manager", is_active: true },
  { id: 3, name: "Manager Two", email: "manager2@salonyst.com", role: "manager", is_active: false },
]

export const demoStaffPOSData = {
  staff_name: "Demo Staff",
  today_commission: 2450,
  clients_served: 5,
  recent_transactions: demoRecentTransactions.slice(0, 3)
}
