#!/bin/bash
# Railway startup script - initializes DB and starts the server
python init_db.py
exec gunicorn app:app --bind 0.0.0.0:$PORT --timeout 120 --workers 2
