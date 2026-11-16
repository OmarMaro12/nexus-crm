# NEXUS CRM

A responsive CRM starter built with Next.js and JavaScript.

## Features
- Demo login and logout
- Dashboard overview
- Customer create, edit, delete and search
- Deals create, edit, delete and pipeline stages
- Tasks create, edit, delete and completion
- Settings for profile and currency display
- Data persists in the current browser using localStorage

## Run locally
1. Install Node.js (18.18+; Node 20+ recommended).
2. Extract this ZIP.
3. Open the extracted `nexus-crm` folder in VS Code.
4. Open Terminal in that folder and run:
   ```bash
   npm install
   npm run dev
   ```
5. Open http://localhost:3000

## Demo login
- Email: `admin@nexuscrm.com`
- Password: `admin123`

This is a learning/demo application. Authentication is client-side and data is stored in the browser, not a secure production database. Do not use real customer information or passwords. For production, add server-side authentication, authorization, validation and a database.

## Reset demo data
Use the browser's site data/localStorage controls, or open DevTools Console and run:
`localStorage.clear(); location.reload();`
