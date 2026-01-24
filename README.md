# Salonyst

A point-of-sale and management system for salons. Handles sales, staff, services, inventory, expenses, commission payments, and financial reports.

## Tech Stack

- **Backend:** Flask (Python), SQLAlchemy, SQLite
- **Frontend:** React, Vite, Tailwind CSS, shadcn/ui, Recharts
- **Auth:** Admin/Manager (email + password), Staff (ID + PIN)

## Prerequisites

- Python 3.8+
- Node.js 18+
- npm or yarn

## Quick Start

### 1. Backend

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Apply database migrations
export FLASK_APP=app.py
flask db upgrade

# Run the server (default: http://localhost:5001)
python app.py
```

### 2. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Run dev server (default: http://localhost:5173)
npm run dev
```
---

## Project Structure

```
POS_salon/
├── backend/                 # Flask API
│   ├── app.py              # Entry point
│   ├── models.py           # SQLAlchemy models
│   ├── auth_helpers.py     # Auth & permission decorators
│   ├── routes_*.py         # API routes
│   ├── migrations/         # Alembic migrations
│   └── requirements.txt
├── frontend/               # React app
│   ├── src/
│   │   ├── pages/          # Main pages
│   │   ├── components/     # Reusable UI
│   │   ├── context/       # AuthContext
│   │   └── lib/            # api.js, utils
│   └── package.json
└── README.md
```

---

## Features

- **Dashboard** – Sales, revenue, and activity
- **POS** – Staff-only sales (walk-in)
- **Staff** – Staff and roles
- **Services** – Services and pricing
- **Commission Payments** – Base pay, commissions, deductions (NSSF, NHIF, etc.), payslips
- **Payments** – Payment records
- **Inventory** – Products and stock
- **Expenses** – Expenses by category
- **Reports** – Daily sales, commission payout, financial summary, tax (KRA)
- **Users** (Admin only) – Create and manage managers

---

## Roles & Access

| Feature            | Admin | Manager | Staff |
|--------------------|-------|---------|-------|
| Dashboard          | ✓     | ✓       | –     |
| Staff CRUD         | ✓     | ✓       | –     |
| Services           | ✓     | ✓       | –     |
| Commission payments| ✓     | ✓       | –     |
| Reports            | ✓     | ✓       | –     |
| Users (managers)   | ✓     | –       | –     |
| POS (sales)        | –     | –       | ✓     |
| Commission history | –     | –       | ✓     |

---

## API

Base URL: `http://localhost:5001/api`

| Area         | Examples |
|--------------|----------|
| Auth         | `POST /auth/login`, `POST /auth/logout` |
| Users        | `GET /users`, `GET /users/managers`, `POST /users` (admin) |
| Staff        | `GET /staff`, `POST /staff`, `POST /staff/login` |
| Services     | `GET /services`, `POST /services` |
| Sales        | `GET /sales`, `POST /sales`, `POST /sales/<id>/complete` |
| Commissions  | `GET /commissions/pending`, `POST /commissions/pay` |
| Reports      | `GET /reports/daily-sales`, `GET /reports/commission-payout`, `GET /reports/financial-summary` |

See `backend/README.md` for a full API list.

---

## Database

- **DB file:** `backend/pos_salon.db` (SQLite, created on first run)
- **Migrations:** Flask-Migrate (Alembic)

```bash
cd backend
export FLASK_APP=app.py

# Apply migrations
flask db upgrade

# After model changes
flask db migrate -m "Description"
flask db upgrade
```

---

## Backend CLI

```bash
cd backend
export FLASK_APP=app.py

flask init-db           # Apply migrations
flask seed-staff        # Seed demo staff
flask seed-staff --force
flask list-staff
flask show-demo-login
flask create-staff      # Interactive
flask reset-db          # WARNING: drops all tables
```

---

## Environment (optional)

Create `backend/.env`:

```
DATABASE_URL=sqlite:///pos_salon.db
SECRET_KEY=your-secret-key
```

---

## License

MIT
