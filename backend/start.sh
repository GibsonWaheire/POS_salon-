#!/bin/bash
# Railway startup script - runs database migrations before starting the app
flask db upgrade
exec gunicorn app:app
