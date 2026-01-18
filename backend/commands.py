"""
Flask CLI commands for managing the Salon POS system
"""
import click
from flask import current_app
from flask.cli import with_appcontext
from models import Staff, Customer, Service, Appointment, Payment, db
from datetime import datetime

# Demo staff users data
DEMO_STAFF = [
    {'name': 'Jane Wanjiru', 'phone': '+254 712 345 678', 'email': 'jane.wanjiru@salon.demo', 'role': 'stylist', 'pin': '1234@'},
    {'name': 'Sarah Akinyi', 'phone': '+254 723 456 789', 'email': 'sarah.akinyi@salon.demo', 'role': 'stylist', 'pin': '5678!'},
    {'name': 'Mary Nyambura', 'phone': '+254 734 567 890', 'email': 'mary.nyambura@salon.demo', 'role': 'nail_technician', 'pin': '9012#'},
    {'name': 'Grace Muthoni', 'phone': '+254 745 678 901', 'email': 'grace.muthoni@salon.demo', 'role': 'facial_specialist', 'pin': '3456$'},
    {'name': 'Lucy Wambui', 'phone': '+254 756 789 012', 'email': 'lucy.wambui@salon.demo', 'role': 'receptionist', 'pin': '7890%'}
]

@click.command('init-db')
@with_appcontext
def init_db():
    """Initialize the database - create all tables"""
    db.create_all()
    click.echo('✓ Database initialized successfully')

@click.command('seed-staff')
@click.option('--force', is_flag=True, help='Force reseed even if staff exist')
@with_appcontext
def seed_staff(force):
    """Seed demo staff users for development/demo"""
    if force:
        # Remove existing demo staff
        Staff.query.filter(Staff.email.like('%@salon.demo')).delete()
        db.session.commit()
        click.echo('Removed existing demo staff')
    
    existing_count = Staff.query.filter(Staff.email.like('%@salon.demo')).count()
    
    if existing_count > 0 and not force:
        click.echo(f'Demo staff already exists ({existing_count} users). Use --force to reseed.')
        return
    
    created_count = 0
    for staff_data in DEMO_STAFF:
        existing = Staff.query.filter_by(email=staff_data['email']).first()
        if not existing:
            staff = Staff(**staff_data)
            db.session.add(staff)
            created_count += 1
    
    db.session.commit()
    click.echo(f'✓ Created {created_count} demo staff users')
    click.echo('\nDemo Staff Credentials:')
    click.echo('=' * 70)
    for staff_data in DEMO_STAFF:
        click.echo(f"Name: {staff_data['name']:<20} PIN: {staff_data['pin']:<10} Role: {staff_data['role']}")

@click.command('list-staff')
@with_appcontext
def list_staff():
    """List all staff members"""
    staff_list = Staff.query.all()
    if not staff_list:
        click.echo('No staff members found')
        return
    
    click.echo(f'Found {len(staff_list)} staff member(s):')
    click.echo('-' * 80)
    click.echo(f"{'ID':<5} {'Name':<25} {'Email':<30} {'Role':<20} {'PIN'}")
    click.echo('-' * 80)
    for staff in staff_list:
        pin_display = staff.pin if staff.pin else 'N/A'
        click.echo(f"{staff.id:<5} {staff.name:<25} {staff.email or 'N/A':<30} {staff.role or 'N/A':<20} {pin_display}")

@click.command('create-staff')
@click.option('--name', prompt='Staff Name', help='Full name of the staff member')
@click.option('--phone', prompt='Phone Number', default='', help='Phone number')
@click.option('--email', prompt='Email', default='', help='Email address')
@click.option('--role', prompt='Role', default='stylist', help='Staff role (stylist, receptionist, etc.)')
@click.option('--pin', prompt='PIN (5 chars: 4 digits + 1 special)', help='5-character PIN with format: 4 digits + 1 special character')
@with_appcontext
def create_staff(name, phone, email, role, pin):
    """Create a new staff member"""
    # Validate PIN format
    if len(pin) != 5:
        click.echo('Error: PIN must be exactly 5 characters', err=True)
        return
    
    import re
    has_digit = bool(re.search(r'\d', pin))
    has_special = bool(re.search(r'[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]', pin))
    
    if not (has_digit and has_special):
        click.echo('Error: PIN must contain at least one digit and one special character', err=True)
        return
    
    # Check if staff with same email or PIN exists
    existing_email = Staff.query.filter_by(email=email).first() if email else None
    existing_pin = Staff.query.filter_by(pin=pin).first()
    
    if existing_email:
        click.echo(f'Error: Staff with email {email} already exists', err=True)
        return
    
    if existing_pin:
        click.echo(f'Error: PIN {pin} is already in use', err=True)
        return
    
    staff = Staff(name=name, phone=phone or None, email=email or None, role=role, pin=pin)
    db.session.add(staff)
    db.session.commit()
    
    click.echo(f'✓ Staff created successfully: {name} (ID: {staff.id}, PIN: {pin})')

@click.command('reset-db')
@click.confirmation_option(prompt='Are you sure you want to reset the database? This will delete all data!')
@with_appcontext
def reset_db():
    """Reset the database - DROP ALL TABLES (WARNING: Destructive!)"""
    db.drop_all()
    db.create_all()
    click.echo('✓ Database reset successfully')
    click.echo('Run "flask seed-staff" to create demo users')

@click.command('show-demo-login')
@with_appcontext
def show_demo_login():
    """Show demo staff login credentials"""
    demo_staff = Staff.query.filter(Staff.email.like('%@salon.demo')).all()
    
    if not demo_staff:
        click.echo('No demo staff found. Run "flask seed-staff" to create demo users.')
        return
    
    click.echo('=' * 70)
    click.echo('DEMO STAFF LOGIN CREDENTIALS (For Development/Demo)')
    click.echo('=' * 70)
    click.echo(f'\n{"Name":<25} {"PIN":<10} {"Role":<20} {"ID"}')
    click.echo('-' * 70)
    for staff in demo_staff:
        click.echo(f"{staff.name:<25} {staff.pin:<10} {staff.role or 'N/A':<20} {staff.id}")
    click.echo('\n' + '=' * 70)
    click.echo('Use these PINs to login at /staff-login')
    click.echo('=' * 70)

def register_commands(app):
    """Register all CLI commands with the Flask app"""
    app.cli.add_command(init_db)
    app.cli.add_command(seed_staff)
    app.cli.add_command(list_staff)
    app.cli.add_command(create_staff)
    app.cli.add_command(reset_db)
    app.cli.add_command(show_demo_login)

