"""
Report routes for the POS Salon backend.
"""
from flask import Blueprint, request, jsonify
from datetime import datetime, date, timedelta
from utils import get_demo_filter
from report_calculators import (
    calculate_daily_sales_report,
    calculate_commission_payout_report,
    calculate_financial_summary,
    calculate_tax_report
)
from db import db

bp_reports = Blueprint('reports', __name__)


@bp_reports.route('/reports/daily-sales', methods=['GET'])
def get_daily_sales_report():
    """Get daily sales report (Z-report)"""
    report_date = request.args.get('date')
    if report_date:
        target_date = datetime.fromisoformat(report_date).date()
    else:
        target_date = date.today()
    
    demo_filter = get_demo_filter(None, request)
    report_data = calculate_daily_sales_report(target_date, demo_filter, db.session)
    
    return jsonify(report_data), 200


@bp_reports.route('/reports/commission-payout', methods=['GET'])
def get_commission_payout_report():
    """Get commission payout report for staff"""
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    staff_id = request.args.get('staff_id', type=int)
    
    if start_date:
        start_dt = datetime.fromisoformat(start_date)
    else:
        start_dt = datetime.combine(date.today() - timedelta(days=30), datetime.min.time())
    
    if end_date:
        end_dt = datetime.fromisoformat(end_date)
    else:
        end_dt = datetime.combine(date.today(), datetime.max.time())
    
    demo_filter = get_demo_filter(None, request)
    report_data = calculate_commission_payout_report(start_dt, end_dt, staff_id, demo_filter, db.session)
    
    return jsonify(report_data), 200


@bp_reports.route('/reports/financial-summary', methods=['GET'])
def get_financial_summary():
    """Get financial summary (P&L, cash flow)"""
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    if start_date:
        start_dt = datetime.fromisoformat(start_date)
    else:
        start_dt = datetime.combine(date.today() - timedelta(days=30), datetime.min.time())
    
    if end_date:
        end_dt = datetime.fromisoformat(end_date)
    else:
        end_dt = datetime.combine(date.today(), datetime.max.time())
    
    demo_filter = get_demo_filter(None, request)
    summary_data = calculate_financial_summary(start_dt, end_dt, demo_filter, db.session)
    
    return jsonify(summary_data), 200


@bp_reports.route('/reports/tax-report', methods=['GET'])
def get_tax_report():
    """Get tax report for KRA filing"""
    month = request.args.get('month')  # Format: YYYY-MM
    
    demo_filter = get_demo_filter(None, request)
    report_data = calculate_tax_report(month, demo_filter, db.session)
    
    return jsonify(report_data), 200
