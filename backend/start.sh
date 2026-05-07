#!/bin/bash
# Railway startup script - runs database migrations before starting the app
flask db upgrade
exec gunicorn app:app --bind 0.0.0.0:$PORT --timeout 120 --workers 2
