# Personality Collection — Portfolio Description

## Project Overview

**Personality Collection** is a full-stack web platform that assesses YouTube creators' personality types through a structured survey and delivers AI-generated, personalised growth recommendations. The platform is designed as a B2B tool for agencies or networks that manage YouTuber talent.

---

## Business Logic

1. **Invitation Flow** — A YouTuber receives a branded email containing a unique survey link with their email and YouTube channel URL encoded as query parameters.
2. **Survey Instance Creation** — When the logo in the email is loaded (image tracking pixel), the system initialises a new survey record on the backend.
3. **Personality Assessment** — The survey consists of questions based on the Big 5 Personality Model. Each answer is saved individually to the server as the user progresses, enabling resume-from-where-you-left-off functionality.
4. **Engagement Mechanics** — Motivational "meme breaks" appear every 5 questions with progress-based encouragement messages and images to reduce drop-off.
5. **Channel Verification** — After completing the survey, the YouTuber must confirm ownership of their YouTube channel via a modal with URL validation.
6. **AI-Powered Results** — The backend feeds the collected answers into an LLM (Groq Cloud — Llama 3.3 70B) that generates a multi-section personality report: creator type, superpower, weakness, growth tip, personality summary, and growth strategy.
7. **Viral Sharing** — Users can share the survey with other creators via email directly from the result page.

---

## Architecture & Patterns

### Frontend

| Concern | Tool / Pattern |
|---------|----------------|
| **UI Framework** | React 18 with functional components and hooks |
| **Routing** | React Router v6 — 4 routes (Home, Survey, Result, Sample Result) |
| **Server State** | TanStack React Query — caching, background refetch, query keys |
| **Client State** | Redux Toolkit — single slice for global loading spinner |
| **HTTP Layer** | Axios with global interceptors (auth headers, loader toggle, error modals) |
| **Styling** | Tailwind CSS + Ant Design — utility-first layout with AntD modals, inputs, checkboxes |
| **Responsive Design** | Custom Tailwind breakpoints: `mobile`, `tablet`, `desktop` |
| **Theme Support** | Dark/light mode via Tailwind `dark:` variant + `localStorage` persistence |
| **State Persistence** | `localStorage` for surveyId and theme — allows survey resume across sessions |

### Backend

| Concern | Tool / Pattern |
|---------|----------------|
| **Runtime** | Node.js 18+ with ES Modules, Express.js |
| **Database** | MongoDB with Mongoose ODM — schemas with custom validators |
| **AI Integration** | Groq Cloud API (Llama 3.3 70B) — structured prompt → JSON personality report |
| **Email Service** | AWS SES via Nodemailer — EJS templates, DOMPurify HTML sanitisation |
| **Error Handling** | Custom error class hierarchy (`HRCustomError` → `ValidationError`, `AiError`, etc.) with centralized Express error middleware, auto-logging to MongoDB, and email alerts for critical errors |
| **Request Logging** | Every request logged to MongoDB (IP, browser, OS, duration) via middleware — browser fingerprinting with `express-fingerprint` |
| **Rate Limiting** | IP-based rate limiting via `express-rate-limit` (1000 req/hr) |
| **Security** | Input payload sanitisation, CORS, JSON body size limit (1 MB), malformed-request interception |
| **Testing** | Jest with `mongodb-memory-server` (in-memory replica set), Supertest for route integration tests |
| **Email Tracking** | Image pixel in invitation email triggers survey creation on load |

### Key Design Decisions

- **Individual Answer Saving** — Each survey response is PATCHed to the server independently rather than batched. This ensures no data is lost if the user closes the browser, and allows resume support.
- **React Query over Redux for Server State** — Survey data, questionnaire, and results are managed by React Query (cache + refetch), while Redux is intentionally minimal (loader only).
- **Interceptor Pattern** — A single `InterceptorsComponent` wraps the app tree, setting up Axios interceptors once and rendering a global `<Spin>` overlay for all in-flight requests.
- **Sample Result Route** — A `/resultSample` route shows a static demo of the results page, useful for marketing and onboarding without requiring a completed survey.
- **Error Class Hierarchy** — A base `HRCustomError` class provides `getLoggerObject()` and `convertToResponse()` methods. Subclasses (`ValidationError`, `DatabaseError`, `AiError`, `AwsError`, etc.) carry domain-specific status codes and are handled uniformly by the centralized error middleware.
- **Cached AI Results** — The personality report is generated once and stored in the survey document. Subsequent requests return the cached result, avoiding redundant LLM calls.
- **Email Tracking Pixel** — The invitation email embeds a logo image whose URL contains the creator's email and channel link. When the email client loads the image, the backend creates the survey record — no user interaction required.
- **In-Memory MongoDB for Tests** — `mongodb-memory-server` spins up a disposable replica set per test run, enabling integration tests without an external database dependency.

---

## Tech Stack Summary

**Frontend:** React 18 · React Router 6 · Redux Toolkit · TanStack React Query · Axios · Tailwind CSS · Ant Design  
**Backend:** Node.js 18+ · Express · MongoDB · Mongoose · Groq Cloud (Llama 3.3) · AWS SES · Nodemailer · EJS · DOMPurify · Jest  
**Infrastructure:** Create React App · REST API · LocalStorage-based session continuity
