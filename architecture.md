# Phase 1: Architecture & Tech Stack

## 1. Tech Stack
*   **Backend:** Python 3.12+, Django REST Framework
*   **Database:** PostgreSQL
*   **Frontend:** React (SPA, potentially with Vite for fast builds)
*   **Task Scheduling:** Celery with Redis as the message broker
*   **Communications:** Twilio API (SMS), SMTP (Email)
*   **Storage:** Local filesystem initially, configured to easily swap to AWS S3 or equivalent for PDF certificates.

## 2. System Architecture
*   **Client-Server Model:** The React frontend will communicate with the Django backend via a RESTful API.
*   **Asynchronous Processing:** Long-running tasks (like daily expiration audits and sending emails/SMS) will be offloaded to Celery workers backed by Redis, ensuring the API remains highly responsive.
*   **Multi-Tenancy Architecture:** Data isolation will be enforced at the application level via foreign keys linking all records (Employees, Licenses) to a `Company` model. Middleware or query mixins will guarantee users only access their company's data.

## 3. Folder Structure
```text
/app
├── backend/                  # Django Project Root
│   ├── config/               # Project configuration, settings, urls, wsgi/asgi
│   ├── core/                 # Shared utilities, custom user model, base models
│   ├── tracker/              # Main app: Companies, Employees, Licenses
│   ├── alerts/               # Celery tasks, Twilio/SMTP integrations
│   ├── requirements.txt      # Python dependencies
│   └── manage.py
├── frontend/                 # React Project Root
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # View components (Dashboard, EmployeeList)
│   │   ├── services/         # API client layer (Axios/Fetch)
│   │   └── App.js
│   ├── package.json
│   └── public/
├── docker-compose.yml        # Local dev environment (Postgres, Redis)
└── README.md
```

## 4. Core Features
1.  **Company & User Management:** Registration and isolation of office managers and their respective companies.
2.  **Employee Directory:** CRUD operations for employee profiles.
3.  **License & Certificate Tracking:** Uploading PDFs and tracking expiration dates.
4.  **Compliance Dashboard:** Visual indicators (Green, Yellow, Red) showing overall compliance status.
5.  **Automated Alerting Engine:** Daily cron jobs detecting expiring credentials.
6.  **Notification System:** Dispatching proactive warnings via SMS (Twilio) and Email (SMTP).

## 5. Development Roadmap
*   **Phase 1: Architecture & Tech Stack (Current Phase)** - We define the system blueprint.
*   **Phase 2: The Skeleton (The Foundation)** - We set up the Django project, install dependencies, and configure PostgreSQL/Redis using Docker Compose.
*   **Phase 3: Iterative Feature Building (Bit-by-Bit)** - Implementing the "Data Modeling & API Construction", "The React Dashboard", and "Automated Alert Engine" from the original spec, one feature at a time using test-driven development (TDD).
*   **Phase 4: Production Polish & Add-ons** - Security hardening, strict multi-tenant access control, and rate limiting.
*   **Phase 5: Deployment Guide** - Finalizing configuration for cloud deployment.
