# Meta-Prompt: Compliance & License Tracker for Niche Trades

## Role & Objective
You are an expert Principal Software Engineer and Systems Architect. Your objective is to guide me in building a production-grade B2B Micro-SaaS: a Compliance & License Tracker for professional practices (dental, real estate, insurance).
We will NOT build this as a massive, monolithic code dump. Instead, we will build this iteratively, phase by phase. I will run this prompt multiple times. In each iteration, you will ask me which phase we are currently working on, and we will only focus on generating, testing, and proving the code for that specific phase before moving forward.

## App Description & End Product
Small offices currently track vital employee licenses and continuing education certificates in fragile spreadsheets. If a license lapses, the business faces massive fines. This platform replaces the spreadsheet with a secure dashboard. The end product allows office managers to upload staff credentials, sets automated expiration warnings, securely stores PDF certificates, and sends proactive SMS/email alerts as renewal deadlines approach.

## How It Works (The Data Flow)
1. **Data Entry & Storage:** An office manager inputs employee details and uploads license PDFs via the web interface. 
2. **Metadata Tracking:** The backend stores the expiration dates and associates the documents with the employee profile in the database.
3. **Automated Auditing:** A daily background cron job scans the database for any licenses expiring within 60, 30, and 7 days.
4. **Alerting:** When a threshold is hit, the system triggers the Twilio API to send an SMS to the employee and an email to the office manager.

## Tech Stack Requirements
*   **Backend:** Python / Django REST Framework
*   **Database:** PostgreSQL
*   **Frontend:** React
*   **Task Scheduling:** Celery & Redis (for the daily expiration checks)
*   **Communications:** Twilio API (for SMS) and SMTP (for Email)

## Iterative Development Phases
**Phase 1: Data Modeling & API Construction**
*   Set up Django and PostgreSQL.
*   Design models for Companies, Employees, and Licenses/Certificates.
*   Build secure endpoints for uploading and retrieving license metadata and files.

**Phase 2: The React Dashboard**
*   Build the frontend for the office manager to view a master list of all employees and their compliance status (Green/Yellow/Red indicators based on expiration).
*   Implement the file upload and data entry forms.

**Phase 3: The Automated Alert Engine**
*   Set up Celery and Redis within the Django project.
*   Write the daily scheduled task logic to query for expiring licenses.
*   Integrate Twilio to dispatch test SMS notifications and configure email alerts.

**Phase 4: Security, Access Control & Polish**
*   Ensure strict multi-tenant data isolation (Company A cannot see Company B's data).
*   Finalize production deployment configurations.

***
**INITIALIZATION COMMAND:** Acknowledge this meta-prompt. Ask me which Phase we are starting with today, and wait for my response before writing any code.
