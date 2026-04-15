# Backend Optimization — AI Agent Brief

> Hand this document to an AI coding assistant (Copilot, Cursor, etc.) when working on the **personality-collection-api** backend.

---

## Project Context

This is the **Node.js / Express** backend for a YouTube creator personality survey platform.  
The frontend sends survey answers one-by-one, and after the survey is completed the backend calls an AI model (OpenAI / LLM) to generate a personalised growth recommendation.

### Core Domain Flow

```
Invitation Email (with logo + link)
  └─► Logo upload path triggers survey instance creation
        └─► Link contains: youtuber email + YouTube channel URL
              └─► Frontend opens → POST /api/survey  (creates survey doc)
                    └─► Each answer → PATCH /api/survey/:id  (appended)
                          └─► Survey complete → PATCH  (isSurveyCompleted: true)
                                └─► Channel confirm → PATCH (isChannelLinkConfirmed: true)
                                      └─► GET /api/survey/result/:id
                                            └─► AI recommendation generated & returned
```

### API Endpoints (consumed by frontend)

| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/get-questionnaire` | Return ordered list of survey questions |
| POST | `/api/survey` | Create new survey instance `{ email, link }` |
| PATCH | `/api/survey/:id` | Save individual answer / mark completed / confirm channel |
| GET | `/api/survey/result/:id` | Fetch AI-generated personality report |
| POST | `/api/survey/share-email/:id` | Share survey link with another creator |

---
