# Spatial Emergency Dispatch System - Project Overview

## Project Description

A geospatial emergency dispatch system where:
- **Citizens** raise emergency requests (pick category: Police/Fire/Medical, provide location)
- **Admin** manages stations (create with geographic zones) and responders
- **Responders** receive emergency tasks assigned from their station and connect with citizens in real-time
- The system calculates nearest responding station via zone lookup and dispatches the task to an available responder

**Tech Stack:**
- Backend: Node.js + TypeScript + Express + Sequelize ORM + PostgreSQL + PostGIS
- Frontend: Next.js 15 + React + TypeScript + Tailwind CSS + Zustand (state) + React Hook Form + Zod (validation)
- Database: PostgreSQL with PostGIS extension for geospatial queries
- Real-time: Redis connected but not yet used (planned for WebSocket pub-sub)

---

## Current Status: Step 1 - Admin Sidebar + Responder Management

### ✅ Completed

#### Backend
1. **Responder Controllers** (`src/controllers/responderControllers.ts`)
   - `createResponder` — admin creates responder with name, email, password, phone, station; account created as verified=true immediately
   - `getResponders` — list all responders with joined station info (flattened response)
   - `updateResponder` — PATCH endpoint to reassign station or change status (AVAILABLE/BUSY/OFF_DUTY)
   - `deleteResponder` — remove responder (user account left intact for audit trail)

2. **Responder Routes** (`src/routes/adminRoutes.ts`)
   - `GET /api/v1/admin/responders` — list (authenticated, admin-only)
   - `POST /api/v1/admin/responders` — create (authenticated, admin-only)
   - `PATCH /api/v1/admin/responders/:id` — update (authenticated, admin-only)
   - `DELETE /api/v1/admin/responders/:id` — delete (authenticated, admin-only)

3. **Models** (already existed, now wired)
   - `User` — role field supports 'admin'|'responder'|'citizen', verified flag
   - `Responder` — links user to station with status (AVAILABLE|BUSY|OFF_DUTY)
   - `Station` — PostGIS Point location, category (POLICE|FIRE|MEDICAL)
   - `Zone` — PostGIS Polygon boundary for station service area

#### Frontend
1. **Responder Feature Slice** (`src/features/admin/responders/`)
   - **types.ts** — Responder, CreateResponderInput, UpdateResponderInput, ResponderStatus, ResponderStoreState
   - **services/client.ts** — thin API client (axios wrapper) for CRUD operations
   - **store/responderStore.ts** — Zustand store with fetchResponders, addResponder, editResponder, removeResponder
   - **validations/responderSchema.ts** — zod schemas for create (with password validation) and edit (station/status only)
   - **hooks/useResponders.ts** — mounts store.fetchResponders on load, returns responders + actions
   - **components/ResponderForm.tsx** — single form for create/edit modes using react-hook-form + Dropdown for stations/status
   - **components/ResponderList.tsx** — table with name/email/phone/station/status columns, inline Edit/Delete actions
   - **pages/RespondersPage.tsx** — main page wrapping form (dialog) and list

2. **Admin Sidebar** (`src/features/admin/components/AdminSidebar.tsx`)
   - Uses shadcn sidebar primitives (Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton)
   - Two nav items: "Stations" → `/admin`, "Responders" → `/admin/responders`
   - Active route highlighted via `usePathname()`

3. **Admin Layout** (`src/app/admin/layout.tsx`)
   - Wraps `/admin` and `/admin/responders` routes with SidebarProvider + AdminSidebar + SidebarInset
   - Stations page (existing AdminPage) and new Responders page render as children

4. **Responders Route** (`src/app/admin/responders/page.tsx`)
   - Renders RespondersPage

### Architecture & Patterns

**Backend:**
- Controllers handle validation, business logic, error responses (400/404/409/500)
- Atomic transactions for multi-entity creates (User + Responder)
- Password hashing with bcrypt (10 rounds)
- Same auth pattern as stations: `authenticate` middleware + `isAdmin` guard

**Frontend:**
- Feature-folder pattern: `features/admin/responders/` with layers: types → services → store → hooks → components → pages
- Reuses `useAdminStore` (station list) in ResponderForm to avoid duplicate fetches; triggers `fetchStations()` if needed
- Form validation: zod schema + react-hook-form + zodResolver
- State: Zustand (not react-query, matching admin/station pattern)
- UI: shadcn primitives + custom layouts (Flex, Grid, Container from `components/ui/layouts.tsx`)
- Dropdown component used for selects (not raw shadcn Select)

---

## Remaining Implementation Roadmap

### Step 2: Citizen Emergency Request Flow
**Goal:** Citizens can request emergency help, system finds nearest station.

**Tasks:**
1. Create `Emergency` page at `/emergency` (or `/citizen/emergency`)
   - Input: category (Police/Fire/Medical), current location (map picker or auto from geolocation)
   - UI: simple form/dialog or full page, reuses MapSelector for location
2. Backend: `POST /api/v1/incidents` endpoint
   - Body: `{ citizen_id, category, latitude, longitude }`
   - Logic: use PostGIS `ST_Contains` to find which zone/station contains the incident location
   - Return: incident created with status=PENDING, no responder assigned yet
3. Response to citizen: show "Request submitted, finding nearest responder..."

**Files to create:**
- Frontend: `features/citizen/pages/EmergencyPage.tsx`, `features/citizen/services/client.ts`, `features/citizen/store/emergencyStore.ts`, etc. (same layered pattern)
- Backend: flesh out `POST /incidents` route in a new `incidentRoutes.ts`

---

### Step 3: Dispatch & Task Assignment
**Goal:** Nearest station's responder receives the incident and can see task details.

**Tasks:**
1. Backend: Implement assignment logic
   - `POST /api/v1/incidents/:id/assign` — admin/system endpoint that:
     - Takes incident from PENDING state
     - Finds available responders at the assigned station
     - If available, assigns one (responder.status = BUSY, incident.responder_id = responder.id, incident.status = RESPONDING)
     - If none available, queue incident for manual assignment or retry
   - `GET /api/v1/responders/me/tasks` — responder fetches their current + queued tasks
   - `PATCH /api/v1/incidents/:id/claim` — responder claims a task (optional if not auto-assigned)

2. Frontend: Responder dashboard
   - New page at `/responder/dashboard` showing:
     - Current task (if any) with incident category, citizen location, route from station → incident
     - Task status buttons: "On the way" → "Arrived" → "Resolved"
   - Similar sidebar/layout pattern as admin

3. A* Pathfinding (backend)
   - Not yet implemented anywhere
   - Will need: road-network graph data (could use OSRM / Mapbox Directions API, or pre-bake A* on road segments in PostGIS)
   - For now, placeholder: straight-line distance (haversine) from station to incident location
   - Future: integrate real routing service for ETA and directions

**Files to create:**
- Backend: `controllers/incidentControllers.ts`, `routes/incidentRoutes.ts`, `utils/pathfinding.ts` (A* stub)
- Frontend: `features/responder/pages/DashboardPage.tsx`, `features/responder/store/taskStore.ts`, etc.

---

### Step 4: Live Connection (Responder ↔ Citizen)
**Goal:** Citizen tracks responder's live location; responder knows citizen is waiting.

**Tasks:**
1. Backend: WebSocket + Redis pub-sub setup (Redis already connected, unused)
   - Implement Socket.io or Node.js `ws` library on Express
   - Pub-sub channels: `incident:{incident_id}:updates` (location, status changes)
   - When responder's location updates, publish to incident's channel
   - When incident status changes (e.g., arrived, resolved), notify citizen

2. Frontend: Live map
   - Citizen sees responder's location on a map in real-time
   - Responder sees citizen's location + current route
   - Fallback: polling every 5-10 seconds if WebSocket unavailable

3. Polling interim solution (simpler, no infra changes)
   - Citizen: `GET /api/v1/incidents/:id` every 5s to fetch responder's last-known location
   - Responder app periodically sends location: `POST /api/v1/responders/me/location` with lat/lng
   - Not ideal (battery drain, latency) but MVP-viable

**Files to create:**
- Backend: `utils/websocket.ts`, channels setup, listeners in controller actions
- Frontend: react hook for WebSocket (or polling) subscription, map component to display responder location

---

### Step 5: Completion & History
**Goal:** Responder marks task complete, incident logged for audit.

**Tasks:**
1. Backend: completion endpoints
   - `PATCH /api/v1/incidents/:id/resolve` — responder marks as resolved, records timestamp
   - `GET /api/v1/incidents?filter=resolved` — admin/citizen can view incident history
   - DB: add `resolved_at`, `duration` fields to Incident model

2. Frontend: incident history
   - Admin: new "Incidents" page listing all past emergencies with duration, responder, station
   - Citizen: past requests history in their account page

---

## How to Continue

1. **Test Step 1** (current work):
   - Start backend: `cd backend/backend && npm run dev`
   - Start frontend: `cd frontend && npm run dev`
   - Login as admin (use existing auth flow or hardcode a test admin in DB seed)
   - Navigate to `/admin/responders`
   - Create a responder (pick a station created in prior work)
   - Edit responder (change station or status)
   - Delete responder
   - Verify backend logs show 200/201/204 responses and DB rows created/updated/deleted

2. **Commit & review** Step 1:
   - All changes on main branch (or feature branch, then PR)
   - Backend controller + routes
   - Frontend responder feature slice + sidebar + layout
   - Verify no TypeScript errors: `cd frontend && npx tsc --noEmit`

3. **Move to Step 2**:
   - After Step 1 is stable and tested, repeat the planning + implementation cycle for Citizen Emergency Request Flow
   - Reuse the patterns (feature-folder, Zustand store, same validation/form structure)

---

## Key Files Reference

### Backend
- **Models:** `backend/src/models/userModels.ts`, `responderModels.ts`, `stationModels.ts`, `zoneModels.ts`, `incidentModel.ts`
- **Controllers:** `backend/src/controllers/authControllers.ts`, `adminControllers.ts`, `responderControllers.ts` (new)
- **Routes:** `backend/src/routes/authRoutes.ts`, `adminRoutes.ts` (updated)
- **Auth:** `backend/src/middlewares/authenticate/index.ts` (isAdmin guard, authenticate)
- **Config:** `backend/src/config/database.ts` (Sequelize + PostgreSQL)

### Frontend
- **Admin Feature:** `frontend/src/features/admin/` (stations, responders)
  - AdminPage, StationList, AddStationForm, AdminSidebar
  - responders/ (new) — responder CRUD
- **App Routes:** `frontend/src/app/admin/` (page.tsx, layout.tsx, responders/page.tsx)
- **Primitives:** `frontend/src/components/primitives/` (shadcn UI components: button, form, table, dialog, sidebar, etc.)
- **UI Utils:** `frontend/src/components/ui/` (layouts: Flex, Grid, Container; dropdown custom)
- **Store:** Zustand stores in feature folders (useAdminStore, useResponderStore)
- **API Client:** `frontend/src/lib/api-client/client.ts` (axios baseURL, interceptors)
- **Validations:** `frontend/src/validations/index.ts` (shared email, password schemas)

---

## Environment & Setup

### Backend
- **Port:** 3001 (from code)
- **Env vars:** `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`, `GOOGLE_CLIENT_ID`, etc. (in `.env`)
- **Commands:**
  - `npm run dev` — start dev server with hot-reload
  - `npm run build` — compile TypeScript
  - `npm start` — run compiled JS

### Frontend
- **Port:** 3000 (default Next.js)
- **Env vars:** `NEXT_PUBLIC_API_URL` (points to backend baseURL)
- **Commands:**
  - `npm run dev` — start dev server
  - `npm run build` — build for production
  - `npm run lint` — ESLint check

### Database
- PostgreSQL with PostGIS extension
- Models auto-sync (Sequelize `sequelize.sync()`) on server start
- Seed: Check if stations exist; if not, create demo stations for testing

---

## Notes & Caveats

1. **No middleware.ts for route protection (frontend)** — Currently, `/admin` routes are not protected at the Next.js middleware level. Client-side checks via `useAuth()` should be added (verify role before rendering admin pages). Future: add `middleware.ts` to enforce auth at the routing layer.

2. **Responder deletion** — Deletes the `Responder` record but leaves the underlying `User` record intact (verified=true, role=responder). This preserves audit history. If a responder's account should also be deleted, that's a separate admin action requiring confirmation (to prevent accidents).

3. **A* not implemented** — Responder location tracking and route calculation are placeholders for now. Step 3 will need to integrate a routing service (OSRM, Mapbox, or similar) or implement graph-based pathfinding on the road network.

4. **WebSocket/Redis not yet used** — Backend has Redis connected but no active pub-sub. Step 4 will wire this up for real-time updates. Until then, polling is the fallback.

5. **Email notifications** — Responder creation does NOT send an email (admin sets password directly). Future: add email invite with temp password or direct account details.

6. **Form validation reuse** — `emailSchema` and `createPasswordValidation` are in `frontend/src/validations/index.ts` and reused by auth and responder forms. Keep these in sync.

---

## Common Development Tasks

### Run backend + frontend locally
```bash
# Terminal 1
cd backend/backend
npm run dev

# Terminal 2
cd frontend
npm run dev

# Access: http://localhost:3000 (frontend), http://localhost:3001 (backend)
```

### Test responder endpoints with curl
```bash
# Login as admin first to get token (in cookie)
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"..."}' \
  -c cookies.txt

# Create responder
curl -X POST http://localhost:3001/api/v1/admin/responders \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Test@1234",
    "number": "9841234567",
    "station_id": 1
  }'

# List responders
curl http://localhost:3001/api/v1/admin/responders -b cookies.txt

# Update responder
curl -X PATCH http://localhost:3001/api/v1/admin/responders/1 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"status":"BUSY"}'

# Delete responder
curl -X DELETE http://localhost:3001/api/v1/admin/responders/1 -b cookies.txt
```

### TypeScript type checking
```bash
cd frontend && npx tsc --noEmit
```

### Lint frontend
```bash
cd frontend && npm run lint
```

---

## Support & Questions

- **Schema conflicts:** If you add new fields to models, update types.ts + API client response shapes
- **Form validation fails:** Check zod schema in `validations/responderSchema.ts` — make sure backend response shape matches frontend type expectations
- **Sidebar not showing:** Verify `SidebarProvider` wraps the layout and `useSidebar` hook is imported from primitives
- **API 401/403:** Check JWT in cookies, verify user role in backend middleware (isAdmin guard), ensure auth cookie is sent with requests

---

**Last Updated:** Step 1 implementation complete (2026-07-29)  
**Next Milestone:** Test Step 1, then plan Step 2 (Citizen Emergency Request)
