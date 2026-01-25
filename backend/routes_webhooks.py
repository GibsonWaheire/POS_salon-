"""
Paystack webhooks. Uses raw request body for HMAC SHA512 verification.
"""
import hmac
import hashlib
import json
import os
from flask import Blueprint, request, jsonify
from db import db
from models import User, Subscription

bp_webhooks = Blueprint("webhooks", __name__, url_prefix="/webhooks")


def _verify_paystack_signature(payload: bytes, signature: str, secret: str) -> bool:
    if not secret or not signature:
        return False
    expected = hmac.new(secret.encode(), payload, hashlib.sha512).hexdigest()
    return hmac.compare_digest(expected, signature)


@bp_webhooks.route("/paystack", methods=["POST"])
def paystack_webhook():
    """Handle Paystack webhook events. Raw body required for verification."""
    payload = request.get_data(as_text=False)
    sig = (request.headers.get("x-paystack-signature") or "").strip()
    secret = os.getenv("PAYSTACK_SECRET_KEY", "").strip()
    if not secret:
        return jsonify({"received": True}), 200

    if not _verify_paystack_signature(payload, sig, secret):
        return jsonify({"error": "Invalid signature"}), 400

    try:
        body = json.loads(payload.decode("utf-8"))
    except Exception:
        return jsonify({"error": "Invalid JSON"}), 400

    event = (body.get("event") or "").strip().lower()
    if event != "charge.success":
        return jsonify({"received": True}), 200

    try:
        _handle_charge_success(body)
    except Exception:
        import traceback
        traceback.print_exc()
        db.session.rollback()
        return jsonify({"error": "Webhook handler failed"}), 500

    return jsonify({"received": True}), 200


def _handle_charge_success(body: dict) -> None:
    data = body.get("data") or {}
    meta = data.get("metadata") or {}
    user_id_str = meta.get("user_id")
    plan = (meta.get("plan") or "essential").strip().lower()
    if not user_id_str:
        return
    try:
        user_id = int(user_id_str)
    except (ValueError, TypeError):
        return
    user = User.query.get(user_id)
    if not user:
        return

    reference = str(data.get("reference") or "")
    # Use Paystack reference as external id for idempotency
    existing = Subscription.query.filter_by(stripe_subscription_id=reference).first()
    if existing:
        return

    sub = Subscription(
        user_id=user_id,
        plan_name=plan,
        status="active",
        stripe_customer_id=None,
        stripe_subscription_id=reference,
    )
    db.session.add(sub)
    db.session.commit()
