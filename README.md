<div align="center">

# 🎟️ Ticketa

**A modern, role‑aware event management & ticketing platform** featuring secure OAuth2/JWT auth, QR‑code ticketing, granular role capabilities, and a clean React front-end.

---

| Layer | Stack |
|-------|-------|
| Frontend | React 19, Vite 7, Tailwind CSS 4, Radix UI, MUI (date pickers), React Router 7 |
| Backend | Spring Boot 3.5, Spring Security Resource Server (JWT), Spring Authorization Server, Spring Data JPA |
| Infra | PostgreSQL, Docker (Keycloak dev), H2 (tests), Maven |
| Tooling | MapStruct, Lombok, ZXing (QR), ESLint, Date‑Fns / Day.js |

</div>

## 📌 Why Ticketa?
Event management typically fragments across tools: publishing, ticket sales, validation, and staffing. Ticketa unifies these into a single extensible platform with:
* Secure per‑role flows (Organizer / Attendee / Staff)
* Publisher → Discovery → Purchase → QR issuance → Validation lifecycle
* Immutable validation records and audit trail
* Clean separation of domains (Events, Ticket Types, Tickets, Validations, Users)

## 🚀 Core Features
### Organizer
* Create / update / publish / retire events (CRUD lifecycle)
* Define ticket types & sales windows
* Paginated dashboard of owned events (`/events/list-all`)

### Attendee
* Browse & search published events (`/published-events?query=`)
* Purchase ticket (POST to `/events/{eventId}/ticket-types/{ticketTypeId}/tickets`)
* View ticket collection & individual QR (`/tickets/{ticketId}/qr-code`)

### Staff
* Validate tickets by scanning QR (client scanner + backend decode)
* Manual validation fallback (`/ticket-validations` with method=MANUAL)
* Get deterministic pass/fail + validation record id

### Cross‑Cutting
* JWT-based identity → subject UUID maps to `User` entity
* CORS locked to `http://localhost:5173`
* Consistent DTO mapping via MapStruct
* Defensive validation (Jakarta Validation annotations on DTOs)
* QR codes generated server-side with ZXing (PNG bytes endpoint)

## 🧱 Domain Model (Simplified)
```
User (id, username, email)
 ├─ organizedEvents [1..*]
 ├─ attendingEvents [*..*]
 ├─ staffingEvents  [*..*]
 └─ tickets [1..*]

Event (status=PUBLISHED|DRAFT|...) ──< TicketType ──< Ticket ──< TicketValidation
                                  └─< Ticket (via TicketType)

Ticket ──< TicketQRCode (versioned QR payloads, regeneration allowed)
```

## 🗺️ High-Level Architecture
```
 ┌────────────┐        HTTPS         ┌────────────────────────┐
 │  React UI  │  ─────────────────▶  │ Spring Boot API Layer  │
 │ (Vite Dev) │   JSON / PNG        │  - Controllers          │
 └─────┬──────┘                      │  - Services            │
       │  OIDC Redirect / JWT       │  - MapStruct Mappers   │
       ▼                            │  - JPA (PostgreSQL)    │
 ┌────────────┐  Introspection       └─────────┬─────────────┘
 │ Keycloak / │  issuer-uri                   │
 │ Auth Server│◀──────────────────────────────┘
 └────────────┘      (Validation)             │
                                              ▼
                                       PostgreSQL DB
```

## 🔐 Authentication & Authorization
Spring Security resource server validates JWTs from `issuer-uri=http://localhost:9090/realms/Ticketa`.
Roles embedded in token (realm roles) use `ROLE_` prefix front-end filter (`useRoles.jsx`).

Expected realm roles:
* `ROLE_ORGANIZER`
* `ROLE_ATTENDEE`
* `ROLE_STAFF`

JWT subject (`sub`) must be a UUID → persisted as `User.id` on first interaction (lazy creation pattern implied—extend if needed).

## 🌐 API Surface (Representative Endpoints)
| Purpose | Method | Path | Notes |
|---------|--------|------|-------|
| Create event | POST | `/events/create` | Organizer only |
| List organizer events | GET | `/events/list-all` | Pageable |
| Get organizer event | GET | `/events/{eventId}` | 404 if not owned |
| Update event | PUT | `/events/update/{eventId}` | Ownership enforced |
| Delete event | DELETE | `/events/delete/{eventId}` | No body |
| Search published | GET | `/published-events?query=q` | Public listing |
| Published details | GET | `/published-events/{eventId}` | 404 handling |
| Purchase ticket | POST | `/events/{eventId}/ticket-types/{ticketTypeId}/tickets` | Attendee |
| List user tickets | GET | `/tickets` | Pageable |
| Ticket detail | GET | `/tickets/{ticketId}` | 404 if not owned |
| Ticket QR | GET | `/tickets/{ticketId}/qr-code` | PNG bytes |
| Validate ticket | POST | `/ticket-validations` | Body selects method |

Example validation request:
```jsonc
// POST /ticket-validations
{
  "id": "<ticket-or-qr-id>",
  "method": "QR_CODE"   // or MANUAL
}
```

## 📂 Actual Project Layout
```
Ticketa/
├─ Ticketa-Backened/
│  ├─ docker-compose.yml        # Keycloak dev service
│  ├─ src/main/java/org/example/ticketabackened/
│  │  ├─ controllers/*.java     # REST endpoints
│  │  ├─ domain/entity/*.java   # JPA entities
│  │  ├─ domain/dto/*.java      # Transport DTOs
│  │  ├─ mappers/*.java         # MapStruct mappers
│  │  ├─ service/*.java         # Business logic
│  │  ├─ filters/               # (Potential security filters)
│  │  └─ exceptionHandler/      # Centralized error handling (extend)
│  ├─ src/main/resources/
│  │  └─ application.properties # Env & DB
│  └─ pom.xml
│
└─ Ticketa-Frontend/
   ├─ src/
   │  ├─ pages/                 # Route screens
   │  ├─ components/            # Reusable UI
   │  ├─ roles/useRoles.jsx     # Role extraction hook
   │  ├─ lib/api.js             # Axios abstraction
   │  └─ domain/                # Domain helpers
   ├─ public/
   └─ package.json
```

## ⚙️ Local Development
### Prerequisites
* Java 21 (JDK)
* Node.js 18+ (for React 19 compatibility)
* Maven Wrapper (included)
* Docker (for running Keycloak) & PostgreSQL running locally

### 1. Clone
```bash
git clone https://github.com/LakshayJain458/Ticketa.git
cd Ticketa
```

### 2. Start Auth (Keycloak Dev)
Create `Ticketa-Backened/.env`:
```env
KEYCLOAK_ADMIN=yourusername
KEYCLOAK_ADMIN_PASSWORD=yourpassword
```
Then from backend folder:
```bash
docker compose up -d
```
Access Keycloak UI: http://localhost:9090

Realm setup (manual first time):
1. Create Realm: Ticketa
2. Create Roles: ROLE_ORGANIZER, ROLE_ATTENDEE, ROLE_STAFF
3. Create Client: ticketa-frontend (public) with redirect http://localhost:5173/*
4. Add test users and assign realm roles

### 3. Configure Environment
Set PostgreSQL env vars (PowerShell example):
```powershell
$env:DB_USER="postgres"; $env:DB_PASS="yourpassword"
```
Or create a local `.ps1` you dot‑source.

### 4. Run Backend
```powershell
cd Ticketa-Backened
./mvnw spring-boot:run
```
Backend: http://localhost:8080

### 5. Run Frontend
```powershell
cd Ticketa-Frontend
npm install
npm run dev
```
Frontend: http://localhost:5173

### 6. Sample Flow
1. Organizer logs in → creates event
2. Organizer adds ticket types (extend API if not yet exposed)
3. Attendee browses published events → purchases ticket
4. Ticket QR retrieved & displayed
5. Staff scans QR → validation recorded

## 🌱 Environment Variables Summary
| Variable | Scope | Purpose |
|----------|-------|---------|
| DB_USER, DB_PASS | Backend | PostgreSQL credentials |
| KEYCLOAK_ADMIN / KEYCLOAK_ADMIN_PASSWORD | Docker Keycloak | Bootstrap admin user |
| (Frontend OIDC config) | Frontend | Configure with realm, client id ticketa-frontend |

> Consider adding a centralized `.env.example` for both layers.

## 🧩 Extensibility Ideas
* Rate limiting on validation endpoint
* Soft delete & archival for events
* Ticket resale / transfer workflow
* Analytics dashboard (tickets sold per hour)
* WebSocket push for real-time validation feedback
* Multi-tenancy (realm-per-organization) strategy

## 🗺️ Roadmap
| Milestone | Status |
|-----------|--------|
| Core CRUD & ticket purchase | ✅
| QR generation & validation | ✅
| Search published events | ✅
| Dockerizing full stack (API + DB + Keycloak + Frontend) | ⏳
| Test coverage >70% | ⏳

## 🤝 Contributing
1. Fork & branch: `feat/<short-description>`
2. Write tests for new logic
3. Run lint + build both layers
4. Open PR with concise description & screenshots for UI changes

Conventional Commit format encouraged (e.g., `feat: add ticket transfer endpoint`).

## 📜 License
MIT © 2025 Lakshay Jain

---
If this repo helps you, consider ⭐ starring it and opening an issue with feedback!

Happy building!

