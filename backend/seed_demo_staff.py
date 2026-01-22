"""
Seed demo staff users for development and demo purposes.
These credentials should be kept internal and not displayed to users.
"""
from app import app
from models import Staff, db

# Demo staff users - PINs follow format: 4 digits + 1 special character
DEMO_STAFF = [
    {
        'name': 'Jane Wanjiru',
        'phone': '+254 712 345 678',
        'email': 'jane.wanjiru@salon.demo',
        'role': 'stylist',
        'pin': '1234@',  # 4 digits + special char
        'base_pay': 50000.00
    },
    {
        'name': 'Sarah Akinyi',
        'phone': '+254 723 456 789',
        'email': 'sarah.akinyi@salon.demo',
        'role': 'stylist',
        'pin': '5678!',  # 4 digits + special char
        'base_pay': 52000.00
    },
    {
        'name': 'Mary Nyambura',
        'phone': '+254 734 567 890',
        'email': 'mary.nyambura@salon.demo',
        'role': 'nail_technician',
        'pin': '9012#',  # 4 digits + special char
        'base_pay': 45000.00
    },
    {
        'name': 'Grace Muthoni',
        'phone': '+254 745 678 901',
        'email': 'grace.muthoni@salon.demo',
        'role': 'facial_specialist',
        'pin': '3456$',  # 4 digits + special char
        'base_pay': 48000.00
    },
    {
        'name': 'Lucy Wambui',
        'phone': '+254 756 789 012',
        'email': 'lucy.wambui@salon.demo',
        'role': 'receptionist',
        'pin': '7890%',  # 4 digits + special char
        'base_pay': 35000.00
    }
]

def seed_demo_staff():
    """Create demo staff users if they don't exist"""
    with app.app_context():
        # Check if demo staff already exist
        existing_staff = Staff.query.filter(
            Staff.email.like('%@salon.demo'),
            Staff.is_demo == True
        ).all()
        
        if existing_staff and len(existing_staff) == len(DEMO_STAFF):
            print(f"Demo staff already exists ({len(existing_staff)} users). Skipping seed.")
            print("Existing demo staff:")
            for staff in existing_staff:
                print(f"  - ID: {staff.id}, Name: {staff.name}, PIN: {staff.pin}, Demo: {staff.is_demo}")
            return
        
        # Create demo staff
        created_count = 0
        for staff_data in DEMO_STAFF:
            # Check if staff with this email already exists
            existing = Staff.query.filter_by(email=staff_data['email']).first()
            if not existing:
                staff = Staff(
                    name=staff_data['name'],
                    phone=staff_data['phone'],
                    email=staff_data['email'],
                    role=staff_data['role'],
                    pin=staff_data['pin'],
                    base_pay=staff_data.get('base_pay'),
                    is_demo=True  # Mark as demo staff
                )
                db.session.add(staff)
                created_count += 1
                print(f"Created: {staff_data['name']} (PIN: {staff_data['pin']})")
        
        if created_count > 0:
            db.session.commit()
            print(f"\n✓ Successfully created {created_count} demo staff users")
            print("\nDemo Staff Credentials (Internal Use Only):")
            print("=" * 60)
            for staff_data in DEMO_STAFF:
                print(f"Name: {staff_data['name']}")
                print(f"PIN:  {staff_data['pin']}")
                print(f"Role: {staff_data['role']}")
                print("-" * 60)
        else:
            print("No new demo staff created.")

if __name__ == '__main__':
    seed_demo_staff()

