"""
Plan config for Paystack checkout (KES). USD amounts shown in UI; converted to KES for payment.
"""
from __future__ import annotations
import os
from typing import Optional

# Plan slugs (lowercase): essential, advance, expert
PLAN_SLUGS = ["essential", "advance", "expert"]

# USD amounts (display): (monthly, annual) — match frontend Pricing
USD_AMOUNTS = {
    "essential": (29, 261),
    "advance": (79, 711),
    "expert": (299, 2691),
}


def get_usd_amount(plan_slug: str, billing_interval: str) -> Optional[float]:
    """Return USD amount for plan + monthly|annual, or None if invalid."""
    plan = (plan_slug or "").lower().strip()
    if plan not in PLAN_SLUGS:
        return None
    interval = (billing_interval or "monthly").lower().strip()
    if interval not in ("monthly", "annual"):
        interval = "monthly"
    monthly, annual = USD_AMOUNTS.get(plan, (0, 0))
    return float(annual) if interval == "annual" else float(monthly)


def usd_to_kes_subunits(usd: float, rate: Optional[float] = None) -> int:
    """
    Convert USD to KES and return amount in Paystack subunits (KES cents).
    rate: 1 USD = rate KES. Default from PAYSTACK_USD_TO_KES_RATE.
    Min Paystack KES = 300 (Ksh 3.00).
    """
    r = rate
    if r is None:
        try:
            r = float(os.getenv("PAYSTACK_USD_TO_KES_RATE", "130").strip() or "130")
        except (ValueError, TypeError):
            r = 130.0
    if r <= 0:
        r = 130.0
    kes = usd * r
    subunits = int(round(kes * 100))  # KES subunit = cent
    return max(300, subunits)


def plan_requires_checkout(plan_slug: str) -> bool:
    """True if plan requires Paystack checkout."""
    return (plan_slug or "").lower().strip() in PLAN_SLUGS
