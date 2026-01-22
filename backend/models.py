from db import db
from datetime import datetime

class Customer(db.Model):
    __tablename__ = 'customers'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), unique=True)
    email = db.Column(db.String(100))
    loyalty_points = db.Column(db.Integer, default=0)
    total_visits = db.Column(db.Integer, default=0)
    total_spent = db.Column(db.Float, default=0.0)
    last_visit = db.Column(db.DateTime)
    preferences = db.Column(db.Text)  # JSON string for preferences
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    appointments = db.relationship('Appointment', backref='customer', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'phone': self.phone,
            'email': self.email,
            'loyalty_points': self.loyalty_points,
            'total_visits': self.total_visits,
            'total_spent': self.total_spent,
            'last_visit': self.last_visit.isoformat() if self.last_visit else None,
            'preferences': self.preferences,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Service(db.Model):
    __tablename__ = 'services'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    duration = db.Column(db.Integer, nullable=False)  # Duration in minutes
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    appointment_services = db.relationship('AppointmentService', backref='service', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'duration': self.duration,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Staff(db.Model):
    __tablename__ = 'staff'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20))
    email = db.Column(db.String(100))
    role = db.Column(db.String(50))  # e.g., 'stylist', 'receptionist', 'manager'
    pin = db.Column(db.String(255))  # Hashed PIN in production (5 chars: 4 digits + 1 special char)
    is_active = db.Column(db.Boolean, default=True)
    last_login = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    appointments = db.relationship('Appointment', backref='staff', lazy=True)
    login_logs = db.relationship('StaffLoginLog', backref='staff', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'phone': self.phone,
            'email': self.email,
            'role': self.role,
            'is_active': self.is_active,
            'last_login': self.last_login.isoformat() if self.last_login else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
            # PIN is intentionally excluded from to_dict() for security
        }

class Appointment(db.Model):
    __tablename__ = 'appointments'
    
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    staff_id = db.Column(db.Integer, db.ForeignKey('staff.id'))
    appointment_date = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(20), default='scheduled')  # scheduled, completed, cancelled
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    services = db.relationship('AppointmentService', backref='appointment', lazy=True, cascade='all, delete-orphan')
    payment = db.relationship('Payment', foreign_keys='Payment.appointment_id', backref='appointment', uselist=False, lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'customer_id': self.customer_id,
            'staff_id': self.staff_id,
            'appointment_date': self.appointment_date.isoformat() if self.appointment_date else None,
            'status': self.status,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'customer': self.customer.to_dict() if self.customer else None,
            'staff': self.staff.to_dict() if self.staff else None,
            'services': [aps.service.to_dict() for aps in self.services] if self.services else []
        }

class AppointmentService(db.Model):
    __tablename__ = 'appointment_services'
    
    id = db.Column(db.Integer, primary_key=True)
    appointment_id = db.Column(db.Integer, db.ForeignKey('appointments.id'), nullable=False)
    service_id = db.Column(db.Integer, db.ForeignKey('services.id'), nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'appointment_id': self.appointment_id,
            'service_id': self.service_id,
            'service': self.service.to_dict() if self.service else None
        }

# Sale model for walk-in transactions (Kenyan salon flow - no appointments)
class Sale(db.Model):
    __tablename__ = 'sales'
    
    id = db.Column(db.Integer, primary_key=True)
    sale_number = db.Column(db.String(50), unique=True)  # Sale ID like "SALE-20260119-001"
    staff_id = db.Column(db.Integer, db.ForeignKey('staff.id'), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'))  # Optional - for walk-ins
    customer_name = db.Column(db.String(100))  # For walk-ins without customer record
    customer_phone = db.Column(db.String(20))  # For walk-ins
    status = db.Column(db.String(20), default='pending')  # pending, completed, cancelled
    subtotal = db.Column(db.Float, default=0.0)
    tax_amount = db.Column(db.Float, default=0.0)  # VAT amount
    total_amount = db.Column(db.Float, default=0.0)
    commission_amount = db.Column(db.Float, default=0.0)  # Finalized commission
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime)  # When sale was completed
    
    # Relationships
    staff = db.relationship('Staff', backref='sales', lazy=True)
    customer = db.relationship('Customer', backref='sales', lazy=True)
    sale_services = db.relationship('SaleService', backref='sale', lazy=True, cascade='all, delete-orphan')
    sale_products = db.relationship('SaleProduct', backref='sale', lazy=True, cascade='all, delete-orphan')
    payment = db.relationship('Payment', foreign_keys='Payment.sale_id', backref='sale', uselist=False, lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'sale_number': self.sale_number,
            'staff_id': self.staff_id,
            'customer_id': self.customer_id,
            'customer_name': self.customer_name,
            'customer_phone': self.customer_phone,
            'status': self.status,
            'subtotal': self.subtotal,
            'tax_amount': self.tax_amount,
            'total_amount': self.total_amount,
            'commission_amount': self.commission_amount,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'staff': self.staff.to_dict() if self.staff else None,
            'customer': self.customer.to_dict() if self.customer else None
        }

class SaleService(db.Model):
    __tablename__ = 'sale_services'
    
    id = db.Column(db.Integer, primary_key=True)
    sale_id = db.Column(db.Integer, db.ForeignKey('sales.id'), nullable=False)
    service_id = db.Column(db.Integer, db.ForeignKey('services.id'), nullable=False)
    quantity = db.Column(db.Integer, default=1)
    unit_price = db.Column(db.Float, nullable=False)  # Price at time of sale
    total_price = db.Column(db.Float, nullable=False)  # unit_price * quantity
    commission_rate = db.Column(db.Float, default=0.50)  # Commission rate at time of sale
    commission_amount = db.Column(db.Float, default=0.0)  # Calculated commission
    
    # Relationships
    service = db.relationship('Service', backref='sale_services', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'sale_id': self.sale_id,
            'service_id': self.service_id,
            'quantity': self.quantity,
            'unit_price': self.unit_price,
            'total_price': self.total_price,
            'commission_rate': self.commission_rate,
            'commission_amount': self.commission_amount,
            'service': self.service.to_dict() if self.service else None
        }

class SaleProduct(db.Model):
    __tablename__ = 'sale_products'
    
    id = db.Column(db.Integer, primary_key=True)
    sale_id = db.Column(db.Integer, db.ForeignKey('sales.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Float, nullable=False)  # Can be fractional (e.g., 0.5 bottles)
    unit_price = db.Column(db.Float, nullable=False)  # Selling price at time of sale
    total_price = db.Column(db.Float, nullable=False)  # unit_price * quantity
    stock_deducted = db.Column(db.Boolean, default=False)  # Whether stock was deducted
    
    # Relationships
    product = db.relationship('Product', backref='sale_products', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'sale_id': self.sale_id,
            'product_id': self.product_id,
            'quantity': self.quantity,
            'unit_price': self.unit_price,
            'total_price': self.total_price,
            'stock_deducted': self.stock_deducted,
            'product': self.product.to_dict() if self.product else None
        }

class Payment(db.Model):
    __tablename__ = 'payments'
    
    id = db.Column(db.Integer, primary_key=True)
    sale_id = db.Column(db.Integer, db.ForeignKey('sales.id'), nullable=True)  # Made nullable for backward compatibility
    appointment_id = db.Column(db.Integer, db.ForeignKey('appointments.id'), nullable=True)  # Keep for backward compatibility - nullable for sale-based payments
    amount = db.Column(db.Float, nullable=False)
    payment_method = db.Column(db.String(50))  # cash, card, m_pesa, airtel_money, etc.
    status = db.Column(db.String(20), default='pending')  # pending, completed, refunded
    transaction_code = db.Column(db.String(50))  # M-Pesa transaction code, etc.
    receipt_number = db.Column(db.String(50))  # Receipt number for tracking
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships are defined on Appointment and Sale models with backrefs
    # No need to define them here to avoid conflicts
    
    def to_dict(self):
        return {
            'id': self.id,
            'sale_id': self.sale_id,
            'appointment_id': self.appointment_id,
            'amount': self.amount,
            'payment_method': self.payment_method,
            'status': self.status,
            'transaction_code': self.transaction_code,
            'receipt_number': self.receipt_number,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class StaffLoginLog(db.Model):
    __tablename__ = 'staff_login_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    staff_id = db.Column(db.Integer, db.ForeignKey('staff.id'), nullable=False)
    login_time = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    logout_time = db.Column(db.DateTime)
    session_duration = db.Column(db.Integer)  # Duration in seconds
    ip_address = db.Column(db.String(45))  # IPv6 max length
    
    def to_dict(self):
        return {
            'id': self.id,
            'staff_id': self.staff_id,
            'login_time': self.login_time.isoformat() if self.login_time else None,
            'logout_time': self.logout_time.isoformat() if self.logout_time else None,
            'session_duration': self.session_duration,
            'ip_address': self.ip_address
        }

class Product(db.Model):
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(50))  # hair_products, nail_products, tools, supplies
    sku = db.Column(db.String(50), unique=True)  # Stock Keeping Unit
    unit_price = db.Column(db.Float, nullable=False)  # Cost price
    selling_price = db.Column(db.Float)  # Selling price (if applicable)
    stock_quantity = db.Column(db.Integer, default=0)
    min_stock_level = db.Column(db.Integer, default=5)  # Alert when below this
    unit = db.Column(db.String(20), default='piece')  # piece, bottle, box, etc.
    supplier = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    product_usage = db.relationship('ProductUsage', backref='product', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'category': self.category,
            'sku': self.sku,
            'unit_price': self.unit_price,
            'selling_price': self.selling_price,
            'stock_quantity': self.stock_quantity,
            'min_stock_level': self.min_stock_level,
            'unit': self.unit,
            'supplier': self.supplier,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'is_low_stock': self.stock_quantity <= self.min_stock_level
        }

class ProductUsage(db.Model):
    __tablename__ = 'product_usage'
    
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    appointment_id = db.Column(db.Integer, db.ForeignKey('appointments.id'))  # Optional - for backward compatibility
    sale_id = db.Column(db.Integer, db.ForeignKey('sales.id'))  # For sale-based transactions
    quantity_used = db.Column(db.Float, nullable=False)
    used_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    sale = db.relationship('Sale', backref='product_usage', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'appointment_id': self.appointment_id,
            'sale_id': self.sale_id,
            'quantity_used': self.quantity_used,
            'used_at': self.used_at.isoformat() if self.used_at else None
        }

class Expense(db.Model):
    __tablename__ = 'expenses'
    
    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String(50), nullable=False)  # rent, utilities, supplies, salaries, etc.
    description = db.Column(db.Text, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    expense_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    receipt_number = db.Column(db.String(50))  # Receipt/invoice number
    paid_by = db.Column(db.String(100))  # Who paid
    created_by = db.Column(db.Integer, db.ForeignKey('staff.id'))  # Staff who recorded
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'category': self.category,
            'description': self.description,
            'amount': self.amount,
            'expense_date': self.expense_date.isoformat() if self.expense_date else None,
            'receipt_number': self.receipt_number,
            'paid_by': self.paid_by,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Shift(db.Model):
    __tablename__ = 'shifts'
    
    id = db.Column(db.Integer, primary_key=True)
    staff_id = db.Column(db.Integer, db.ForeignKey('staff.id'), nullable=False)
    shift_date = db.Column(db.Date, nullable=False)
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)
    clock_in = db.Column(db.DateTime)  # Actual clock in time
    clock_out = db.Column(db.DateTime)  # Actual clock out time
    status = db.Column(db.String(20), default='scheduled')  # scheduled, active, completed, missed
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'staff_id': self.staff_id,
            'shift_date': self.shift_date.isoformat() if self.shift_date else None,
            'start_time': self.start_time.strftime('%H:%M') if self.start_time else None,
            'end_time': self.end_time.strftime('%H:%M') if self.end_time else None,
            'clock_in': self.clock_in.isoformat() if self.clock_in else None,
            'clock_out': self.clock_out.isoformat() if self.clock_out else None,
            'status': self.status,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

