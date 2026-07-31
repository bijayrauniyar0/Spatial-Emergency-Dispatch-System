# Spatial Emergency Dispatch System

## Project Overview

A real-time spatial emergency dispatch platform that connects citizens in need with emergency responders (police, fire, medical) at the nearest stations. The system uses geospatial queries to intelligently route requests to the appropriate station based on zone containment or distance, provides a live dispatch queue for responders, and enables real-time communication between citizens and their assigned responders.

**Core Problem:** Emergency services need a fast, intelligent way to match incoming requests with available responders and track their status in real-time. Citizens need an easy way to report emergencies without friction (no login required), and responders need instant visibility of incoming work at their station.

**Tech Stack:**
- **Frontend:** Next.js 16 (App Router), React 19, Zustand (state), React Hook Form + Zod (forms), TailwindCSS, MapLibre GL (geospatial visualization)
- **Backend:** Express.js, Sequelize ORM, PostgreSQL with PostGIS (geospatial), Redis (pub/sub, unused until Step 3 extension), JWT (httpOnly cookie auth)
- **Deployment:** Docker containerized (frontend + backend + postgres + redis)

---

## Features

### ✅ Completed Features

#### Step 1: Responder Management + Admin Sidebar
- **Admin Dashboard**: `/admin` route with sidebar navigation
- **Responder CRUD**: Create, read, update, delete responder accounts (admin only)
- **Station Management**: Create, list, edit, delete stations with categories (POLICE, FIRE, MEDICAL)
- **Zone Management**: Draw and save service zones tied to stations using PostGIS polygons
- **Admin Protection**: Role-based route guard on `/admin` (only admins can access)

#### Step 2: Citizen Emergency Request Flow
- **Guest User Auto-Provisioning**: Citizens don't need to log in; submitting a request auto-creates a guest account with httpOnly JWT cookie
- **No-Login Resumption**: Page reload preserves the same guest session via JWT cookie (same-browser only)
- **Location Input**: Geolocation API to prefill responder location, then click/drag map to adjust
- **Intelligent Station Resolution**: PostGIS zone containment query, fallback to nearest-station by distance
- **Request Form**: Category selector + location picker in a floating dialog (EmergencyButton)
- **Active Request Tracking**: `GET /incidents/active` returns current pending/responding request for any user

#### Step 3: Responder Dispatch + Global Queue Access
- **Polling Dashboard**: 5-second auto-refresh of station queue + current task
- **Atomic Claim (Double-Claim Prevention)**: `PATCH /incidents/:id/claim` with Postgres row-level locking prevents two responders from claiming the same incident
- **Station Queue**: Responders see pending incidents at their station (category, time only — no citizen info yet)
- **Current Task View**: Shows the responder's claimed incident with responder action buttons (in-progress)
- **Map Radar Visualization**: Pulsing concentric rings on map show all pending incidents at the responder's station in real-time
- **Floating Requests Button**: Global badge-counted button (any page) opens modal with queue or task detail
- **Role-Based Redirect**: Login redirects admin → `/admin`, responder/citizen → `/` (home)
- **Guest Citizen Handling**: Detects guest users and shows "Guest — no contact info" instead of fake email

#### Step 3 Extension (In Planning): Real-Time SSE + Full Lifecycle
- **Incident Lifecycle**: `PENDING → RESPONDING → ARRIVED → RESOLVED` (4 status stages)
- **Responder Task Locking**: Responder with an active task sees ONLY that task (not the queue) until marked resolved
- **SSE Real-Time Notifications**:
  - Citizens instantly notified when their request is claimed/arrived/resolved (no polling delay)
  - Responders instantly notified when a new incident arrives at their station (auto-open modal + highlight)
- **Responder Actions**: Mark task as ARRIVED, then RESOLVED (frees them back to AVAILABLE, re-enables queue visibility)
- **Persistent Polling Fallback**: 5-second polling persists alongside SSE as a safety net (Redis pub/sub has no replay)
- **Map Popup Claim**: Click a radar ring → popup with citizen details + direct Claim button (no modal needed)
- **Redis Pub/Sub**: Controllers publish events (incident created, status changed) → Redis fan-out to SSE subscribers

---

### 🔄 In-Progress / Planned Features

#### Step 3 Extension (Active):
- [ ] Fix `claimIncident` Postgres `FOR UPDATE` bug (lock without includes, re-fetch after)
- [ ] Extend `status` ENUM to include `ARRIVED`
- [ ] Implement `PATCH /:id/arrive` and `PATCH /:id/resolve` responder action endpoints
- [ ] Build SSE service layer on top of Redis pub/sub
- [ ] Add citizen SSE stream (`GET /incidents/stream`) with reactive status updates
- [ ] Add responder SSE stream (`GET /incidents/station-stream`) with auto-modal-open + highlight
- [ ] Implement map popup claim (new `GET /incidents/:id` detail endpoint)
- [ ] Extend frontend stores (dashboardStore, uiStore) with lifecycle actions + highlight state
- [ ] Add arrive/resolve buttons to IncidentDetailView
- [ ] Build CitizenInfoCard component (reused in detail view + map popup)
- [ ] Integrate EventSource hooks on both citizen and responder sides
- [ ] Test SSE reconnect resilience + polling fallback

#### Step 4: Live Location Tracking (Future)
- **Responder Location Broadcast**: Responder's live location streamed to the citizen (WebSocket or frequent SSE updates)
- **Citizen Location Sharing**: Citizen's location shareable with assigned responder
- **ETA Calculation**: A* pathfinding algorithm for optimal route distance calculation and real-time ETA estimation
- **Route Visualization**: Show responder's movement toward the incident on the map using A* computed paths
- **Distance Monitoring**: Real-time distance tracking between responder and incident location using A* heuristic updates

#### Step 5: Completion & History (Future)
- **Incident History**: Past incidents viewable by admins/responders, searchable by date/category/responder
- **Feedback / Rating**: Citizens can rate responders post-completion
- **Analytics Dashboard**: Admin dashboard showing response times, incident distribution, responder performance

---

## Project Structure

```
Spatial-Emergency-Dispatch-System/
├── backend/
│   └── backend/src/
│       ├── config/            # Database, Redis, CORS config
│       ├── controllers/        # Route handlers (responders, incidents, stations, auth)
│       ├── models/            # Sequelize ORM models (User, Responder, Incident, Station, Zone)
│       ├── routes/            # Express routers (mounted in server.ts)
│       ├── middlewares/        # Auth guards (authenticate, isAdmin, isResponder)
│       ├── services/          # Business logic (guest user creation, SSE pub/sub)
│       ├── utils/             # Helpers (JWT, CORS, email)
│       ├── constants/         # Environment-based config
│       └── server.ts          # Express app setup + route mounting
├── frontend/src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── admin/             # Admin dashboard pages (layout + stations/responders)
│   │   ├── responder/         # [DELETED] Dedicated responder page (merged into global UI)
│   │   └── layout.tsx         # Root layout (auth initializer, responder initializer, requests button)
│   ├── features/              # Feature-scoped folders (auth, incident, responder, home, admin)
│   │   ├── auth/              # Login, signup, email verification
│   │   ├── incident/          # Citizen request submission + active incident tracking
│   │   ├── responder/         # Responder dashboard store/hooks/components/SSE
│   │   ├── admin/             # Admin panel (stations, responders, zones)
│   │   └── home/              # Home page + map + station layer + user location
│   ├── components/            # Shared UI components (Navbar, sidebar, primitives)
│   ├── lib/                   # Utilities (auth initializer, responder initializer, API client)
│   ├── store/                 # Global stores (Zustand auth store)
│   └── styles/                # Global CSS (Tailwind)
└── docker-compose.yml         # Multi-container setup
```

---

## Key Technical Decisions

1. **PostGIS for Geospatial**: Zone containment (`ST_Contains`) and distance queries (`ST_Distance`) to intelligently route requests.
2. **Guest User Auto-Provisioning**: No login friction for emergencies; httpOnly JWT cookie for session resumption (same-browser).
3. **Atomic Claim with Row Locking**: Postgres `FOR UPDATE` prevents race conditions where two responders claim the same incident.
4. **SSE over WebSocket**: Simple server→client push (refetch-on-message pattern), avoids bidirectional complexity until Step 4.
5. **Redis Pub/Sub for Fan-Out**: Single controller publish reaches all connected responders at a station; no database polling overhead.
6. **Polling + SSE Fallback**: Not relying on SSE alone (Redis pub/sub has no message replay), so 5-second polling persists as safety net.
7. **Zustand for State**: Lightweight, no boilerplate, good for both auth and responder dashboard state; easy to invoke from SSE handlers.
8. **MapLibre GL (not Mapbox)**: Open-source alternative, avoids paid Mapbox API for tiles + routing.
9. **A* Pathfinding Algorithm**: For Step 4 live location tracking, A* provides optimal route distance calculations for accurate ETA prediction and responder monitoring. Enables efficient pathfinding on road networks without relying on expensive external routing APIs.

---

## Deployment & Environment

**Environment Variables:**
- `DATABASE_URL`: PostgreSQL connection string (Postgres 12+ with PostGIS extension)
- `REDIS_URL`: Redis connection string (used for pub/sub in Step 3 extension)
- `NODE_ENV`: development | production
- `CORS_ORIGIN`: JSON array of allowed origins (e.g., `["http://localhost:3000"]`)
- `JWT_SECRET`: Secret key for signing tokens
- `NEXT_PUBLIC_API_URL`: Frontend's backend API URL (e.g., `http://localhost:9000/api/v1`)

**Database Setup:**
```bash
# Install PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

# Run migrations (Sequelize ORM will handle table creation on first run)
npm run migrate
```

**Docker Compose:**
```yaml
services:
  postgres:
    image: postgis/postgis:15-3.3
    environment:
      POSTGRES_DB: dispatch
      POSTGRES_PASSWORD: postgres
  redis:
    image: redis:7-alpine
  backend:
    # Node.js server on :9000
  frontend:
    # Next.js dev server on :3000
```

---

## Testing Checklist for Step 3 Extension

- [ ] **Claim Bug Fix**: Submit incident, claim as responder → `200` (not Postgres error)
- [ ] **Task Locking**: Claim while already on a task → `409` (responder busy)
- [ ] **Lifecycle**: Claim → arrive → resolve → responder back to AVAILABLE
- [ ] **SSE Responder**: New incident → modal auto-opens, latest row highlighted, fades after 5s
- [ ] **SSE Citizen**: Submit request, claim it → citizen's dialog updates "on the way" within 1s
- [ ] **Reconnect Safety**: Kill backend during SSE → restore → status caught up via refetch (not stuck)
- [ ] **Map Popup**: Click radar ring → details + claim button → claim succeeds
- [ ] **Polling Fallback**: Disable SSE endpoint → polling still catches up within 5s
- [ ] **Redis Cleanup**: Open/close SSE connections → no duplicate Redis clients (check `CLIENT LIST`)

---

## Next Steps

1. **Implement Step 3 Extension** (currently planned):
   - Fix claim bug + lifecycle endpoints
   - Integrate Redis pub/sub SSE
   - Map popup claim
   - Frontend SSE hooks + action buttons
   - Test reconnect resilience

2. **Step 4 (Live Location)**: Stream responder's GPS to citizen in real-time
3. **Step 5 (History & Analytics)**: Incident records, feedback, admin dashboards
4. **Polish**: Performance tuning, error handling, UI refinements, documentation

---

## Contact & Feedback

- **Author**: Bijay Rauniyar (bijay.naxa@gmail.com)
- **Repository**: [Spatial-Emergency-Dispatch-System](https://github.com/yourusername/Spatial-Emergency-Dispatch-System)
- **Issues & Feedback**: GitHub Issues or discussions

---

**Last Updated**: 2026-07-30  
**Status**: Step 3 Extension in development; Steps 1-2 complete
