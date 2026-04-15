# Personality Collection API

Backend REST API for a YouTube creator personality survey platform.  
Creators receive an invitation email, complete a Big 5-based personality survey, and get an AI-generated growth report.

## Core Flow

1. **Invitation email** is sent with a tracking pixel (logo image) that pre-creates a survey record when opened.
2. **Frontend** creates/resumes the survey via `POST /api/survey` — each answer is saved individually via `PATCH`.
3. **After completion**, the creator confirms their YouTube channel link.
4. **AI report** is generated on first request to `GET /api/survey/result/:id` using Groq Cloud (Llama 3.3 70B), then cached.

## API Endpoints

| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/get-questionnaire` | Returns the ordered list of survey questions |
| POST | `/api/survey` | Creates or retrieves an existing survey `{ email, link }` |
| PATCH | `/api/survey/:id` | Saves an answer / marks completed / confirms channel |
| GET | `/api/survey/:id` | Returns current survey progress |
| GET | `/api/survey/result/:id` | Returns the AI-generated personality report |
| POST | `/api/survey/share-email/:id` | Saves a "share with a friend" email |
| GET | `/system/health-check` | Health check |

## Tech Stack

- **Runtime:** Node.js 18+ (ES Modules)
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **AI:** Groq Cloud API (Llama 3.3 70B)
- **Email:** AWS SES + Nodemailer + EJS templates
- **Security:** DOMPurify, CORS, rate limiting, payload size limits
- **Testing:** Jest + mongodb-memory-server + Supertest

## Getting Started

### Prerequisites

- Node.js ≥ 18.16
- MongoDB (local or remote) — not required for tests (uses in-memory DB)

### 1. Install dependencies

```bash
cd server
npm install
```

### 2. Create environment file

Create a `.env` file in the **project root** (one level above `server/`):

```env
NODE_ENV=development
SERVER_PORT=9718

# MongoDB (set IS_LOCAL_MONGO_DB=true for local, or provide Atlas credentials)
IS_LOCAL_MONGO_DB=true
# MONGO_DB_USER_NAME=
# MONGO_DB_SECRET_KEY=
# MONGO_DB_NAME=

# Groq Cloud API key (https://console.groq.com)
GROQ_API_KEY=your_groq_api_key

# AWS SES (for sending emails)
AWS_REGION=eu-central-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
```

### 3. Run the server

```bash
# Development (with auto-reload)
npm run nodemon

# Production
npm start
```

The server starts on `http://localhost:9718` by default.

### 4. Run tests

```bash
npm test
```

Tests use an in-memory MongoDB replica set — no external database required.

## Project Structure

```
server/
├── app.js                          # Express app setup & middleware chain
├── api/
│   ├── config.js                   # App-wide configuration constants
│   ├── assets/
│   │   └── Questions-for-survey.js # Big 5 personality questionnaire
│   ├── middlewares/
│   │   └── appMiddlewares/         # Error handling, rate limiting, logging
│   ├── model/
│   │   ├── connectionHandler.js    # MongoDB connection (+ in-memory for tests)
│   │   └── schemas/                # Mongoose schemas (surveys, errors, etc.)
│   ├── routes/
│   │   └── unprotected/            # Survey, image, email, health-check routes
│   └── services/
│       ├── utils.js                # JSON extraction from LLM responses
│       ├── routeServices/          # Business logic (survey CRUD, AI report)
│       └── innerServices/          # Groq client, email service, error classes
└── __tests__/                      # Jest unit & integration tests
```
