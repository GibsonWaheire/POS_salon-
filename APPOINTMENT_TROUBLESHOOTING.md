# Appointment Troubleshooting Guide

## Why No Appointments Show in POS

If you're not seeing appointments in the POS staff interface, check the following:

### 1. **Check if Appointments Exist**
   - Go to `/appointments` page (admin/manager view)
   - Or check database directly: `SELECT * FROM appointments WHERE status IN ('scheduled', 'pending')`

### 2. **Check Appointment Status**
   - Only appointments with status `'scheduled'` or `'pending'` appear in POS
   - Completed or cancelled appointments won't show

### 3. **Check Demo Mode Matching**
   - If staff is logged in with `is_demo=true`, only demo appointments show
   - If staff is logged in with `is_demo=false`, only non-demo appointments show
   - Check customer's `is_demo` flag matches staff's demo status

### 4. **Check Staff Assignment**
   - Appointments show if:
     - Assigned to current staff (`staff_id` matches logged-in staff)
     - OR unassigned (`staff_id` is NULL)
   - Appointments assigned to OTHER staff won't show

### 5. **Check Browser Console**
   - Open browser DevTools (F12)
   - Check Console tab for errors
   - Look for logs showing:
     - URL being called
     - Staff ID
     - Demo mode
     - Number of appointments returned

## How to Create Test Appointments

### Option 1: Using API Directly (via Postman/curl)

```bash
# Create a test appointment
curl -X POST http://localhost:5001/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": 1,
    "staff_id": null,
    "appointment_date": "2026-01-25T10:00:00",
    "status": "scheduled",
    "service_location": "salon",
    "service_ids": [1]
  }'
```

### Option 2: Using Python Script

Create a file `create_test_appointment.py`:

```python
import requests
import json
from datetime import datetime, timedelta

# Create appointment for tomorrow
appointment_date = (datetime.now() + timedelta(days=1)).isoformat()

data = {
    "customer_id": 1,  # Change to existing customer ID
    "staff_id": None,  # Leave null for unassigned, or set to staff ID
    "appointment_date": appointment_date,
    "status": "scheduled",
    "service_location": "salon",
    "service_ids": [1]  # Change to existing service IDs
}

response = requests.post(
    "http://localhost:5001/api/appointments",
    json=data,
    headers={"Content-Type": "application/json"}
)

print(f"Status: {response.status_code}")
print(f"Response: {json.dumps(response.json(), indent=2)}")
```

### Option 3: Using Flask Shell

```bash
cd backend
python -c "
from app import app
from models import Appointment, Customer, Service, AppointmentService
from db import db
from datetime import datetime, timedelta

with app.app_context():
    # Get first customer
    customer = Customer.query.first()
    if not customer:
        print('No customers found! Create a customer first.')
        exit()
    
    # Get first service
    service = Service.query.first()
    if not service:
        print('No services found! Create a service first.')
        exit()
    
    # Create appointment
    appointment = Appointment(
        customer_id=customer.id,
        staff_id=None,  # Unassigned
        appointment_date=datetime.now() + timedelta(days=1),
        status='scheduled',
        service_location='salon'
    )
    db.session.add(appointment)
    db.session.flush()
    
    # Add service
    apt_service = AppointmentService(
        appointment_id=appointment.id,
        service_id=service.id
    )
    db.session.add(apt_service)
    db.session.commit()
    
    print(f'Created appointment ID: {appointment.id}')
    print(f'Customer: {customer.name}')
    print(f'Service: {service.name}')
    print(f'Status: {appointment.status}')
"
```

### Option 4: Add Appointment Creation to Admin UI

You can add appointment creation functionality to the Appointments page or create a dedicated form.

## Quick Debugging Steps

1. **Check Backend Logs**
   ```bash
   # Look for appointment queries in Flask logs
   # Should see: GET /api/appointments/pending?demo_mode=...
   ```

2. **Check Database**
   ```sql
   -- Check appointments
   SELECT id, customer_id, staff_id, status, appointment_date, is_demo 
   FROM appointments;
   
   -- Check customers (for demo flag)
   SELECT id, name, is_demo FROM customers;
   
   -- Check staff (for demo flag)
   SELECT id, name, is_demo FROM staff;
   ```

3. **Test API Directly**
   ```bash
   # Test pending appointments endpoint
   curl "http://localhost:5001/api/appointments/pending?demo_mode=false&staff_id=1"
   ```

4. **Check Frontend Console**
   - Open browser DevTools
   - Check Network tab for `/api/appointments/pending` request
   - Check Response tab to see what data is returned

## Common Issues

### Issue: "No appointments found" but appointments exist in database
**Solution**: 
- Check appointment status (must be 'scheduled' or 'pending')
- Check demo mode matching between appointment's customer and staff
- Check staff_id filtering (appointment must be assigned to current staff OR unassigned)

### Issue: Appointments show but can't select them
**Solution**:
- Check if appointment is assigned to another staff member
- Only unassigned appointments or appointments assigned to you can be selected
- Use "Accept" button for unassigned appointments first

### Issue: Appointments disappear after completing sale
**Solution**:
- This is expected behavior - completed appointments are removed from pending list
- Check `/appointments` page to see completed appointments

## Next Steps

1. Create test appointments using one of the methods above
2. Verify they appear in POS
3. Test accepting unassigned appointments
4. Test completing sales from appointments
5. Verify appointments refresh after completion
