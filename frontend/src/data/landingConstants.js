/**
 * Constants and configuration for Landing page
 */

import {
  Calendar,
  ClipboardList,
  LineChart,
  Users,
  Calculator,
  Grid3x3,
  Scissors,
  Clock,
  DollarSign,
  CreditCard,
  ShoppingCart,
  Package,
  TrendingDown,
  FileText,
  UserCircle as UserCircleIcon,
  Heart,
  Sparkles,
  Building2,
  Palette,
  Dog,
  LayoutGrid,
  CalendarOff,
  Move,
  StickyNote,
  Repeat,
  Tags,
  LayoutList,
  CalendarCheck,
  RefreshCw,
  Award,
  Quote
} from "lucide-react"
import { POS_TYPES } from "@/lib/posTypes"

export const features = [
  {
    title: "Appointment",
    icon: Calendar,
    subFeatures: [
      "Slot Blockers",
      "Drag & Drop Reschedule",
      "Popup Notes & History",
      "Recurring Bookings",
      "Color-Coded Appointments",
      "Resource Scheduling",
      "Calendar Sync & Export",
      "Easy Rescheduling"
    ]
  },
  {
    title: "Inventory",
    icon: ClipboardList,
    subFeatures: ["Centralized Inventory", "Audits Reports", "Inhouse Inventory", "Transparency", "Transfer Inventory"]
  },
  {
    title: "Marketing",
    icon: LineChart,
    subFeatures: ["Email Marketing", "Get More Reviews", "Coupons Management", "Gift Cards", "Loyalty System"]
  },
  {
    title: "Staff Payroll",
    icon: Users,
    subFeatures: ["Staff Commissions", "Payroll", "Staff Schedule", "KPI Reporting", "Notification"]
  },
  {
    title: "Point Of Sale",
    icon: Calculator,
    subFeatures: ["Manage Transactions", "Payment Gateway Integration", "Bulk Checkout", "Stripe Terminals", "Payment Reports"]
  }
]

export const salonTypes = [
  "Massage",
  "Hair",
  "Spa",
  "Make Up Artists",
  "Beauty",
  "Barber Shop",
  "Bridal",
  "Tattoo",
  "Pet Grooming",
  "Nail Salon",
  "Aesthetic Skin Care",
  "Salon Booth Rental",
]

export const trustedBrands = [
  "Glamour Hair Salon",
  "Elite Barbershop",
  "Beauty & Beyond Spa",
  "Nairobi Nails",
  "Royal Massage Center",
  "Bridal Beauty Studio",
  "Aesthetic Skin Clinic",
  "Pet Grooming Pro"
]

// Feature dropdown: icon + (path = route) or path null = scroll to #features-section
export const featureIcons = {
  all_features: LayoutGrid,
  slot_blockers: CalendarOff,
  drag_drop_reschedule: Move,
  popup_notes_history: StickyNote,
  recurring_bookings: Repeat,
  color_coded_appointments: Tags,
  resource_scheduling: LayoutList,
  calendar_sync_export: CalendarCheck,
  easy_rescheduling: RefreshCw,
  pos_system: Calculator,
  inventory: Package,
}

export const featuresDropdownItems = [
  [
    { id: "all_features", title: "All Features", description: "Explore everything Salonyst offers for your business.", path: null },
    { id: "slot_blockers", title: "Slot Blockers", description: "Block time for breaks, days off, or maintenance.", path: "/features/slot-blockers" },
    { id: "drag_drop_reschedule", title: "Drag & Drop Reschedule", description: "Reschedule appointments easily by dragging on the calendar.", path: "/features/drag-drop-reschedule" },
    { id: "popup_notes_history", title: "Popup Notes & History", description: "Add notes and view full appointment history.", path: "/features/popup-notes-history" },
  ],
  [
    { id: "recurring_bookings", title: "Recurring Bookings", description: "Set up repeating appointments for regular clients.", path: "/features/recurring-bookings" },
    { id: "color_coded_appointments", title: "Color-Coded Appointments", description: "Organize your calendar with custom colors.", path: "/features/color-coded-appointments" },
    { id: "resource_scheduling", title: "Resource Scheduling", description: "Manage rooms, stations, and equipment booking.", path: "/features/resource-scheduling" },
    { id: "calendar_sync_export", title: "Calendar Sync & Export", description: "Sync with Google Calendar and export data.", path: "/features/calendar-sync-export" },
  ],
  [
    { id: "easy_rescheduling", title: "Easy Rescheduling", description: "Quickly move or update appointments.", path: "/features/easy-rescheduling" },
    { id: "pos_system", title: "POS System", description: "Process sales, payments, and manage transactions.", path: null },
    { id: "inventory", title: "Inventory", description: "Track products, stock levels, and usage.", path: null },
  ],
]

// Why Salonist dropdown: same mega-menu style as Features/Solutions
export const whySalonistIcons = {
  about_us: Building2,
  why_choose_us: Award,
  success_stories: Quote,
}

export const whySalonistDropdownItems = [
  [
    { id: "about_us", title: "About Us", description: "Our mission, team, and commitment to beauty and wellness businesses.", path: "/about-us" },
  ],
  [
    { id: "why_choose_us", title: "Why Choose Us", description: "What makes Salonyst the preferred choice for salons and spas.", path: "/why-choose-us" },
  ],
  [
    { id: "success_stories", title: "Success Stories", description: "See how salons and beauty businesses grow with Salonyst.", path: "/success-stories" },
  ],
]

// Icon mapping for Solutions dropdown
export const solutionIcons = {
  barber_shop: Users,
  spa: Sparkles,
  hair: Scissors,
  bridal: Heart,
  aesthetic_skin_care: Sparkles,
  massage: Heart,
  nail_salon: Heart,
  tattoo: Palette,
  pet_grooming: Dog,
  salon_booth_rental: Building2,
  makeup_artists: Palette,
  beauty: Sparkles,
}

// Solutions dropdown items arranged in columns (matching image layout)
export const solutionsDropdownItems = [
  // Column 1
  [
    { id: "barber_shop", posType: POS_TYPES.barber_shop },
    { id: "spa", posType: POS_TYPES.spa },
    { id: "salon_booth_rental", posType: POS_TYPES.salon_booth_rental },
  ],
  // Column 2
  [
    { id: "hair", posType: POS_TYPES.hair },
    { id: "bridal", posType: POS_TYPES.bridal },
    { id: "aesthetic_skin_care", posType: POS_TYPES.aesthetic_skin_care },
  ],
  // Column 3
  [
    { id: "massage", posType: POS_TYPES.massage },
    { id: "nail_salon", posType: POS_TYPES.nail_salon },
    { id: "tattoo", posType: POS_TYPES.tattoo },
    { id: "pet_grooming", posType: POS_TYPES.pet_grooming },
  ],
]

export const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: Grid3x3 },
  { id: "staff", label: "Staff", icon: Users },
  { id: "services", label: "Services", icon: Scissors },
  { id: "shifts", label: "Shifts", icon: Clock },
  { id: "commission", label: "Commission Payments", icon: DollarSign },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "sales", label: "Sales", icon: ShoppingCart },
  { id: "pos", label: "POS", icon: Calculator },
  { id: "appointments", label: "Appointments", icon: Calendar },
  { id: "inventory", label: "Inventory", icon: Package },
  { id: "expenses", label: "Expenses", icon: TrendingDown },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "users", label: "Users", icon: UserCircleIcon },
]
