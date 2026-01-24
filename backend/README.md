# Salon POS Backend API

Flask backend API for the Salon POS system.

## Setup

1. Create a virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Run the application:
```bash
python app.py
```

The API will be available at `http://localhost:5001`

## API Endpoints

### Health Check
- `GET /api/health` - Check API status

### Authentication
- `POST /api/auth/login` - Admin/Manager login (email + password)
- `POST /api/auth/logout` - Logout current session
- `GET /api/auth/me` - Get current authenticated user

### Users (Admin only)
- `GET /api/users` - Get all users (admin/manager accounts)
- `GET /api/users/managers` - Get all manager users
- `POST /api/users` - Create a new user (admin only)
- `GET /api/users/<id>` - Get a specific user
- `PUT /api/users/<id>` - Update a user
- `DELETE /api/users/<id>` - Delete a user

### Staff
- `GET /api/staff` - Get all staff members
- `POST /api/staff` - Create a new staff member
- `GET /api/staff/<id>` - Get a specific staff member
- `PUT /api/staff/<id>` - Update a staff member
- `DELETE /api/staff/<id>` - Delete a staff member
- `POST /api/staff/login` - Staff login (staff_id + PIN)

### Customers
- `GET /api/customers` - Get all customers (supports `demo_mode` query param)
- `POST /api/customers` - Create a new customer (supports `demo_mode` query param)
- `GET /api/customers/<id>` - Get a specific customer
- `PUT /api/customers/<id>` - Update a customer
- `DELETE /api/customers/<id>` - Delete a customer
- `GET /api/customers/<id>/sales` - Get sales history for a customer
- `POST /api/customers/<id>/redeem-points` - Redeem loyalty points for discount

### Services
- `GET /api/services` - Get all services
- `POST /api/services` - Create a new service
- `GET /api/services/<id>` - Get a specific service
- `PUT /api/services/<id>` - Update a service
- `DELETE /api/services/<id>` - Delete a service
- `GET /api/services/<id>/price-history` - Get price change history for a service

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create a new product
- `GET /api/products/<id>` - Get a specific product
- `PUT /api/products/<id>` - Update a product
- `DELETE /api/products/<id>` - Delete a product

### Sales
- `GET /api/sales` - Get all sales (supports `staff_id`, `status`, `start_date`, `end_date`, `demo_mode` query params)
- `POST /api/sales` - Create a new sale (walk-in transaction)
- `GET /api/sales/<id>` - Get sale details
- `POST /api/sales/<id>/complete` - Complete a sale (process payment)
- `GET /api/sales/<id>/receipt` - Download sales receipt as PDF

### Payments
- `GET /api/payments` - Get all payments (supports `demo_mode` query param)
- `POST /api/payments` - Create a new payment
- `GET /api/payments/<id>` - Get a specific payment
- `PUT /api/payments/<id>` - Update a payment

### Shifts
- `GET /api/shifts` - Get all shifts (supports `staff_id`, `start_date`, `end_date` query params)
- `POST /api/shifts` - Create a new shift
- `PUT /api/shifts/<id>` - Update a shift (only scheduled/missed shifts)
- `DELETE /api/shifts/<id>` - Delete a shift (only scheduled/missed shifts)
- `POST /api/shifts/<id>/clock-in` - Clock in for a shift
- `POST /api/shifts/<id>/clock-out` - Clock out from a shift

### Commission Payments
- `GET /api/commissions/pending` - Get pending commission payments
- `GET /api/commissions/payments` - Get all commission payment records
- `POST /api/commissions/pay` - Process commission payment
- `GET /api/commissions/payments/<id>` - Get commission payment details
- `GET /api/commissions/payments/<id>/payslip` - Download payslip PDF

### Reports
- `GET /api/reports/daily-sales` - Get daily sales report (supports `start_date`, `end_date`, `demo_mode` query params)
- `GET /api/reports/commission-payout` - Get commission payout report (supports `start_date`, `end_date`, `staff_id`, `demo_mode` query params)
- `GET /api/reports/financial-summary` - Get financial summary report (supports `start_date`, `end_date`, `demo_mode` query params)
- `GET /api/reports/tax-summary` - Get tax summary for KRA (supports `start_date`, `end_date`, `demo_mode` query params)

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics (supports `demo_mode` query param)
- `GET /api/dashboard/recent-sales` - Get recent sales (supports `limit`, `demo_mode` query params)
- `GET /api/dashboard/top-services` - Get top selling services (supports `limit`, `demo_mode` query params)

### Expenses
- `GET /api/expenses` - Get all expenses (supports `category`, `start_date`, `end_date`, `demo_mode` query params)
- `POST /api/expenses` - Create a new expense
- `GET /api/expenses/<id>` - Get a specific expense
- `PUT /api/expenses/<id>` - Update an expense
- `DELETE /api/expenses/<id>` - Delete an expense

### Appointments (Legacy - not actively used in walk-in model)
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create a new appointment (include `service_ids` array in body)
- `GET /api/appointments/<id>` - Get a specific appointment
- `PUT /api/appointments/<id>` - Update an appointment
- `DELETE /api/appointments/<id>` - Delete an appointment

## Database Models

- **User** - Admin/Manager user accounts (email + password authentication)
- **Customer** - Customer information with loyalty points tracking
- **Service** - Salon services (haircuts, styling, etc.) with price history
- **ServicePriceHistory** - Historical record of service price changes
- **Product** - Products/inventory items
- **Staff** - Staff/employee information (PIN-based authentication)
- **Sale** - Sales transactions (walk-in model)
- **SaleService** - Services included in a sale
- **SaleProduct** - Products included in a sale
- **Payment** - Payment transactions linked to sales
- **Shift** - Staff shift schedules and attendance tracking
- **CommissionPayment** - Commission payment records with professional structure (base pay, deductions, etc.)
- **CommissionPaymentItem** - Individual items (earnings/deductions) in commission payments
- **Expense** - Business expenses by category
- **Appointment** - Appointment bookings (legacy, not actively used)
- **AppointmentService** - Services linked to appointments
- **ProductUsage** - Product usage tracking for inventory
- **StaffLoginLog** - Staff login history

## Database Migrations

This project uses Flask-Migrate for database schema version control.

### Initial Setup

1. **Initialize migrations** (first time only):
```bash
export FLASK_APP=app.py
flask db init
```

2. **Create initial migration** (if starting fresh):
```bash
flask db migrate -m "Initial migration"
```

3. **Apply migrations**:
```bash
flask db upgrade
```

### Working with Migrations

- **Create a new migration** after model changes:
```bash
flask db migrate -m "Description of changes"
```

- **Apply pending migrations**:
```bash
flask db upgrade
```

- **Rollback last migration**:
```bash
flask db downgrade
```

- **View migration history**:
```bash
flask db history
```

- **Mark database as current** (if schema already matches):
```bash
flask db stamp head
```

## CLI Commands

Flask CLI commands are available for managing the application:

```bash
# Set Flask app (if not using python app.py)
export FLASK_APP=app.py

# Initialize database - apply all migrations
flask init-db

# Seed demo staff users (for development/demo)
flask seed-staff

# Force reseed demo staff (removes existing and creates new)
flask seed-staff --force

# List all staff members
flask list-staff

# Show demo login credentials
flask show-demo-login

# Create a new staff member (interactive)
flask create-staff

# Reset database - DROP ALL TABLES (WARNING: Destructive!)
flask reset-db
```

### Demo Staff Login Credentials

For development/demo purposes, use these PINs at `/staff-login`:

- **Jane Wanjiru** - PIN: `1234@` - Role: stylist
- **Sarah Akinyi** - PIN: `5678!` - Role: stylist  
- **Mary Nyambura** - PIN: `9012#` - Role: nail_technician
- **Grace Muthoni** - PIN: `3456$` - Role: facial_specialist
- **Lucy Wambui** - PIN: `7890%` - Role: receptionist

Run `flask show-demo-login` to see current demo credentials.

## Development

The database uses Flask-Migrate for schema management. After installing dependencies, run:

```bash
export FLASK_APP=app.py
flask db init          # First time only
flask db migrate -m "Initial migration"  # If creating initial migration
flask db upgrade      # Apply migrations
```

Or use the CLI command:
```bash
flask init-db  # Applies all migrations
```

Demo staff users are automatically seeded on startup if they don't exist.

