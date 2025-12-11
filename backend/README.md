# Mudralya Backend

Express-based API to support the Mudralya frontend.

## Quick start
- Install dependencies: `npm install`
- Copy env file: copy `.env.example` to `.env` (e.g. `cp .env.example .env`) and adjust values
- Run in dev mode: `npm run dev`
- Production start: `npm start`

## Configuration
- `PORT`: Port to run the server (default `5000`)
- `CORS_ORIGIN`: Comma-separated allowed origins for CORS (e.g. `http://localhost:5173,http://localhost:3000`)
- `LOG_LEVEL`: Morgan log format (default `dev`)
- `MONGO_URI`: MongoDB connection string (e.g. `mongodb+srv://nishant_db_user:<db_password>@mudralya.nufkdkl.mongodb.net/?appName=Mudralya`)
- `MONGO_DB_NAME`: Database name to use within the cluster (default `mudralya`)
- `DASHBOARD_API_KEY`: (legacy) no longer required for dashboard access
- `DASHBOARD_ADMIN_USER`: Admin username for dashboard login
- `DASHBOARD_ADMIN_PASS`: Admin password for dashboard login

## Available routes
- `GET /` – Basic service metadata
- `GET /health` – Health probe with uptime and timestamp
- `POST /api/contact` – Accepts contact form submissions from the frontend
- `POST /api/join` – “Become a Partner” modal submissions
- `POST /api/advisor` – Advisor application form submissions
- `POST /api/newsletter` – Footer email subscriptions
- `POST /api/admin/login` – Admin login, sets 30-minute httpOnly session cookie
- `POST /api/admin/logout` – Clear admin session
- `GET /api/admin/session` – Validate current session and expiry
- `GET /api/dashboard` – Aggregated view of the latest submissions from all forms (requires MongoDB and an active admin session)

### Contact payload
```json
{
  "fullName": "Jane Doe",
  "phoneNumber": "+91 98765 43210",
  "email": "jane@example.com",
  "occupation": "professional",
  "qualification": "graduate",
  "subject": "General Inquiry",
  "message": "I would like to learn more about your programs."
}
```

On success the API responds with HTTP `202` and a message. Validation errors return HTTP `400` with a per-field error map.

### Dashboard payload
`GET /api/dashboard` returns the most recent (up to 100) records from each form:
```json
{
  "counts": {
    "contacts": 1,
    "joinRequests": 1,
    "advisorApplications": 1,
    "newsletterSubscriptions": 2
  },
  "contacts": [{ /* contact submissions */ }],
  "joinRequests": [{ /* join-us modal submissions */ }],
  "advisorApplications": [{ /* advisor applications */ }],
  "newsletterSubscriptions": [{ /* email subscriptions */ }]
}
```
If MongoDB is not configured, the endpoint returns HTTP `503` with a helpful message.

## Project structure
- `src/index.js` – Bootstraps the HTTP server
- `src/app.js` – Express app configuration and middleware
- `src/routes/*` – Route handlers (health check, contact form)
- `src/config/env.js` – Environment variable parsing and defaults

## Next steps
- Wire `POST /api/contact` to persistence (database/CRM) or email service
- Add authentication and role-based routes once requirements are defined
- Add automated tests around validation and routing
