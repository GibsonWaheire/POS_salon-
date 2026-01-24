#!/usr/bin/env python3
"""
Script to create test appointments for POS testing.
Run from backend directory: python create_test_appointment.py
"""
import sys
import os
from datetime import datetime, timedelta

# Add parent directory to path to import app modules
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import app
from models import Appointment, Customer, Service, AppointmentService, Staff
from db import db

def create_test_appointment():
    """Create a test appointment for POS testing"""
    with app.app_context():
        # Get first customer (or create one if none exists)
        customer = Customer.query.first()
        if not customer:
            print("❌ No customers found!")
            print("   Please create a customer first via the UI or API")
            return False
        
        # Get first service (or create one if none exists)
        service = Service.query.first()
        if not service:
            print("❌ No services found!")
            print("   Please create a service first via the UI or API")
            return False
        
        # Get first staff (optional - for assigned appointments)
        staff = Staff.query.first()
        
        print(f"📋 Creating test appointment...")
        print(f"   Customer: {customer.name} (ID: {customer.id}, Demo: {customer.is_demo})")
        print(f"   Service: {service.name} (ID: {service.id})")
        if staff:
            print(f"   Staff: {staff.name} (ID: {staff.id}, Demo: {staff.is_demo})")
        
        # Create appointment for tomorrow (unassigned)
        appointment_date = datetime.now() + timedelta(days=1)
        
        appointment = Appointment(
            customer_id=customer.id,
            staff_id=None,  # Unassigned - can be claimed by any staff
            appointment_date=appointment_date,
            status='scheduled',
            service_location='salon',
            notes='Test appointment created by script'
        )
        
        db.session.add(appointment)
        db.session.flush()
        
        # Add service to appointment
        apt_service = AppointmentService(
            appointment_id=appointment.id,
            service_id=service.id
        )
        db.session.add(apt_service)
        db.session.commit()
        
        print(f"✅ Created appointment ID: {appointment.id}")
        print(f"   Date: {appointment_date.strftime('%Y-%m-%d %H:%M')}")
        print(f"   Status: {appointment.status}")
        print(f"   Staff: {'Unassigned' if not appointment.staff_id else f'Assigned to Staff ID {appointment.staff_id}'}")
        print(f"\n💡 This appointment will appear in POS if:")
        print(f"   - Staff demo mode matches customer demo mode ({customer.is_demo})")
        print(f"   - Appointment status is 'scheduled' or 'pending'")
        print(f"   - Appointment is unassigned OR assigned to logged-in staff")
        
        return True

def create_multiple_test_appointments(count=3):
    """Create multiple test appointments"""
    with app.app_context():
        customer = Customer.query.first()
        service = Service.query.first()
        
        if not customer or not service:
            print("❌ Missing customer or service. Cannot create appointments.")
            return False
        
        created = 0
        for i in range(count):
            appointment_date = datetime.now() + timedelta(days=i+1, hours=i*2)
            
            appointment = Appointment(
                customer_id=customer.id,
                staff_id=None,
                appointment_date=appointment_date,
                status='scheduled',
                service_location='salon',
                notes=f'Test appointment #{i+1}'
            )
            
            db.session.add(appointment)
            db.session.flush()
            
            apt_service = AppointmentService(
                appointment_id=appointment.id,
                service_id=service.id
            )
            db.session.add(apt_service)
            created += 1
        
        db.session.commit()
        print(f"✅ Created {created} test appointments")
        return True

if __name__ == '__main__':
    import argparse
    
    parser = argparse.ArgumentParser(description='Create test appointments for POS')
    parser.add_argument('--count', type=int, default=1, help='Number of appointments to create (default: 1)')
    args = parser.parse_args()
    
    if args.count > 1:
        create_multiple_test_appointments(args.count)
    else:
        create_test_appointment()
