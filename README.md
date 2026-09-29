# Online Bus Pass Management System

A full-stack, enterprise-grade **Online Bus Pass Management System** built with **ReactJS**, **Django REST Framework**, and **MySQL**. 

> **Notice:** Authentication is intentionally disabled in this application as per specification. All public applicant features and admin dashboard tools are directly accessible without login credentials.

---

## Features

### Public Applicant Features
- **Bus Pass Application:** Multi-step form with route stop selection, photo & ID proof uploads.
- **Application Status Tracking:** Search by unique `APP-XXXXXX` ID to view real-time processing status and approval/rejection details.
- **Digital Bus Pass Card:** Realistic ID pass card with QR code verification, commuter info, validity status, and built-in **Print Pass** & **Save PDF** controls.
- **Bus Pass Renewal:** Request validity extensions on active or expired passes with auto-calculated fees and unique `REN-XXXXXX` IDs.
- **Pass Category Showcase:** View pricing cards for Daily, Weekly, Monthly, Student, and Employee passes.
- **Route & Bus Stop Directory:** Interactive list of all active transport corridors and sequenced bus stops.

### Admin Dashboard Features (Authentication-Free)
- **KPI Metrics & Analytics:** Real-time summary cards (Applications, Issued Passes, Active/Expired breakdown, Revenue collections) and interactive **Chart.js** charts.
- **Application Management:** Approve/reject applications with custom rejection notes, issue digital bus passes with generated QR codes, and filter by status.
- **Issued Passes Management:** Manage digital pass registries, inspect QR credentials, and track expiry dates.
- **Renewal Management:** Approve/reject renewal requests with automatic pass expiry date recalculation.
- **Transit Fleet Management:** Full CRUD operations for Buses (Registration, Type, Capacity, Driver Name/Phone, Status).
- **Route Network Management:** Full CRUD operations for Bus Routes & Bus Stops.
- **Pass Category Management:** Full CRUD for Pass Types, Pricing rules, and Durations.
- **Audit Reports:** Printable audit summaries of applications, pass registries, and revenue logs.

---

## Technology Stack

- **Frontend:** ReactJS (v18), Vite, React Router (v6), Axios, Bootstrap 5, React Icons, Chart.js / react-chartjs-2, qrcode.react.
- **Backend:** Python (3.10+), Django (4.2), Django REST Framework, django-cors-headers, PyMySQL, Pillow, qrcode.
- **Database:** MySQL (with automatic SQLite fallback for rapid local offline testing).

---

## Project Structure

```text
online-bus-pass-management-system/
├── README.md
├── .gitignore
├── .env.example
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── config/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── apps/
│   │   ├── applications/
│   │   ├── buses/
│   │   ├── routes/
│   │   ├── pass_types/
│   │   ├── passes/
│   │   ├── renewals/
│   │   ├── dashboard/
│   │   └── core/ (seed command)
│   ├── media/
│   └── static/
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    ├── .env.example
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── components/
        ├── layouts/
        ├── pages/
        ├── services/
        ├── utils/
        └── styles/
```

---

## MySQL Setup & Database Creation

1. Open MySQL Command Line or Workbench and create the database:
   ```sql
   CREATE DATABASE bus_pass_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. Configure backend environment in `backend/.env` (or project root `.env`):
   ```env
   SECRET_KEY=your-secret-key
   DEBUG=True

   USE_MYSQL=True
   DB_NAME=bus_pass_db
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_HOST=localhost
   DB_PORT=3306
   ```

---

## Backend Installation & Setup

```bash
# 1. Navigate to backend directory
cd backend

# 2. Create and activate virtual environment
python -m venv venv

# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Generate & Run Database Migrations
python manage.py makemigrations pass_types buses routes applications passes renewals core dashboard
python manage.py migrate

# 5. Populate Realistic Seed Demo Data
python manage.py seed_data

# 6. Run Unit Tests
python manage.py test

# 7. Start Django Server
python manage.py runserver
```

Backend REST API will be active at `http://localhost:8000/api/`

---

## Frontend Installation & Setup

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install Node dependencies
npm install

# 3. Start Vite Dev Server
npm run dev
```

Frontend application will open at `http://localhost:5173/`

---

## Main API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET / POST` | `/api/applications/` | List or Submit new Bus Pass Application |
| `POST` | `/api/applications/{id}/approve/` | Approve application |
| `POST` | `/api/applications/{id}/reject/` | Reject application with reason |
| `POST` | `/api/applications/{id}/issue-pass/` | Issue digital bus pass & QR code |
| `GET` | `/api/applications/status-check/?app_id=APP-100001` | Track application by ID |
| `GET` | `/api/passes/lookup/?pass_number=PASS-200001` | Retrieve bus pass details |
| `GET` | `/api/passes/verify/{pass_number}/` | Verify QR pass validity |
| `GET / POST` | `/api/renewals/` | Submit or list pass renewal requests |
| `POST` | `/api/renewals/{id}/approve/` | Approve renewal and update pass expiry |
| `GET / POST` | `/api/buses/` | CRUD for Transit Buses |
| `GET / POST` | `/api/routes/` | CRUD for Bus Routes |
| `GET / POST` | `/api/bus-stops/` | CRUD for Bus Stops |
| `GET / POST` | `/api/pass-types/` | CRUD for Pass Categories & Fees |
| `GET` | `/api/dashboard/stats/` | Aggregated Admin KPIs & Charts data |

---

## Complete Workflow Test

```text
Open Home (http://localhost:5173)
      ↓
Apply for Bus Pass (/apply)
      ↓
Receive Application ID (APP-XXXXXX)
      ↓
Check Application Status (/application-status)
      ↓
Open Admin Dashboard (/admin/applications)
      ↓
Approve Application -> Issue Bus Pass
      ↓
Receive Pass Number (PASS-XXXXXX) with QR Code
      ↓
View Digital Bus Pass (/view-pass) -> Print/Save PDF
      ↓
Submit Pass Renewal (/renew-pass)
      ↓
Admin Approves Renewal (/admin/renewals)
      ↓
Pass Expiry Date Automatically Extended
```
