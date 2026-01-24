"""
PDF generation functions for the POS Salon backend.
"""
import io
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT


def _create_pdf_styles():
    """
    Create and return PDF styles dictionary.
    
    Returns:
        dict: Dictionary of style objects
    """
    styles = getSampleStyleSheet()
    
    # Company Header Style
    company_header_style = ParagraphStyle(
        'CompanyHeader',
        parent=styles['Normal'],
        fontSize=18,
        textColor=colors.HexColor('#1e40af'),
        spaceAfter=5,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )
    
    company_subheader_style = ParagraphStyle(
        'CompanySubheader',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.grey,
        spaceAfter=20,
        alignment=TA_CENTER
    )
    
    # Title Style
    title_style = ParagraphStyle(
        'Title',
        parent=styles['Heading1'],
        fontSize=16,
        textColor=colors.HexColor('#1e40af'),
        spaceAfter=20,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )
    
    # Section Heading Style
    section_style = ParagraphStyle(
        'Section',
        parent=styles['Heading2'],
        fontSize=11,
        textColor=colors.HexColor('#1e40af'),
        spaceAfter=8,
        spaceBefore=12,
        fontName='Helvetica-Bold'
    )
    
    normal_style = styles['Normal']
    normal_style.fontSize = 10
    
    bold_style = ParagraphStyle(
        'Bold',
        parent=normal_style,
        fontName='Helvetica-Bold'
    )
    
    # Footer Style
    footer_style = ParagraphStyle(
        'Footer',
        parent=styles['Normal'],
        fontSize=8,
        textColor=colors.grey,
        alignment=TA_CENTER,
        spaceBefore=5
    )
    
    # Terms Style
    terms_style = ParagraphStyle(
        'Terms',
        parent=styles['Normal'],
        fontSize=8,
        textColor=colors.grey,
        alignment=TA_LEFT,
        spaceBefore=10
    )
    
    return {
        'company_header': company_header_style,
        'company_subheader': company_subheader_style,
        'title': title_style,
        'section': section_style,
        'normal': normal_style,
        'bold': bold_style,
        'footer': footer_style,
        'terms': terms_style
    }


def _amount_in_words(amount):
    """
    Convert amount to words.
    
    Args:
        amount: Numeric amount
    
    Returns:
        str: Amount in words
    """
    try:
        amount_str = f"{amount:,.2f}"
        parts = amount_str.split('.')
        whole_part = int(parts[0].replace(',', ''))
        decimal_part = int(parts[1]) if len(parts) > 1 else 0
        
        # Convert whole number to words (simplified)
        if whole_part == 0:
            whole_words = "Zero"
        else:
            whole_words = f"{whole_part:,}"
        
        if decimal_part > 0:
            return f"{whole_words} Kenya Shillings and {decimal_part} Cents Only"
        else:
            return f"{whole_words} Kenya Shillings Only"
    except:
        return f"{amount:,.2f} Kenya Shillings Only"


def generate_commission_receipt_pdf(payment, staff, payer=None):
    """
    Generate professional payslip PDF for commission payment.
    
    Args:
        payment: CommissionPayment object
        staff: Staff object
        payer: User object (optional)
    
    Returns:
        io.BytesIO: PDF buffer
    """
    # Create PDF in memory
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, 
                           rightMargin=0.75*inch, leftMargin=0.75*inch,
                           topMargin=0.5*inch, bottomMargin=0.5*inch)
    
    # Container for the 'Flowable' objects
    elements = []
    
    # Get styles
    styles_dict = _create_pdf_styles()
    
    # Company Header
    elements.append(Paragraph("PREMIUM BEAUTY SALON", styles_dict['company_header']))
    elements.append(Paragraph("PAYSLIP", styles_dict['title']))
    elements.append(Spacer(1, 0.1*inch))
    
    # Divider line using a table
    divider = Table([['']], colWidths=[6.5*inch])
    divider.setStyle(TableStyle([
        ('LINEBELOW', (0, 0), (0, 0), 1, colors.HexColor('#1e40af')),
        ('TOPPADDING', (0, 0), (0, 0), 5),
        ('BOTTOMPADDING', (0, 0), (0, 0), 5),
    ]))
    elements.append(divider)
    elements.append(Spacer(1, 0.15*inch))
    
    # Receipt Number and Pay Period Section
    receipt_header_data = [
        ['Receipt Number:', payment.receipt_number],
        ['Pay Period:', f"{payment.period_start.strftime('%d %B %Y') if payment.period_start else 'N/A'} to {payment.period_end.strftime('%d %B %Y') if payment.period_end else 'N/A'}"],
        ['Payment Date:', payment.payment_date.strftime('%d %B %Y') if payment.payment_date else 'N/A'],
    ]
    
    receipt_header_table = Table(receipt_header_data, colWidths=[2.5*inch, 4*inch])
    receipt_header_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('ALIGN', (0, 0), (0, -1), 'LEFT'),
        ('ALIGN', (1, 0), (1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f3f4f6')),
    ]))
    elements.append(receipt_header_table)
    elements.append(Spacer(1, 0.25*inch))
    
    # Employee Information Section
    elements.append(Paragraph("EMPLOYEE INFORMATION", styles_dict['section']))
    staff_data = [
        ['Full Name:', staff.name if staff else f'Staff ID {payment.staff_id}'],
        ['Staff ID:', str(payment.staff_id)],
        ['Position/Role:', (staff.role.replace('_', ' ').title() if staff and staff.role else 'N/A')],
    ]
    
    staff_table = Table(staff_data, colWidths=[2.5*inch, 4*inch])
    staff_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('ALIGN', (0, 0), (0, -1), 'LEFT'),
        ('ALIGN', (1, 0), (1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
    ]))
    elements.append(staff_table)
    elements.append(Spacer(1, 0.3*inch))
    
    # Earnings Section
    elements.append(Paragraph("EARNINGS", styles_dict['section']))
    
    # Get earnings items from payment
    earnings_items = [item for item in payment.items if item.item_type == 'earning'] if hasattr(payment, 'items') else []
    earnings_items.sort(key=lambda x: x.display_order)
    
    earnings_table_data = [['Item Name', 'Amount (KES)']]
    
    for item in earnings_items:
        item_name = item.item_name
        # For commission items, add sale number if available
        if item.sale_number:
            item_name = f"{item.item_name} ({item.sale_number})"
        earnings_table_data.append([item_name, f"{item.amount:,.2f}"])
    
    # Add gross pay row
    gross_pay = payment.gross_pay if payment.gross_pay is not None else sum(item.amount for item in earnings_items)
    earnings_table_data.append(['Gross Pay', f"{gross_pay:,.2f}"])
    
    earnings_table = Table(earnings_table_data, colWidths=[4.5*inch, 2*inch])
    earnings_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('ALIGN', (0, 0), (0, -1), 'LEFT'),
        ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#e5e7eb')),
        ('LINEBELOW', (0, -2), (-1, -2), 1, colors.grey),
        ('LINEBELOW', (0, -1), (-1, -1), 2, colors.HexColor('#1e40af')),
        ('FONTSIZE', (0, -1), (-1, -1), 11),
        ('TEXTCOLOR', (1, -1), (1, -1), colors.HexColor('#059669')),
    ]))
    elements.append(earnings_table)
    elements.append(Spacer(1, 0.3*inch))
    
    # Deductions Section
    elements.append(Paragraph("DEDUCTIONS", styles_dict['section']))
    
    # Get deductions items from payment
    deductions_items = [item for item in payment.items if item.item_type == 'deduction'] if hasattr(payment, 'items') else []
    deductions_items.sort(key=lambda x: x.display_order)
    
    deductions_table_data = [['Item Name', 'Amount (KES)']]
    
    # Calculate actual deduction amounts for percentage-based deductions
    for item in deductions_items:
        item_name = item.item_name
        if item.is_percentage:
            # Calculate actual amount from percentage
            if item.percentage_of == 'gross_pay' and gross_pay:
                calculated_amount = gross_pay * (item.amount / 100.0)
                item_name = f"{item.item_name} ({item.amount}%)"
            elif item.percentage_of == 'base_pay' and payment.base_pay:
                calculated_amount = payment.base_pay * (item.amount / 100.0)
                item_name = f"{item.item_name} ({item.amount}%)"
            else:
                calculated_amount = item.amount  # Fallback
            deductions_table_data.append([item_name, f"{calculated_amount:,.2f}"])
        else:
            deductions_table_data.append([item_name, f"{item.amount:,.2f}"])
    
    # Add total deductions row
    total_deductions = payment.total_deductions if payment.total_deductions is not None else 0.0
    deductions_table_data.append(['Total Deductions', f"{total_deductions:,.2f}"])
    
    deductions_table = Table(deductions_table_data, colWidths=[4.5*inch, 2*inch])
    deductions_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('ALIGN', (0, 0), (0, -1), 'LEFT'),
        ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#fee2e2')),
        ('LINEBELOW', (0, -2), (-1, -2), 1, colors.grey),
        ('LINEBELOW', (0, -1), (-1, -1), 2, colors.HexColor('#dc2626')),
        ('FONTSIZE', (0, -1), (-1, -1), 11),
        ('TEXTCOLOR', (1, -1), (1, -1), colors.HexColor('#dc2626')),
    ]))
    elements.append(deductions_table)
    elements.append(Spacer(1, 0.3*inch))
    
    # Summary Section
    elements.append(Paragraph("PAYMENT SUMMARY", styles_dict['section']))
    
    net_pay = payment.net_pay if payment.net_pay is not None else (gross_pay - total_deductions)
    
    summary_data = [
        ['Gross Pay:', f"KES {gross_pay:,.2f}"],
        ['Total Deductions:', f"KES {total_deductions:,.2f}"],
        ['Net Pay:', f"KES {net_pay:,.2f}"],
        ['Amount in Words:', _amount_in_words(net_pay)],
    ]
    
    summary_table = Table(summary_data, colWidths=[2.5*inch, 4*inch])
    summary_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
        ('FONTNAME', (1, 2), (1, 2), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('FONTSIZE', (1, 2), (1, 2), 14),
        ('ALIGN', (0, 0), (0, -1), 'LEFT'),
        ('ALIGN', (1, 0), (1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#dbeafe')),
        ('TEXTCOLOR', (1, 2), (1, 2), colors.HexColor('#1e40af')),
        ('LINEBELOW', (0, 1), (-1, 1), 1, colors.grey),
    ]))
    elements.append(summary_table)
    elements.append(Spacer(1, 0.3*inch))
    
    # Payment Details Section
    elements.append(Paragraph("PAYMENT DETAILS", styles_dict['section']))
    
    payment_details_data = [
        ['Payment Method:', (payment.payment_method or 'N/A').upper().replace('_', ' ')],
    ]
    
    if payment.transaction_reference:
        payment_details_data.append(['Transaction Reference:', payment.transaction_reference])
    
    payment_details_table = Table(payment_details_data, colWidths=[2.5*inch, 4*inch])
    payment_details_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('ALIGN', (0, 0), (0, -1), 'LEFT'),
        ('ALIGN', (1, 0), (1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
    ]))
    elements.append(payment_details_table)
    
    # Notes section if exists
    if payment.notes:
        elements.append(Spacer(1, 0.2*inch))
        notes_para = Paragraph(f"Additional Notes:\n{payment.notes}", styles_dict['normal'])
        elements.append(notes_para)
    
    elements.append(Spacer(1, 0.4*inch))
    
    # Signature Section with proper formatting
    signature_header = Paragraph("AUTHORIZATION & ACKNOWLEDGMENT", styles_dict['section'])
    elements.append(signature_header)
    elements.append(Spacer(1, 0.15*inch))
    
    signature_data = [
        ['', ''],
        ['', ''],
        ['_________________________', '_________________________'],
        ['Employee Signature', 'Authorized Signatory'],
        ['', ''],
    ]
    
    if payer:
        signature_data.append(['', f'Name: {payer.name}'])
        signature_data.append(['', f'Position: {(payer.role.upper() if payer.role else "MANAGER")}'])
    
    signature_table = Table(signature_data, colWidths=[3*inch, 3*inch])
    signature_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('ALIGN', (0, 3), (-1, 3), 'CENTER'),
        ('ALIGN', (1, 5), (1, 6), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 2), (-1, 2), 25),
        ('BOTTOMPADDING', (0, 2), (-1, 2), 5),
    ]))
    elements.append(signature_table)
    
    elements.append(Spacer(1, 0.3*inch))
    
    # Terms and Conditions Section
    elements.append(Paragraph("TERMS & CONDITIONS:", styles_dict['terms']))
    terms_text = """
    • This payslip serves as proof of payment for the stated period.
    • All amounts are in Kenyan Shillings (KES).
    • Any discrepancies must be reported within 7 days of receipt.
    • This is a computer-generated document and is legally valid.
    """
    elements.append(Paragraph(terms_text, styles_dict['terms']))
    
    elements.append(Spacer(1, 0.2*inch))
    
    # Footer divider
    footer_divider = Table([['']], colWidths=[6.5*inch])
    footer_divider.setStyle(TableStyle([
        ('LINEABOVE', (0, 0), (0, 0), 1, colors.grey),
        ('TOPPADDING', (0, 0), (0, 0), 5),
        ('BOTTOMPADDING', (0, 0), (0, 0), 5),
    ]))
    elements.append(footer_divider)
    elements.append(Spacer(1, 0.1*inch))
    elements.append(Paragraph("This is a computer-generated payslip and is legally valid.", styles_dict['footer']))
    elements.append(Paragraph(f"Generated on {datetime.now().strftime('%d %B %Y at %I:%M %p')}", styles_dict['footer']))
    elements.append(Paragraph("Premium Beauty Salon - Nairobi, Kenya", styles_dict['footer']))
    
    # Build PDF
    doc.build(elements)
    buffer.seek(0)
    
    return buffer


def generate_sales_receipt_pdf(sale, staff=None, customer=None, payment=None):
    """
    Generate professional sales receipt PDF.
    
    Args:
        sale: Sale object
        staff: Staff object (optional)
        customer: Customer object (optional)
        payment: Payment object (optional)
    
    Returns:
        io.BytesIO: PDF buffer
    """
    # Create PDF in memory
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, 
                           rightMargin=0.75*inch, leftMargin=0.75*inch,
                           topMargin=0.5*inch, bottomMargin=0.5*inch)
    
    # Container for the 'Flowable' objects
    elements = []
    
    # Get styles
    styles_dict = _create_pdf_styles()
    
    # Company Header
    elements.append(Paragraph("PREMIUM BEAUTY SALON", styles_dict['company_header']))
    elements.append(Paragraph("SALES RECEIPT", styles_dict['title']))
    elements.append(Spacer(1, 0.1*inch))
    
    # Divider line
    divider = Table([['']], colWidths=[6.5*inch])
    divider.setStyle(TableStyle([
        ('LINEBELOW', (0, 0), (0, 0), 1, colors.HexColor('#1e40af')),
        ('TOPPADDING', (0, 0), (0, 0), 5),
        ('BOTTOMPADDING', (0, 0), (0, 0), 5),
    ]))
    elements.append(divider)
    elements.append(Spacer(1, 0.15*inch))
    
    # Receipt Information
    receipt_number = payment.receipt_number if payment and payment.receipt_number else sale.receipt_number if hasattr(sale, 'receipt_number') else sale.sale_number
    receipt_header_data = [
        ['Receipt Number:', receipt_number],
        ['Sale Number:', sale.sale_number],
        ['Date:', sale.created_at.strftime('%d %B %Y') if sale.created_at else 'N/A'],
        ['Time:', sale.created_at.strftime('%I:%M %p') if sale.created_at else 'N/A'],
    ]
    
    receipt_header_table = Table(receipt_header_data, colWidths=[2.5*inch, 4*inch])
    receipt_header_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('ALIGN', (0, 0), (0, -1), 'LEFT'),
        ('ALIGN', (1, 0), (1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f3f4f6')),
    ]))
    elements.append(receipt_header_table)
    elements.append(Spacer(1, 0.25*inch))
    
    # Customer Information
    if customer:
        elements.append(Paragraph("CUSTOMER INFORMATION", styles_dict['section']))
        customer_data = [
            ['Name:', customer.name if customer else 'Walk-in Customer'],
            ['Phone:', customer.phone if customer and customer.phone else 'N/A'],
            ['Email:', customer.email if customer and customer.email else 'N/A'],
        ]
        
        customer_table = Table(customer_data, colWidths=[2.5*inch, 4*inch])
        customer_table.setStyle(TableStyle([
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('ALIGN', (0, 0), (0, -1), 'LEFT'),
            ('ALIGN', (1, 0), (1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
        ]))
        elements.append(customer_table)
        elements.append(Spacer(1, 0.3*inch))
    
    # Staff Information
    if staff:
        elements.append(Paragraph("STAFF INFORMATION", styles_dict['section']))
        staff_data = [
            ['Staff Name:', staff.name if staff else 'N/A'],
            ['Staff ID:', str(sale.staff_id)],
        ]
        
        staff_table = Table(staff_data, colWidths=[2.5*inch, 4*inch])
        staff_table.setStyle(TableStyle([
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('ALIGN', (0, 0), (0, -1), 'LEFT'),
            ('ALIGN', (1, 0), (1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
        ]))
        elements.append(staff_table)
        elements.append(Spacer(1, 0.3*inch))
    
    # Services Section
    if hasattr(sale, 'sale_services') and sale.sale_services:
        elements.append(Paragraph("SERVICES", styles_dict['section']))
        services_table_data = [['Service', 'Qty', 'Unit Price', 'Total']]
        
        for ss in sale.sale_services:
            service_name = ss.service.name if ss.service else f"Service #{ss.service_id}"
            services_table_data.append([
                service_name,
                str(ss.quantity),
                f"{ss.unit_price:,.2f}",
                f"{ss.total_price:,.2f}"
            ])
        
        services_table = Table(services_table_data, colWidths=[3*inch, 0.8*inch, 1.2*inch, 1.5*inch])
        services_table.setStyle(TableStyle([
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('ALIGN', (0, 0), (0, -1), 'LEFT'),
            ('ALIGN', (1, 0), (-1, -1), 'RIGHT'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#e5e7eb')),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ]))
        elements.append(services_table)
        elements.append(Spacer(1, 0.3*inch))
    
    # Products Section
    if hasattr(sale, 'sale_products') and sale.sale_products:
        elements.append(Paragraph("PRODUCTS", styles_dict['section']))
        products_table_data = [['Product', 'Qty', 'Unit Price', 'Total']]
        
        for sp in sale.sale_products:
            product_name = sp.product.name if sp.product else f"Product #{sp.product_id}"
            products_table_data.append([
                product_name,
                f"{sp.quantity:.2f}",
                f"{sp.unit_price:,.2f}",
                f"{sp.total_price:,.2f}"
            ])
        
        products_table = Table(products_table_data, colWidths=[3*inch, 0.8*inch, 1.2*inch, 1.5*inch])
        products_table.setStyle(TableStyle([
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('ALIGN', (0, 0), (0, -1), 'LEFT'),
            ('ALIGN', (1, 0), (-1, -1), 'RIGHT'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#e5e7eb')),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ]))
        elements.append(products_table)
        elements.append(Spacer(1, 0.3*inch))
    
    # Summary Section
    elements.append(Paragraph("PAYMENT SUMMARY", styles_dict['section']))
    
    subtotal = sale.subtotal if hasattr(sale, 'subtotal') and sale.subtotal else 0.0
    tax_amount = sale.tax_amount if hasattr(sale, 'tax_amount') and sale.tax_amount else 0.0
    total_amount = sale.total_amount if hasattr(sale, 'total_amount') else 0.0
    
    summary_data = [
        ['Subtotal:', f"KES {subtotal:,.2f}"],
        ['Tax:', f"KES {tax_amount:,.2f}"],
        ['Total:', f"KES {total_amount:,.2f}"],
    ]
    
    if payment:
        summary_data.append(['Payment Method:', (payment.payment_method or 'N/A').upper().replace('_', ' ')])
        if payment.transaction_code:
            summary_data.append(['Transaction Code:', payment.transaction_code])
    
    summary_table = Table(summary_data, colWidths=[2.5*inch, 4*inch])
    summary_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
        ('FONTNAME', (1, 2), (1, 2), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('FONTSIZE', (1, 2), (1, 2), 14),
        ('ALIGN', (0, 0), (0, -1), 'LEFT'),
        ('ALIGN', (1, 0), (1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BACKGROUND', (0, 2), (-1, 2), colors.HexColor('#dbeafe')),
        ('TEXTCOLOR', (1, 2), (1, 2), colors.HexColor('#1e40af')),
        ('LINEBELOW', (0, 1), (-1, 1), 1, colors.grey),
    ]))
    elements.append(summary_table)
    elements.append(Spacer(1, 0.3*inch))
    
    # Footer
    footer_divider = Table([['']], colWidths=[6.5*inch])
    footer_divider.setStyle(TableStyle([
        ('LINEABOVE', (0, 0), (0, 0), 1, colors.grey),
        ('TOPPADDING', (0, 0), (0, 0), 5),
        ('BOTTOMPADDING', (0, 0), (0, 0), 5),
    ]))
    elements.append(footer_divider)
    elements.append(Spacer(1, 0.1*inch))
    elements.append(Paragraph("Thank you for your business!", styles_dict['footer']))
    elements.append(Paragraph(f"Generated on {datetime.now().strftime('%d %B %Y at %I:%M %p')}", styles_dict['footer']))
    elements.append(Paragraph("Premium Beauty Salon - Nairobi, Kenya", styles_dict['footer']))
    
    # Build PDF
    doc.build(elements)
    buffer.seek(0)
    
    return buffer
