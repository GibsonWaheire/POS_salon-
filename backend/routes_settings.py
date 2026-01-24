"""
Settings routes (admin-side). Business type and other org-level config.
"""
from flask import Blueprint, request, jsonify
from auth_helpers import require_auth
from models import Setting
from db import db

bp_settings = Blueprint('settings', __name__)

BUSINESS_TYPE_KEY = 'business_type'


def _get_setting(key):
    row = Setting.query.filter_by(key=key).first()
    return row.value if row else None


def _set_setting(key, value):
    row = Setting.query.filter_by(key=key).first()
    if row:
        row.value = value
    else:
        row = Setting(key=key, value=value)
        db.session.add(row)
    db.session.commit()
    return row.value


@bp_settings.route('/settings', methods=['GET'])
@require_auth
def get_settings():
    """Return settings (admin-side). Used by Settings page."""
    business_type = _get_setting(BUSINESS_TYPE_KEY)
    return jsonify({'business_type': business_type})


@bp_settings.route('/settings/public', methods=['GET'])
def get_settings_public():
    """Public read-only: business_type only. Used by POS for labels (staff login)."""
    business_type = _get_setting(BUSINESS_TYPE_KEY)
    return jsonify({'business_type': business_type})


@bp_settings.route('/settings', methods=['PUT'])
@require_auth
def update_settings():
    """Update settings. Admin-side only."""
    data = request.get_json() or {}
    if 'business_type' in data:
        val = data['business_type']
        val = None if val is None or (isinstance(val, str) and not val.strip()) else str(val).strip()
        _set_setting(BUSINESS_TYPE_KEY, val)
    business_type = _get_setting(BUSINESS_TYPE_KEY)
    return jsonify({'business_type': business_type})
