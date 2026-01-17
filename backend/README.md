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

The API will be available at `http://localhost:5000`

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

## Development

The database will be automatically created when you first run the application. The default database is SQLite (`pos_salon.db`).

