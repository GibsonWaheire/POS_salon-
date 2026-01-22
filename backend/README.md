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

### Customers
- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create a new customer
- `GET /api/customers/<id>` - Get a specific customer
- `PUT /api/customers/<id>` - Update a customer
- `DELETE /api/customers/<id>` - Delete a customer

### Services
- `GET /api/services` - Get all services
- `POST /api/services` - Create a new service
- `GET /api/services/<id>` - Get a specific service
- `PUT /api/services/<id>` - Update a service
- `DELETE /api/services/<id>` - Delete a service

### Staff
- `GET /api/staff` - Get all staff members
- `POST /api/staff` - Create a new staff member
- `GET /api/staff/<id>` - Get a specific staff member
- `PUT /api/staff/<id>` - Update a staff member
- `DELETE /api/staff/<id>` - Delete a staff member

### Appointments
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create a new appointment (include `service_ids` array in body)
- `GET /api/appointments/<id>` - Get a specific appointment
- `PUT /api/appointments/<id>` - Update an appointment
- `DELETE /api/appointments/<id>` - Delete an appointment

### Payments
- `GET /api/payments` - Get all payments
- `POST /api/payments` - Create a new payment
- `GET /api/payments/<id>` - Get a specific payment
- `PUT /api/payments/<id>` - Update a payment

## Database Models

- **Customer** - Customer information
- **Service** - Salon services (haircuts, styling, etc.)
- **Staff** - Staff/employee information
- **Appointment** - Appointment bookings
- **AppointmentService** - Services linked to appointments
- **Payment** - Payment transactions

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

