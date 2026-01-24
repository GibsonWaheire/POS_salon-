"""
Appointment routes for the POS Salon backend.
"""
from flask import Blueprint, request, jsonify, current_app, send_file
from models import Appointment, AppointmentService, Customer, Staff, Service, Sale, Resource, AppointmentNote, User
from db import db
from utils import get_demo_filter, export_appointments_ical, export_appointments_csv, check_slot_availability
from sqlalchemy.orm import joinedload
from sqlalchemy.exc import OperationalError, DatabaseError
from sqlalchemy import and_, or_
from datetime import datetime, date, timedelta
from error_helpers import get_user_friendly_error, handle_database_error
from auth_helpers import get_current_user
from io import BytesIO

bp_appointments = Blueprint('appointments', __name__)


# Validation functions
def validate_service_location(location):
    """Validate service location is 'salon' or 'home'"""
    if location not in ['salon', 'home']:
        return False, f"Service location must be 'salon' or 'home', got '{location}'"
    return True, None


def validate_home_address(location, address):
    """Validate home service address is provided when location is 'home'"""
    if location == 'home' and not address:
        return False, "Home service address is required when service location is 'home'"
    return True, None


def validate_status_transition(old_status, new_status):
    """Validate that status transition is allowed"""
    valid_transitions = {
        'scheduled': ['completed', 'cancelled', 'pending'],
        'pending': ['completed', 'cancelled', 'scheduled'],
        'completed': [],  # Cannot change from completed
        'cancelled': []  # Cannot change from cancelled
    }
    
    if old_status == new_status:
        return True, None
    
    allowed = valid_transitions.get(old_status, [])
    if new_status not in allowed:
        return False, f"Cannot change status from '{old_status}' to '{new_status}'"
    return True, None


def validate_appointment_date(appointment_date):
    """Validate appointment date (allow past dates for flexibility)"""
    if not appointment_date:
        return False, "Appointment date is required"
    
    if isinstance(appointment_date, str):
        try:
            appointment_date = datetime.fromisoformat(appointment_date.replace('Z', '+00:00'))
        except ValueError:
            return False, "Invalid appointment date format"
    
    # Allow past dates (for flexibility in completing old appointments)
    return True, None


@bp_appointments.route('/appointments', methods=['GET'])
def get_appointments():
    """Get all appointments, optionally filtered by status and date range"""
    try:
        status = request.args.get('status')  # e.g., 'pending', 'scheduled', 'completed', 'cancelled'
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        demo_filter = get_demo_filter(None, request)
        
        query = Appointment.query
        
        # Filter by demo status if needed (appointments inherit from customer/staff)
        # For now, we'll filter based on customer's is_demo flag
        if demo_filter['is_demo'] is not None:
            query = query.join(Customer).filter(Customer.is_demo == demo_filter['is_demo'])
        
        if status:
            query = query.filter(Appointment.status == status)
        
        # Date range filtering
        if start_date:
            try:
                start_dt = datetime.fromisoformat(start_date).date()
                query = query.filter(db.func.date(Appointment.appointment_date) >= start_dt)
            except ValueError:
                pass  # Ignore invalid date format
        
        if end_date:
            try:
                end_dt = datetime.fromisoformat(end_date).date()
                query = query.filter(db.func.date(Appointment.appointment_date) <= end_dt)
            except ValueError:
                pass  # Ignore invalid date format
        
        appointments = query.options(
            joinedload(Appointment.customer),
            joinedload(Appointment.staff),
            joinedload(Appointment.services).joinedload(AppointmentService.service)
        ).order_by(Appointment.appointment_date.asc()).all()
        
        # Safe to_dict with error handling
        result = []
        for appointment in appointments:
            try:
                result.append(appointment.to_dict())
            except Exception as e:
                import traceback
                print(f"Error serializing appointment {appointment.id}: {str(e)}")
                if current_app.debug:
                    traceback.print_exc()
                # Skip this appointment if serialization fails
        
        return jsonify(result)
    
    except (OperationalError, DatabaseError) as e:
        return jsonify({'error': get_user_friendly_error(e, current_app.debug)}), 500
    except Exception as e:
        import traceback
        print(f"Error in get_appointments: {str(e)}")
        if current_app.debug:
            traceback.print_exc()
        return jsonify({'error': get_user_friendly_error(e, current_app.debug)}), 500


@bp_appointments.route('/appointments/pending', methods=['GET'])
def get_pending_appointments():
    """Get pending/scheduled appointments for POS - shows assigned to staff + unassigned"""
    try:
        demo_filter = get_demo_filter(None, request)
        staff_id = request.args.get('staff_id', type=int)  # Current staff ID from POS
        
        query = Appointment.query.filter(
            Appointment.status.in_(['scheduled', 'pending'])
        )
        
        # Filter by demo status
        if demo_filter['is_demo'] is not None:
            query = query.join(Customer).filter(Customer.is_demo == demo_filter['is_demo'])
        
        # Filter by staff: show appointments assigned to this staff OR unassigned (staff_id IS NULL)
        if staff_id:
            from sqlalchemy import or_
            query = query.filter(
                or_(
                    Appointment.staff_id == staff_id,  # Assigned to this staff
                    Appointment.staff_id.is_(None)  # Unassigned (can be claimed)
                )
            )
        
        appointments = query.options(
            joinedload(Appointment.customer),
            joinedload(Appointment.staff),
            joinedload(Appointment.services).joinedload(AppointmentService.service)
        ).order_by(Appointment.appointment_date.asc()).all()
        
        # Safe to_dict with error handling
        result = []
        for appointment in appointments:
            try:
                result.append(appointment.to_dict())
            except Exception as e:
                import traceback
                print(f"Error serializing appointment {appointment.id}: {str(e)}")
                if current_app.debug:
                    traceback.print_exc()
                # Skip this appointment if serialization fails
        
        return jsonify(result)
    
    except (OperationalError, DatabaseError) as e:
        return jsonify({'error': get_user_friendly_error(e, current_app.debug)}), 500
    except Exception as e:
        import traceback
        print(f"Error in get_pending_appointments: {str(e)}")
        if current_app.debug:
            traceback.print_exc()
        return jsonify({'error': get_user_friendly_error(e, current_app.debug)}), 500


@bp_appointments.route('/appointments/<int:id>', methods=['GET'])
def get_appointment(id):
    """Get a specific appointment"""
    try:
        appointment = Appointment.query.options(
            joinedload(Appointment.customer),
            joinedload(Appointment.staff),
            joinedload(Appointment.services).joinedload(AppointmentService.service)
        ).get_or_404(id)
        
        try:
            return jsonify(appointment.to_dict())
        except Exception as e:
            import traceback
            print(f"Error serializing appointment {id}: {str(e)}")
            if current_app.debug:
                traceback.print_exc()
            return jsonify({'error': get_user_friendly_error(e, current_app.debug)}), 500
    
    except (OperationalError, DatabaseError) as e:
        return jsonify({'error': get_user_friendly_error(e, current_app.debug)}), 500
    except Exception as e:
        import traceback
        print(f"Error in get_appointment: {str(e)}")
        if current_app.debug:
            traceback.print_exc()
        return jsonify({'error': get_user_friendly_error(e, current_app.debug)}), 500


@bp_appointments.route('/appointments', methods=['POST'])
def create_appointment():
    """Create a new appointment"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Request data is required'}), 400
        
        # Get demo filter
        demo_filter = get_demo_filter(None, request)
        is_demo = demo_filter['is_demo']
        
        # Validate customer exists
        customer_id = data.get('customer_id')
        if not customer_id:
            return jsonify({'error': 'Customer ID is required'}), 400
        
        customer = Customer.query.get(customer_id)
        if not customer:
            return jsonify({'error': 'Customer not found'}), 404
        
        # Validate staff if provided
        staff_id = data.get('staff_id')
        if staff_id:
            staff = Staff.query.get(staff_id)
            if not staff:
                return jsonify({'error': 'Staff not found'}), 404
        
        # Parse and validate appointment date
        appointment_date_str = data.get('appointment_date')
        if not appointment_date_str:
            return jsonify({'error': 'Appointment date is required'}), 400
        
        try:
            appointment_date = datetime.fromisoformat(appointment_date_str.replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'error': 'Invalid appointment date format'}), 400
        
        is_valid, error_msg = validate_appointment_date(appointment_date)
        if not is_valid:
            return jsonify({'error': error_msg}), 400
        
        # Validate service location
        service_location = data.get('service_location', 'salon')
        is_valid, error_msg = validate_service_location(service_location)
        if not is_valid:
            return jsonify({'error': error_msg}), 400
        
        # Validate home address if location is home
        home_service_address = data.get('home_service_address')
        is_valid, error_msg = validate_home_address(service_location, home_service_address)
        if not is_valid:
            return jsonify({'error': error_msg}), 400
        
        # Create appointment
        appointment = Appointment(
            customer_id=customer_id,
            staff_id=staff_id,
            appointment_date=appointment_date,
            status=data.get('status', 'scheduled'),
            notes=data.get('notes'),
            service_location=service_location,
            home_service_address=home_service_address,
            color=data.get('color'),  # New field
            resource_id=data.get('resource_id'),  # New field
            popup_notes=data.get('popup_notes'),  # New field
            recurring_pattern=data.get('recurring_pattern'),  # New field
            recurring_end_date=datetime.fromisoformat(data['recurring_end_date'].replace('Z', '+00:00')) if data.get('recurring_end_date') else None  # New field
        )
        
        # Track who created/modified
        user = get_current_user()
        if user:
            appointment.last_modified_by = user.id
        
        db.session.add(appointment)
        db.session.flush()  # Get appointment ID
        
        # Add services
        service_ids = data.get('service_ids', [])
        for service_id in service_ids:
            service = Service.query.get(service_id)
            if not service:
                db.session.rollback()
                return jsonify({'error': f'Service {service_id} not found'}), 404
            
            appointment_service = AppointmentService(
                appointment_id=appointment.id,
                service_id=service_id
            )
            db.session.add(appointment_service)
        
        db.session.commit()
        
        # Reload to get relationships
        appointment = Appointment.query.options(
            joinedload(Appointment.customer),
            joinedload(Appointment.staff),
            joinedload(Appointment.services).joinedload(AppointmentService.service)
        ).get(appointment.id)
        
        try:
            return jsonify(appointment.to_dict()), 201
        except Exception as e:
            import traceback
            print(f"Error serializing created appointment: {str(e)}")
            if current_app.debug:
                traceback.print_exc()
            # Return basic appointment data if to_dict fails
            return jsonify({
                'id': appointment.id,
                'customer_id': appointment.customer_id,
                'staff_id': appointment.staff_id,
                'status': appointment.status,
                'appointment_date': appointment.appointment_date.isoformat() if appointment.appointment_date else None
            }), 201
    
    except (OperationalError, DatabaseError) as e:
        db.session.rollback()
        return jsonify({'error': get_user_friendly_error(e, current_app.debug)}), 500
    except Exception as e:
        db.session.rollback()
        import traceback
        print(f"Error in create_appointment: {str(e)}")
        if current_app.debug:
            traceback.print_exc()
        return jsonify({'error': get_user_friendly_error(e, current_app.debug)}), 400


@bp_appointments.route('/appointments/<int:id>', methods=['PUT'])
def update_appointment(id):
    """Update an appointment"""
    try:
        appointment = Appointment.query.get_or_404(id)
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Request data is required'}), 400
        
        # Prevent updating completed appointments
        if appointment.status == 'completed':
            return jsonify({'error': 'Cannot update a completed appointment'}), 400
        
        # Prevent updating if already linked to a sale
        if appointment.sale_id:
            return jsonify({'error': 'Cannot update an appointment that is linked to a sale'}), 400
        
        old_status = appointment.status
        
        # Update fields
        if 'customer_id' in data:
            customer = Customer.query.get(data['customer_id'])
            if not customer:
                return jsonify({'error': 'Customer not found'}), 404
            appointment.customer_id = data['customer_id']
        
        if 'staff_id' in data:
            if data['staff_id']:
                staff = Staff.query.get(data['staff_id'])
                if not staff:
                    return jsonify({'error': 'Staff not found'}), 404
            appointment.staff_id = data['staff_id']
        
        if 'appointment_date' in data:
            try:
                appointment_date = datetime.fromisoformat(data['appointment_date'].replace('Z', '+00:00'))
                is_valid, error_msg = validate_appointment_date(appointment_date)
                if not is_valid:
                    return jsonify({'error': error_msg}), 400
                appointment.appointment_date = appointment_date
            except ValueError:
                return jsonify({'error': 'Invalid appointment date format'}), 400
        
        if 'status' in data:
            new_status = data['status']
            is_valid, error_msg = validate_status_transition(old_status, new_status)
            if not is_valid:
                return jsonify({'error': error_msg}), 400
            appointment.status = new_status
        
        if 'notes' in data:
            appointment.notes = data['notes']
        
        if 'service_location' in data:
            is_valid, error_msg = validate_service_location(data['service_location'])
            if not is_valid:
                return jsonify({'error': error_msg}), 400
            appointment.service_location = data['service_location']
        
        if 'home_service_address' in data:
            appointment.home_service_address = data['home_service_address']
        
        # Update new fields
        if 'color' in data:
            appointment.color = data['color']
        
        if 'resource_id' in data:
            resource_id = data['resource_id']
            if resource_id:
                resource = Resource.query.get(resource_id)
                if not resource:
                    return jsonify({'error': 'Resource not found'}), 404
            appointment.resource_id = resource_id
        
        if 'popup_notes' in data:
            appointment.popup_notes = data['popup_notes']
        
        if 'recurring_pattern' in data:
            appointment.recurring_pattern = data['recurring_pattern']
        
        if 'recurring_end_date' in data:
            if data['recurring_end_date']:
                try:
                    appointment.recurring_end_date = datetime.fromisoformat(data['recurring_end_date'].replace('Z', '+00:00'))
                except ValueError:
                    return jsonify({'error': 'Invalid recurring end date format'}), 400
            else:
                appointment.recurring_end_date = None
        
        # Track who modified
        user = get_current_user()
        if user:
            appointment.last_modified_by = user.id
        
        # Validate home address if location is home
        if appointment.service_location == 'home':
            is_valid, error_msg = validate_home_address(appointment.service_location, appointment.home_service_address)
            if not is_valid:
                return jsonify({'error': error_msg}), 400
        
        # Update services if provided
        if 'service_ids' in data:
            # Remove existing services
            AppointmentService.query.filter_by(appointment_id=appointment.id).delete()
            
            # Add new services
            for service_id in data['service_ids']:
                service = Service.query.get(service_id)
                if not service:
                    db.session.rollback()
                    return jsonify({'error': f'Service {service_id} not found'}), 404
                
                appointment_service = AppointmentService(
                    appointment_id=appointment.id,
                    service_id=service_id
                )
                db.session.add(appointment_service)
        
        db.session.commit()
        
        # Reload to get relationships
        appointment = Appointment.query.options(
            joinedload(Appointment.customer),
            joinedload(Appointment.staff),
            joinedload(Appointment.services).joinedload(AppointmentService.service)
        ).get(appointment.id)
        
        try:
            return jsonify(appointment.to_dict())
        except Exception as e:
            import traceback
            print(f"Error serializing updated appointment: {str(e)}")
            if current_app.debug:
                traceback.print_exc()
            return jsonify({'error': get_user_friendly_error(e, current_app.debug)}), 500
    
    except (OperationalError, DatabaseError) as e:
        db.session.rollback()
        return jsonify({'error': get_user_friendly_error(e, current_app.debug)}), 500
    except Exception as e:
        db.session.rollback()
        import traceback
        print(f"Error in update_appointment: {str(e)}")
        if current_app.debug:
            traceback.print_exc()
        return jsonify({'error': get_user_friendly_error(e, current_app.debug)}), 400


@bp_appointments.route('/appointments/<int:id>', methods=['DELETE'])
def delete_appointment(id):
    """Delete an appointment"""
    try:
        appointment = Appointment.query.get_or_404(id)
        
        # Prevent deleting completed appointments
        if appointment.status == 'completed':
            return jsonify({'error': 'Cannot delete a completed appointment'}), 400
        
        # Prevent deleting if linked to a sale
        if appointment.sale_id:
            return jsonify({'error': 'Cannot delete an appointment that is linked to a sale'}), 400
        
        db.session.delete(appointment)
        db.session.commit()
        return jsonify({'message': 'Appointment deleted'}), 200
    
    except (OperationalError, DatabaseError) as e:
        db.session.rollback()
        return jsonify({'error': get_user_friendly_error(e, current_app.debug)}), 500
    except Exception as e:
        db.session.rollback()
        import traceback
        print(f"Error in delete_appointment: {str(e)}")
        if current_app.debug:
            traceback.print_exc()
        return jsonify({'error': get_user_friendly_error(e, current_app.debug)}), 500


@bp_appointments.route('/appointments/<int:id>/complete', methods=['POST'])
def complete_appointment(id):
    """Mark appointment as completed and optionally link to a sale"""
    try:
        appointment = Appointment.query.get_or_404(id)
        data = request.get_json() or {}
        
        # Prevent completing already completed appointments
        if appointment.status == 'completed':
            return jsonify({'error': 'Appointment is already completed'}), 400
        
        # Prevent linking if already linked to a sale
        if appointment.sale_id:
            return jsonify({'error': 'Appointment is already linked to a sale'}), 400
        
        sale_id = data.get('sale_id')
        if sale_id:
            sale = Sale.query.get(sale_id)
            if not sale:
                return jsonify({'error': 'Sale not found'}), 404
            
            # Prevent linking if sale already has an appointment
            if sale.appointment_id:
                return jsonify({'error': 'Sale is already linked to an appointment'}), 400
            
            # Link sale to appointment (bidirectional)
            sale.appointment_id = appointment.id
            appointment.sale_id = sale_id
        
        # Validate status transition
        is_valid, error_msg = validate_status_transition(appointment.status, 'completed')
        if not is_valid:
            return jsonify({'error': error_msg}), 400
        
        appointment.status = 'completed'
        db.session.commit()
        
        # Reload to get relationships
        appointment = Appointment.query.options(
            joinedload(Appointment.customer),
            joinedload(Appointment.staff),
            joinedload(Appointment.services).joinedload(AppointmentService.service),
            joinedload(Appointment.sale)
        ).get(appointment.id)
        
        try:
            return jsonify(appointment.to_dict())
        except Exception as e:
            import traceback
            print(f"Error serializing completed appointment: {str(e)}")
            if current_app.debug:
                traceback.print_exc()
            return jsonify({'error': get_user_friendly_error(e, current_app.debug)}), 500
    
    except (OperationalError, DatabaseError) as e:
        db.session.rollback()
        return jsonify({'error': get_user_friendly_error(e, current_app.debug)}), 500
    except Exception as e:
        db.session.rollback()
        import traceback
        print(f"Error in complete_appointment: {str(e)}")
        if current_app.debug:
            traceback.print_exc()
        return jsonify({'error': get_user_friendly_error(e, current_app.debug)}), 400


@bp_appointments.route('/appointments/<int:id>/accept', methods=['POST'])
def accept_appointment(id):
    """Accept/claim an unassigned appointment - assign it to current staff"""
    try:
        appointment = Appointment.query.get_or_404(id)
        
        # Get staff_id from request (should be passed from frontend)
        data = request.get_json() or {}
        staff_id = data.get('staff_id')
        
        if not staff_id:
            return jsonify({'error': 'Staff ID is required'}), 400
        
        # Validate staff exists
        staff = Staff.query.get(staff_id)
        if not staff:
            return jsonify({'error': 'Staff not found'}), 404
        
        # Prevent accepting if appointment is already assigned
        if appointment.staff_id is not None:
            if appointment.staff_id == staff_id:
                return jsonify({'error': 'Appointment is already assigned to you'}), 400
            return jsonify({'error': 'Appointment is already assigned to another staff member'}), 400
        
        # Prevent accepting if appointment is completed or cancelled
        if appointment.status in ['completed', 'cancelled']:
            return jsonify({'error': f'Cannot accept an appointment with status: {appointment.status}'}), 400
        
        # Assign appointment to staff
        appointment.staff_id = staff_id
        db.session.commit()
        
        # Reload to get relationships
        appointment = Appointment.query.options(
            joinedload(Appointment.customer),
            joinedload(Appointment.staff),
            joinedload(Appointment.services).joinedload(AppointmentService.service)
        ).get(appointment.id)
        
        try:
            return jsonify(appointment.to_dict())
        except Exception as e:
            import traceback
            print(f"Error serializing accepted appointment: {str(e)}")
            if current_app.debug:
                traceback.print_exc()
            return jsonify({'error': get_user_friendly_error(e, current_app.debug)}), 500
    
    except (OperationalError, DatabaseError) as e:
        db.session.rollback()
        return jsonify({'error': get_user_friendly_error(e, current_app.debug)}), 500
    except Exception as e:
        db.session.rollback()
        import traceback
        print(f"Error in accept_appointment: {str(e)}")
        if current_app.debug:
            traceback.print_exc()
        return jsonify({'error': get_user_friendly_error(e, current_app.debug)}), 400


@bp_appointments.route('/appointments/<int:id>/cancel', methods=['POST'])
def cancel_appointment(id):
    """Cancel an appointment"""
    try:
        appointment = Appointment.query.get_or_404(id)
        
        # Prevent cancelling if already completed
        if appointment.status == 'completed':
            return jsonify({'error': 'Cannot cancel a completed appointment'}), 400
        
        # Prevent cancelling if already cancelled
        if appointment.status == 'cancelled':
            return jsonify({'error': 'Appointment is already cancelled'}), 400
        
        # Validate status transition
        is_valid, error_msg = validate_status_transition(appointment.status, 'cancelled')
        if not is_valid:
            return jsonify({'error': error_msg}), 400
        
        appointment.status = 'cancelled'
        db.session.commit()
        
        # Reload to get relationships
        appointment = Appointment.query.options(
            joinedload(Appointment.customer),
            joinedload(Appointment.staff),
            joinedload(Appointment.services).joinedload(AppointmentService.service)
        ).get(appointment.id)
        
        try:
            return jsonify(appointment.to_dict())
        except Exception as e:
            import traceback
            print(f"Error serializing cancelled appointment: {str(e)}")
            if current_app.debug:
                traceback.print_exc()
            return jsonify({'error': get_user_friendly_error(e, current_app.debug)}), 500
    
    except (OperationalError, DatabaseError) as e:
        db.session.rollback()
        return jsonify({'error': get_user_friendly_error(e, current_app.debug)}), 500
    except Exception as e:
        db.session.rollback()
        import traceback
        print(f"Error in cancel_appointment: {str(e)}")
        if current_app.debug:
            traceback.print_exc()
        return jsonify({'error': get_user_friendly_error(e, current_app.debug)}), 400


@bp_appointments.route('/appointments/<int:id>/reschedule', methods=['POST'])
def reschedule_appointment(id):
    """Reschedule an appointment (update date/time) - used for drag-and-drop"""
    try:
        appointment = Appointment.query.get_or_404(id)
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Request data is required'}), 400
        
        # Prevent rescheduling completed or cancelled appointments
        if appointment.status in ['completed', 'cancelled']:
            return jsonify({'error': f'Cannot reschedule an appointment with status: {appointment.status}'}), 400
        
        new_date_str = data.get('appointment_date')
        if not new_date_str:
            return jsonify({'error': 'New appointment date is required'}), 400
        
        try:
            new_date = datetime.fromisoformat(new_date_str.replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'error': 'Invalid appointment date format'}), 400
        
        is_valid, error_msg = validate_appointment_date(new_date)
        if not is_valid:
            return jsonify({'error': error_msg}), 400
        
        # Update appointment date
        appointment.appointment_date = new_date
        
        # Track who modified
        user = get_current_user()
        if user:
            appointment.last_modified_by = user.id
        
        db.session.commit()
        
        # Reload to get relationships
        appointment = Appointment.query.options(
            joinedload(Appointment.customer),
            joinedload(Appointment.staff),
            joinedload(Appointment.services).joinedload(AppointmentService.service)
        ).get(appointment.id)
        
        try:
            return jsonify(appointment.to_dict())
        except Exception as e:
            import traceback
            print(f"Error serializing rescheduled appointment: {str(e)}")
            if current_app.debug:
                traceback.print_exc()
            return jsonify({'error': get_user_friendly_error(e, current_app.debug)}), 500
    
    except (OperationalError, DatabaseError) as e:
        db.session.rollback()
        return jsonify({'error': get_user_friendly_error(e, current_app.debug)}), 500
    except Exception as e:
        db.session.rollback()
        import traceback
        print(f"Error in reschedule_appointment: {str(e)}")
        if current_app.debug:
            traceback.print_exc()
        return jsonify({'error': get_user_friendly_error(e, current_app.debug)}), 400


@bp_appointments.route('/appointments/<int:id>/notes', methods=['POST'])
def add_appointment_note(id):
    """Add a note to an appointment"""
    try:
        appointment = Appointment.query.get_or_404(id)
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Request data is required'}), 400
        
        note_text = data.get('note_text')
        if not note_text:
            return jsonify({'error': 'Note text is required'}), 400
        
        user = get_current_user()
        
        note = AppointmentNote(
            appointment_id=appointment.id,
            note_text=note_text,
            created_by=user.id if user else None
        )
        
        db.session.add(note)
        db.session.commit()
        
        return jsonify(note.to_dict()), 201
    
    except Exception as e:
        db.session.rollback()
        import traceback
        print(f"Error in add_appointment_note: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@bp_appointments.route('/appointments/<int:id>/notes', methods=['GET'])
def get_appointment_notes(id):
    """Get all notes for an appointment"""
    try:
        appointment = Appointment.query.get_or_404(id)
        notes = AppointmentNote.query.filter_by(appointment_id=appointment.id).order_by(AppointmentNote.created_at.desc()).all()
        return jsonify([note.to_dict() for note in notes]), 200
    
    except Exception as e:
        import traceback
        print(f"Error in get_appointment_notes: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@bp_appointments.route('/appointments/<int:id>/color', methods=['PUT'])
def update_appointment_color(id):
    """Update appointment color"""
    try:
        appointment = Appointment.query.get_or_404(id)
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Request data is required'}), 400
        
        color = data.get('color')
        appointment.color = color
        
        user = get_current_user()
        if user:
            appointment.last_modified_by = user.id
        
        db.session.commit()
        
        return jsonify(appointment.to_dict()), 200
    
    except Exception as e:
        db.session.rollback()
        import traceback
        print(f"Error in update_appointment_color: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@bp_appointments.route('/appointments/recurring', methods=['POST'])
def create_recurring_appointment():
    """Create a series of recurring appointments"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Request data is required'}), 400
        
        # Get template appointment data
        template = data.get('template')  # Appointment data template
        pattern = data.get('pattern')  # 'daily', 'weekly', 'monthly'
        start_date_str = data.get('start_date')
        end_date_str = data.get('end_date')
        
        if not all([template, pattern, start_date_str, end_date_str]):
            return jsonify({'error': 'Template, pattern, start_date, and end_date are required'}), 400
        
        try:
            start_date = datetime.fromisoformat(start_date_str.replace('Z', '+00:00'))
            end_date = datetime.fromisoformat(end_date_str.replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'error': 'Invalid date format'}), 400
        
        if end_date <= start_date:
            return jsonify({'error': 'End date must be after start date'}), 400
        
        # Generate recurring dates
        dates = []
        current = start_date
        delta_map = {
            'daily': timedelta(days=1),
            'weekly': timedelta(weeks=1),
            'monthly': timedelta(days=30)  # Approximate
        }
        
        delta = delta_map.get(pattern.lower())
        if not delta:
            return jsonify({'error': f'Invalid pattern: {pattern}. Must be daily, weekly, or monthly'}), 400
        
        while current <= end_date:
            dates.append(current)
            if pattern.lower() == 'monthly':
                # For monthly, add approximately 30 days
                try:
                    current = current.replace(month=current.month + 1) if current.month < 12 else current.replace(year=current.year + 1, month=1)
                except:
                    current += timedelta(days=30)
            else:
                current += delta
        
        # Create appointments
        created_appointments = []
        parent_appointment = None
        
        for i, date in enumerate(dates):
            appointment_data = template.copy()
            appointment_data['appointment_date'] = date.isoformat()
            appointment_data['recurring_pattern'] = pattern
            appointment_data['recurring_end_date'] = end_date.isoformat()
            
            if i == 0:
                # First appointment is the parent
                appointment_data['parent_appointment_id'] = None
            else:
                appointment_data['parent_appointment_id'] = parent_appointment.id
            
            # Create appointment using existing create logic (simplified)
            customer_id = appointment_data.get('customer_id')
            if not customer_id:
                return jsonify({'error': 'Customer ID is required'}), 400
            
            customer = Customer.query.get(customer_id)
            if not customer:
                return jsonify({'error': 'Customer not found'}), 404
            
            staff_id = appointment_data.get('staff_id')
            if staff_id:
                staff = Staff.query.get(staff_id)
                if not staff:
                    return jsonify({'error': 'Staff not found'}), 404
            
            appointment = Appointment(
                customer_id=customer_id,
                staff_id=staff_id,
                appointment_date=date,
                status=appointment_data.get('status', 'scheduled'),
                notes=appointment_data.get('notes'),
                service_location=appointment_data.get('service_location', 'salon'),
                home_service_address=appointment_data.get('home_service_address'),
                color=appointment_data.get('color'),
                resource_id=appointment_data.get('resource_id'),
                popup_notes=appointment_data.get('popup_notes'),
                recurring_pattern=pattern,
                recurring_end_date=end_date,
                parent_appointment_id=appointment_data.get('parent_appointment_id')
            )
            
            user = get_current_user()
            if user:
                appointment.last_modified_by = user.id
            
            db.session.add(appointment)
            db.session.flush()
            
            if i == 0:
                parent_appointment = appointment
            
            # Add services
            service_ids = appointment_data.get('service_ids', [])
            for service_id in service_ids:
                service = Service.query.get(service_id)
                if service:
                    appointment_service = AppointmentService(
                        appointment_id=appointment.id,
                        service_id=service_id
                    )
                    db.session.add(appointment_service)
            
            created_appointments.append(appointment)
        
        db.session.commit()
        
        # Reload appointments with relationships
        result = []
        for apt in created_appointments:
            apt = Appointment.query.options(
                joinedload(Appointment.customer),
                joinedload(Appointment.staff),
                joinedload(Appointment.services).joinedload(AppointmentService.service)
            ).get(apt.id)
            result.append(apt.to_dict())
        
        return jsonify(result), 201
    
    except Exception as e:
        db.session.rollback()
        import traceback
        print(f"Error in create_recurring_appointment: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@bp_appointments.route('/appointments/recurring/<int:id>', methods=['DELETE'])
def cancel_recurring_series(id):
    """Cancel entire recurring appointment series"""
    try:
        appointment = Appointment.query.get_or_404(id)
        
        # Find parent appointment
        parent_id = appointment.parent_appointment_id if appointment.parent_appointment_id else appointment.id
        
        # Find all appointments in the series
        series_appointments = Appointment.query.filter(
            or_(
                Appointment.id == parent_id,
                Appointment.parent_appointment_id == parent_id
            )
        ).all()
        
        # Cancel all appointments in series
        for apt in series_appointments:
            if apt.status not in ['completed', 'cancelled']:
                apt.status = 'cancelled'
        
        db.session.commit()
        
        return jsonify({'message': f'Cancelled {len(series_appointments)} appointments in series'}), 200
    
    except Exception as e:
        db.session.rollback()
        import traceback
        print(f"Error in cancel_recurring_series: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@bp_appointments.route('/appointments/calendar/export', methods=['GET'])
def export_appointments_calendar():
    """Export appointments as iCal or CSV"""
    try:
        format_type = request.args.get('format', 'ical').lower()  # 'ical' or 'csv'
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        demo_filter = get_demo_filter(None, request)
        
        query = Appointment.query
        
        # Filter by demo status
        if demo_filter['is_demo'] is not None:
            query = query.join(Customer).filter(Customer.is_demo == demo_filter['is_demo'])
        
        # Date range filtering
        if start_date:
            try:
                start_dt = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
                query = query.filter(db.func.date(Appointment.appointment_date) >= start_dt.date())
            except ValueError:
                pass
        
        if end_date:
            try:
                end_dt = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
                query = query.filter(db.func.date(Appointment.appointment_date) <= end_dt.date())
            except ValueError:
                pass
        
        appointments = query.options(
            joinedload(Appointment.customer),
            joinedload(Appointment.staff),
            joinedload(Appointment.services).joinedload(AppointmentService.service)
        ).order_by(Appointment.appointment_date.asc()).all()
        
        if format_type == 'csv':
            csv_content = export_appointments_csv(appointments)
            output = BytesIO()
            output.write(csv_content.encode('utf-8'))
            output.seek(0)
            return send_file(
                output,
                mimetype='text/csv',
                as_attachment=True,
                download_name=f'appointments_{datetime.now().strftime("%Y%m%d")}.csv'
            )
        else:  # iCal
            ical_content = export_appointments_ical(appointments)
            output = BytesIO()
            output.write(ical_content.encode('utf-8'))
            output.seek(0)
            return send_file(
                output,
                mimetype='text/calendar',
                as_attachment=True,
                download_name=f'appointments_{datetime.now().strftime("%Y%m%d")}.ics'
            )
    
    except Exception as e:
        import traceback
        print(f"Error in export_appointments_calendar: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
