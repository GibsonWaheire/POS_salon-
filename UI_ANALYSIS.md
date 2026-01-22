# Backend Routes to UI Mapping Analysis

## Overview
This document maps all backend API endpoints to existing frontend UIs and identifies missing or incomplete UIs.

---

## ✅ **EXISTING UIs (Fully Implemented)**

### 1. **Authentication**
- **Backend:** `/api/auth/login` (POST)
- **Frontend:** `Login.jsx` ✅
- **Status:** Complete

### 2. **Staff Authentication**
- **Backend:** 
  - `/api/staff/login` (POST)
  - `/api/staff/logout` (POST)
  - `/api/staff/check-session` (GET)
- **Frontend:** `StaffLogin.jsx` ✅
- **Status:** Complete

### 3. **Dashboard**
- **Backend:** 
  - `/api/dashboard/stats` (GET)
  - `/api/dashboard/stats/demo` (GET)
- **Frontend:** `Dashboard.jsx` ✅
- **Status:** Complete

### 4. **Services Management**
- **Backend:**
  - `/api/services` (GET, POST)
  - `/api/services/<id>` (GET, PUT, DELETE)
- **Frontend:** `Services.jsx` ✅
- **Status:** Complete

### 5. **Products/Inventory**
- **Backend:**
  - `/api/products` (GET, POST)
  - `/api/products/<id>` (GET, PUT, DELETE)
  - `/api/products/<id>/adjust-stock` (POST)
- **Frontend:** `Inventory.jsx` ✅
- **Status:** Complete

### 6. **Staff Management**
- **Backend:**
  - `/api/staff` (GET, POST)
  - `/api/staff/<id>` (GET, PUT, DELETE)
  - `/api/staff/<id>/login-history` (GET)
  - `/api/staff/<id>/role` (PUT)
  - `/api/staff/<id>/performance` (GET)
  - `/api/staff/<id>/toggle-demo-mode` (POST)
  - `/api/staff/<id>/stats` (GET)
  - `/api/staff/<id>/commission-history` (GET)
  - `/api/staff/<id>/weekly-transactions` (GET)
- **Frontend:** `Staff.jsx` ✅
- **Status:** Complete (has tabs for details, login history, performance)

### 7. **POS (Point of Sale)**
- **Backend:**
  - `/api/sales` (POST, GET)
  - `/api/sales/<id>/complete` (POST)
  - `/api/sales/<id>` (GET)
- **Frontend:** `POS.jsx` ✅
- **Status:** Complete

### 8. **Payments**
- **Backend:**
  - `/api/payments` (GET, POST)
  - `/api/payments/<id>` (GET, PUT)
- **Frontend:** `Payments.jsx` ✅
- **Status:** Complete

### 9. **Commission Payments**
- **Backend:**
  - `/api/commissions/pending` (GET)
  - `/api/commissions/payments` (GET)
  - `/api/commissions/pay` (POST)
  - `/api/commissions/payments/<id>/receipt` (GET)
- **Frontend:** `CommissionPayments.jsx` ✅
- **Status:** Complete

### 10. **Expenses**
- **Backend:**
  - `/api/expenses` (GET, POST)
  - `/api/expenses/<id>` (GET, PUT, DELETE)
- **Frontend:** `Expenses.jsx` ✅
- **Status:** Complete

### 11. **Reports**
- **Backend:**
  - `/api/reports/daily-sales` (GET)
  - `/api/reports/commission-payout` (GET)
  - `/api/reports/financial-summary` (GET)
  - `/api/reports/tax-report` (GET)
- **Frontend:** `Reports.jsx` ✅
- **Status:** Complete (has tabs for different reports)

### 12. **Staff Commission History**
- **Backend:** `/api/staff/<id>/commission-history` (GET)
- **Frontend:** `StaffCommissionHistory.jsx` ✅
- **Status:** Complete

---

## ⚠️ **PARTIALLY IMPLEMENTED / NEEDS IMPROVEMENT**

### 1. **Customers Management**
- **Backend:**
  - `/api/customers` (GET, POST)
  - `/api/customers/<id>` (GET, PUT, DELETE)
- **Frontend:** `Customers.jsx` ⚠️
- **Status:** **INCOMPLETE** - Has basic structure but not fully functional
- **Needs:**
  - Full CRUD operations implementation
  - Customer list display
  - Edit/Delete functionality
  - Customer details view
  - Search/filter functionality

---

## ❌ **MISSING UIs (Backend Endpoints Exist, No Frontend)**

### 1. **Shifts Management** 🔴 **HIGH PRIORITY**
- **Backend:**
  - `/api/shifts` (GET, POST)
  - `/api/shifts/<id>/clock-in` (POST)
  - `/api/shifts/<id>/clock-out` (POST)
- **Frontend:** ❌ **MISSING**
- **Suggested UI:** `Shifts.jsx`
- **Features Needed:**
  - View all shifts (with filters by staff, date range)
  - Create new shifts
  - Clock in/out functionality
  - Shift calendar view
  - Shift history
  - Staff attendance tracking

### 2. **Appointments** 🔴 **HIGH PRIORITY** (if used)
- **Backend:** Check if appointment endpoints exist
- **Frontend:** ❌ **MISSING** (if backend exists)
- **Note:** May not be needed if using walk-in only POS

### 3. **Customer Details View**
- **Backend:** `/api/customers/<id>` (GET)
- **Frontend:** ❌ **MISSING** (detailed view)
- **Suggested UI:** Add to `Customers.jsx` or create `CustomerDetails.jsx`
- **Features Needed:**
  - Customer profile
  - Purchase history
  - Loyalty points
  - Visit history
  - Notes/preferences

---

## 📋 **SUGGESTED NEW UIs TO CREATE**

### 1. **Shifts Management Page** (Priority: HIGH)
**File:** `frontend/src/pages/Shifts.jsx`

**Features:**
- Calendar view of shifts
- Create/edit shifts
- Clock in/out interface
- Staff attendance report
- Shift history
- Filter by staff member, date range

**API Endpoints to Use:**
- `GET /api/shifts` - List all shifts
- `POST /api/shifts` - Create shift
- `POST /api/shifts/<id>/clock-in` - Clock in
- `POST /api/shifts/<id>/clock-out` - Clock out

---

### 2. **Customer Management Enhancement** (Priority: MEDIUM)
**File:** `frontend/src/pages/Customers.jsx` (enhance existing)

**Features to Add:**
- Full CRUD operations
- Customer search/filter
- Customer details modal/page
- Purchase history per customer
- Loyalty points display
- Customer notes/preferences

**API Endpoints to Use:**
- `GET /api/customers` - List customers
- `POST /api/customers` - Create customer
- `GET /api/customers/<id>` - Get customer details
- `PUT /api/customers/<id>` - Update customer
- `DELETE /api/customers/<id>` - Delete customer

---

### 3. **Sales History/Details View** (Priority: MEDIUM)
**File:** `frontend/src/pages/Sales.jsx` or enhance `Payments.jsx`

**Features:**
- Detailed sale view
- Sale items breakdown (services + products)
- Sale receipt reprint
- Filter by date, staff, customer
- Sales analytics

**API Endpoints to Use:**
- `GET /api/sales` - List all sales (already used in POS)
- `GET /api/sales/<id>` - Get sale details

---

### 4. **Staff Performance Dashboard** (Priority: LOW)
**File:** `frontend/src/pages/StaffPerformance.jsx` or enhance `Staff.jsx`

**Features:**
- Performance metrics per staff
- Sales trends
- Commission trends
- Attendance stats
- Comparison charts

**API Endpoints to Use:**
- `GET /api/staff/<id>/performance` - Already exists
- `GET /api/staff/<id>/stats` - Already exists
- `GET /api/staff/<id>/commission-history` - Already exists

---

## 🎨 **UI COMPONENTS TO CREATE/ENHANCE**

### 1. **Calendar Component** (for Shifts)
- Reusable calendar component for shift scheduling
- Can be used for appointments if needed later

### 2. **Clock In/Out Widget**
- Quick clock in/out interface
- Could be added to staff dashboard or POS

### 3. **Customer Search/Filter Component**
- Reusable search component
- Autocomplete for customer selection

### 4. **Sale Details Modal**
- Expandable sale details
- Show services and products separately
- Reprint receipt option

---

## 📊 **SUMMARY**

### Total Backend Endpoints: 59
### Fully Implemented UIs: 12
### Partially Implemented: 1 (Customers)
### Missing UIs: 1 (Shifts - HIGH PRIORITY)

### Priority Actions:
1. **HIGH:** Create Shifts Management UI (`Shifts.jsx`)
2. **MEDIUM:** Complete Customers Management UI
3. **MEDIUM:** Add Sales History/Details view
4. **LOW:** Enhance Staff Performance dashboard

---

## 🔗 **ROUTING UPDATES NEEDED**

When creating new UIs, update `frontend/src/App.jsx`:

```jsx
// Add to imports
import Shifts from "./pages/Shifts"

// Add route
<Route
  path="/shifts"
  element={
    <ProtectedRoute>
      <Layout />
    </ProtectedRoute>
  }
>
  <Route index element={<Shifts />} />
</Route>
```

---

## 📝 **NOTES**

- All existing UIs follow a consistent pattern using Shadcn UI components
- Most UIs use Card, Table, Dialog, Button, Input components
- Error handling is user-friendly (no technical messages)
- Demo mode support is integrated where needed
- All monetary values use `formatKES()` helper function

---

**Last Updated:** Based on current codebase analysis
**Status:** Ready for implementation
