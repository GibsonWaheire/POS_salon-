"""
Checkout routes: create Paystack transaction (KES) for subscription.
UI displays USD; amount is converted to KES for Paystack.
"""
import json
import os
import urllib.request
import urllib.error
from flask import Blueprint, request, jsonify, current_app, g

from auth_helpers import require_auth
from checkout_plans import (
    get_usd_amount,
    usd_to_kes_subunits,
    plan_requires_checkout,
    PLAN_SLUGS,
)

bp_checkout = Blueprint("checkout", __name__)

PAYSTACK_INIT_URL = "https://api.paystack.co/transaction/initialize"


@bp_checkout.route("/checkout/create-session", methods=["POST"])
@require_auth
def create_checkout_session():
    """Create Paystack checkout (KES) for the given plan. User must be authenticated."""
    try:
        data = request.get_json() or {}
        plan = (data.get("plan") or "").strip().lower()
        billing_interval = (data.get("billing_interval") or data.get("billingInterval") or "monthly").strip().lower()
        if billing_interval not in ("monthly", "annual"):
            billing_interval = "monthly"

        if not plan or plan not in PLAN_SLUGS:
            return jsonify({"success": False, "error": "Invalid plan"}), 400
        if not plan_requires_checkout(plan):
            return jsonify({"success": False, "error": "Plan does not use checkout"}), 400

        secret = os.getenv("PAYSTACK_SECRET_KEY", "").strip()
        if not secret:
            return jsonify({"success": False, "error": "Paystack is not configured"}), 503

        usd = get_usd_amount(plan, billing_interval)
        if usd is None:
            return jsonify({"success": False, "error": f"No amount for {plan} ({billing_interval})"}), 400

        amount_kes_subunits = usd_to_kes_subunits(usd)
        user = g.current_user
        success_url = os.getenv("PAYSTACK_SUCCESS_URL", "http://localhost:5173/welcome").strip()
        cancel_url = os.getenv("PAYSTACK_CANCEL_URL", "http://localhost:5173/checkout").strip()

        payload = {
            "email": user.email,
            "amount": amount_kes_subunits,
            "currency": "KES",
            "callback_url": success_url,
            "metadata": {
                "user_id": str(user.id),
                "plan": plan,
                "billing_interval": billing_interval,
                "usd_amount": str(round(usd, 2)),
                "cancel_action": cancel_url,
            },
        }

        body = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            PAYSTACK_INIT_URL,
            data=body,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {secret}",
            },
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=30) as resp:
            out = json.loads(resp.read().decode())

        if not out.get("status"):
            msg = out.get("message") or "Paystack error"
            return jsonify({"success": False, "error": msg}), 400

        data_obj = out.get("data") or {}
        url = data_obj.get("authorization_url")
        if not url:
            return jsonify({"success": False, "error": "No checkout URL returned"}), 502

        return jsonify({
            "success": True,
            "url": url,
            "kes_subunits": amount_kes_subunits,
            "usd_amount": usd,
        }), 200

    except urllib.error.HTTPError as e:
        try:
            err_body = e.read().decode()
            err_json = json.loads(err_body)
            msg = err_json.get("message") or str(e)
        except Exception:
            msg = str(e)
        status = e.code if 400 <= e.code < 600 else 502
        return jsonify({"success": False, "error": msg or "Payment error"}), status
    except Exception as e:
        if current_app.debug:
            raise
        return jsonify({"success": False, "error": "Could not create checkout"}), 500
