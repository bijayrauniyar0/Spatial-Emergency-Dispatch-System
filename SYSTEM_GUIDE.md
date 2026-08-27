# Spatial Emergency Dispatch System — User & Technical Guide

## Overview

The Spatial Emergency Dispatch System is a real-time platform that connects citizens in emergency situations with the nearest available emergency responders (police, fire, medical). The system intelligently routes requests based on location, provides live tracking of responder movements, and keeps citizens informed in real-time.

---

## Actor Perspectives & Workflows

### 1. **Citizen** (Guest User — No Login Required)

#### How They Use the System

**Submitting an Emergency Request:**
1. Open the app (no login needed — guest account auto-created)
2. Click the red "Alert" button (emergency call button)
3. Select emergency type: POLICE, FIRE, or MEDICAL
4. Confirm location (auto-filled via geolocation, can be adjusted by dragging on the map)
5. Submit — instantly paired with the nearest responder station

**Tracking Response:**
- See status update in real-time: "Request submitted" → "Responder assigned" → "On the way" → "Arrived" → "Completed"
- **Distance & ETA**: Once responder is assigned, see live distance to incident and estimated arrival time (updates every 4 seconds)
- **Responder Details**: See assigned responder's name and phone number
- **Optional Live Location Sharing** (toggle in UI): Share real-time location with responder so they can find you more easily (off by default for privacy)
- **Live Responder Marker**: See responder's real-time location on map as they move toward you, with a route line showing their path

#### Under the Hood
- **Guest User Creation**: First request triggers `createGuestUser` which generates an httpOnly JWT cookie — same browser can resume session without re-login
- **Intelligent Routing**: PostGIS `ST_Contains` query checks if location falls in a service zone; if yes, routes to that zone's station. If no, uses `ST_Distance` to find nearest station
- **Real-Time Updates**: Responder location streamed via Server-Sent Events (SSE) on `GET /incidents/stream` channel
- **Polling Fallback**: If SSE disconnects, falls back to 5-second polling automatically
- **ETA Calculation**: Client-side A* pathfinding computes route from responder to citizen, calculates distance, divides by average speed (40 km/h) for ETA

---

### 2. **Responder** (Police/Fire/Medical Personnel)

#### How They Use the System

**Logging In:**
1. Admin creates responder account with email/password and assigns to a station
2. Responder logs in (persistent session, httpOnly JWT)

**Viewing Incoming Requests:**
1. Dashboard shows live queue of pending incidents at their station
2. Each queue entry shows: incident category, time submitted, and an action button
3. **Auto-notification on New Incidents**: When a new incident arrives, modal auto-pops and the row highlights in yellow for 5 seconds

**Claiming an Incident:**
1. Click "Claim" button on any queue entry (or from auto-popup)
2. Instantly marked as "BUSY", queue disappears
3. See full incident details: citizen name, phone (if not guest), location coordinates, time submitted

**Managing Response:**
1. **Mark Arrived**: Once at citizen's location, click "Mark Arrived"
   - Citizen instantly sees "Responder arrived" notification
   - Route line updates (but responder is now at destination)
2. **Mark Resolved**: Once emergency is handled, click "Mark Resolved"
   - Citizen sees "Completed" status
   - Responder status reset to "AVAILABLE", can see queue again
   - Free to claim next incident

**Live Location Tracking:**
- Responder's location is tracked via `watchPosition` (high-accuracy geolocation)
- Only broadcasts when task is active (RESPONDING or ARRIVED status)
- Broadcasts throttled: only sends update if moved >10m or 4 seconds passed (prevents flooding)
- **Live Route Visualization**: See map showing citizen's location (red marker) + your route to reach them (red line) + distance/ETA

**Queue & Map:**
- **Radar Layer**: Pulsing rings on map show all pending incidents at station
- **Map Popup**: Click any ring → popup shows citizen info + "Claim" button (no modal needed)
- **Route Updates**: Route recomputes when you move >50m (debounced to avoid constant A* calls)

#### Under the Hood
- **Task Locking**: Postgres row-level locking (`FOR UPDATE`) prevents race condition where two responders claim same incident
- **Status Transitions**: Incident lifecycle: PENDING → RESPONDING (on claim) → ARRIVED (on mark arrived) → RESOLVED (on mark resolved)
- **Active Task Detection**: `has_active_task` field checks for RESPONDING or ARRIVED incidents — locks responder into single-task view
- **SSE Station Stream**: Responder subscribed to `GET /incidents/station-stream` (Redis channel `station:{stationId}:incidents`)
  - Receives: new incidents, claims by others, status changes
  - Auto-refreshes queue without polling
- **Location Broadcasting**: `PATCH /responders/me/location` sends lat/lng to backend, validates active task exists, publishes to citizen via SSE
- **A* Route Calculation**: Grid-based pathfinding computes optimal route path, distance, and ETA

---

### 3. **Admin** (Station Manager)

#### How They Use the System

**Dashboard Access:**
- Login to `/admin` route
- See all responders and stations managed

**Managing Responders:**
1. Create responder: form takes name, email, password, station assignment
2. Update responder: reassign station or change status (AVAILABLE/BUSY/OFF_DUTY)
3. Delete responder: removes account

**Managing Stations:**
1. Create station: name, category (POLICE/FIRE/MEDICAL)
2. View all stations with assigned responders
3. Edit station details

**Managing Service Zones:**
1. Draw zones on map using geospatial UI
2. Zones are PostGIS polygons tied to stations
3. When citizen requests emergency, system checks zone containment first
4. If in zone → routes to that station; if not → routes to nearest

#### Under the Hood
- **Role-Based Auth**: JWT payload includes role (admin/responder/citizen)
- **Route Guards**: `/admin` route checks auth middleware + `isAdmin` guard
- **Zone Storage**: Zones stored as `GEOMETRY('Polygon', 4326)` in database
- **Geospatial Queries**: Zone containment uses PostGIS `ST_Contains(zone.polygon, incident.location)`

---

## Technical Architecture

### High-Level Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         CITIZEN SUBMITS INCIDENT                 │
│  1. Red "Alert" button click → form (category + location)        │
│  2. POST /incidents creates incident + guest user + JWT          │
│  3. PostGIS query: zone containment OR nearest station           │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                   RESPONDERS NOTIFIED IN REAL-TIME               │
│  1. New incident broadcast via Redis → station SSE channel      │
│  2. All responders at station instantly see new queue entry     │
│  3. Modal auto-pops, row highlights (yellow, fades after 5s)    │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                   RESPONDER CLAIMS INCIDENT                      │
│  1. Click "Claim" → PATCH /incidents/:id/claim                  │
│  2. Postgres row lock prevents race (only one can win)           │
│  3. Incident status: PENDING → RESPONDING                       │
│  4. Responder status: AVAILABLE → BUSY                          │
│  5. Citizen notified via SSE: "Responder assigned"              │
│  6. Redis publishes to station: claim event (others see queue   │
│     update, incident disappears from their queue)               │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                   LIVE TRACKING & ETA                            │
│  RESPONDER SIDE:                                                 │
│  1. watchPosition tracks GPS every ~2-4 seconds                 │
│  2. If moved >10m or 4s passed → PATCH /responders/me/location │
│  3. Frontend computes A* route every time (debounced >50m)      │
│  4. Shows: citizen marker + route line + distance/ETA           │
│                                                                   │
│  CITIZEN SIDE:                                                   │
│  1. Receives responder_location SSE messages                    │
│  2. Updates responder marker on map in real-time                │
│  3. A* route recomputes, shows distance/ETA                     │
│  4. Can toggle "Share live location" to broadcast own position  │
│     (if enabled, PATCH /incidents/:id/citizen-location)        │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                   RESPONDER ARRIVES & RESOLVES                   │
│  1. Click "Mark Arrived" → PATCH /incidents/:id/arrive          │
│     - Incident status: RESPONDING → ARRIVED                     │
│     - Citizen sees "Arrived" notification                        │
│                                                                   │
│  2. Handle emergency...                                          │
│                                                                   │
│  3. Click "Mark Resolved" → PATCH /incidents/:id/resolve        │
│     - Incident status: ARRIVED → RESOLVED                       │
│     - Responder status: BUSY → AVAILABLE                        │
│     - Citizen sees "Completed" notification                      │
│     - Responder free to claim next incident                      │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

**Real-Time Communication:**
- **SSE (Server-Sent Events)** — one-way push from server to client
  - Citizen stream: `GET /incidents/stream` → citizen subscribes to own incident updates
  - Station stream: `GET /incidents/station-stream` → all responders at station see queue updates
  - Both backed by **Redis pub/sub** for fan-out (one publish reaches all subscribers)
  - Heartbeat every 20s keeps connection alive
  - 5-second polling fallback if SSE disconnects

**Controllers Publish to Redis:**
- `createIncident` → publishes to station: `{ type: 'incident_created', incidentId }`
- `claimIncident` → publishes to station: `{ type: 'incident_claimed', incidentId }` + citizen: `{ type: 'incident_claimed', status }`
- `arriveIncident` → publishes to station + citizen: `{ type: 'incident_arrived' }`
- `resolveIncident` → publishes to station + citizen: `{ type: 'incident_resolved' }`
- `updateMyLocation` (responder) → publishes to citizen: `{ type: 'responder_location', latitude, longitude }`
- `updateCitizenLocation` (citizen) → publishes to station: `{ type: 'incident_location_updated', latitude, longitude }`

**Geospatial Queries:**
- **Zone Containment** (`ST_Contains`): Check if incident location falls within any service zone polygon
  ```sql
  SELECT zones.station_id FROM zones 
  WHERE ST_Contains(zones.polygon, ST_GeomFromText('POINT(lng lat)', 4326))
  ```
- **Nearest Station** (`ST_Distance`): If no zone match, find closest station
  ```sql
  SELECT stations.id FROM stations 
  ORDER BY ST_Distance(stations.location, incident.location) 
  LIMIT 1
  ```

### Database Schema

**Core Models:**
- **User** (Base): id, name, email, password, number, role (citizen/responder/admin), oauth_provider (guest/local/github), verified
- **Responder**: user_id, station_id, status (AVAILABLE/BUSY/OFF_DUTY), location (GEOMETRY Point), location_updated_at
- **Incident**: citizen_id, station_id, responder_id, category (POLICE/FIRE/MEDICAL), status (PENDING/RESPONDING/ARRIVED/RESOLVED), location (GEOMETRY Point), accepted_at
- **Station**: name, category, location (GEOMETRY Point)
- **Zone**: station_id, polygon (GEOMETRY Polygon), name

**Geospatial:** All locations use SRID 4326 (WGS84 — latitude/longitude)

---

## A* Pathfinding Algorithm

### Yes, A* is Fully Implemented ✅

**Location:** `frontend/src/lib/pathfinding/astar.ts`

**Purpose:** Calculate optimal route distance and ETA between responder and citizen without requiring real road network data.

**How It Works:**

1. **Grid Construction**:
   - Overlay adaptive grid on bounding box between from/to points
   - Grid resolution auto-scales: ~20-30 cells per axis, cell size between 200m–5km
   - Smaller grids for short distances (high precision), larger for long distances (bounded computation)

2. **A* Search** (Standard algorithm):
   - Start node: responder's current location
   - Goal node: incident/citizen location
   - Heuristic: Haversine distance (straight-line air distance)
   - Cost per cell: Uniform (1 for cardinal moves, √2 for diagonals)
   - Open/Closed sets track visited nodes
   - F-cost = G-cost (distance from start) + H-cost (heuristic to goal)

3. **Path Reconstruction**:
   - Convert grid path back to lat/lng coordinates
   - Sum haversine distance between consecutive waypoints = total distance

4. **ETA Calculation**:
   - Divide total distance by average speed (default 40 km/h — reasonable urban emergency response speed)
   - Result in seconds, displayed as minutes on UI

**Why Grid-Based (Not Road Network)?**
- Avoids needing OSM data import pipeline or external routing API
- Still calculates realistic distances (approximates great-circle paths)
- Extensible: can swap uniform cost for weighted cost (roads vs. off-road) later
- Sufficient for MVP; road network can be added in future if needed

**Example:**
```
computeRoute([85.324, 27.717], [85.340, 27.730])
→ { path: [[85.324, 27.717], ..., [85.340, 27.730]], 
    distanceMeters: 1823, 
    etaSeconds: 164 }  // ~2.7 min at 40 km/h
```

---

## Current Feature Completeness

| Step | Feature | Status | Details |
|------|---------|--------|---------|
| 1 | Admin Dashboard | ✅ Complete | Manage responders, stations, zones |
| 1 | Responder CRUD | ✅ Complete | Create/edit/delete responder accounts |
| 1 | Station Management | ✅ Complete | CRUD stations with geospatial zones |
| 1 | Zone Drawing | ✅ Complete | PostGIS polygon zones |
| 2 | Guest User Auto-Provisioning | ✅ Complete | No login, httpOnly JWT |
| 2 | Location Input | ✅ Complete | Geolocation API + map drag |
| 2 | Intelligent Routing | ✅ Complete | Zone containment + nearest station |
| 2 | Active Incident Tracking | ✅ Complete | `GET /incidents/active` |
| 3 | Polling Dashboard | ✅ Complete | 5-sec refresh queue + current task |
| 3 | Atomic Claim (Double-Claim Prevention) | ✅ Complete | Postgres FOR UPDATE lock |
| 3 | Station Queue | ✅ Complete | Pending incidents list |
| 3 | Incident Lifecycle | ✅ Complete | PENDING → RESPONDING → ARRIVED → RESOLVED |
| 3 | SSE Real-Time | ✅ Complete | Citizen + Station streams via Redis pub/sub |
| 3 | Map Radar Visualization | ✅ Complete | Pulsing incident rings on map |
| 3 | Map Popup Claim | ✅ Complete | Click marker → citizen details + claim |
| 4 | Responder Location Broadcast | ✅ Complete | watchPosition + throttled PATCH + SSE |
| 4 | Citizen Location Sharing | ✅ Complete | Toggle UI + PATCH endpoint + SSE publish |
| 4 | A* Pathfinding | ✅ Complete | Grid-based, haversine cost, ETA calc |
| 4 | Route Visualization | ✅ Complete | GeoJSON LineString on both maps |
| 4 | Distance Monitoring | ✅ Complete | Real-time distance/ETA display |
| 5 | History & Analytics | ⏳ Future | Deferred (not required for MVP) |

---

## Testing the Live System

### Scenario: Citizen Calls Emergency, Responder Responds

1. **Open two browser windows:**
   - Tab A: Citizen on home page
   - Tab B: Responder logged in to dashboard

2. **Citizen submits request:**
   - Click red "Alert" button
   - Select POLICE
   - Confirm location
   - See "Request submitted" status

3. **Responder sees notification:**
   - Tab B: Modal auto-pops with new queue entry
   - Yellow highlight fades after 5 seconds
   - Click "Claim"

4. **Citizen sees assignment:**
   - Tab A: Status updates to "Responder assigned" within 1 second (SSE)
   - Responder name and phone visible
   - Distance/ETA shown (e.g., "2.3 km, 3 min")

5. **Responder moves:**
   - Simulate movement (devtools geolocation override or actual mobile)
   - Live marker on citizen's map updates every 4 seconds
   - Route line recalculates when moved >50m
   - Distance/ETA countdown

6. **Responder arrives:**
   - Click "Mark Arrived" button
   - Citizen sees "Arrived" notification
   - Responder still sees map (now at destination)

7. **Resolves:**
   - Click "Mark Resolved"
   - Citizen sees "Completed"
   - Responder back to "AVAILABLE", sees queue again

---

## Deployment Notes

**Environment Setup:**
- PostgreSQL 12+ with PostGIS extension
- Redis 7+ for pub/sub
- Node.js 18+
- Docker Compose for local dev (includes Postgres + Redis + Node)

**Key Configuration:**
- `DATABASE_URL`: Postgres connection
- `REDIS_URL`: Redis pub/sub server
- `CORS_ORIGIN`: JSON array of allowed client origins
- `JWT_SECRET`: Secret for signing tokens
- `NEXT_PUBLIC_API_URL`: Frontend's API endpoint

**Monitoring:**
- Backend logs: Controller actions, SSE connects/disconnects, Redis publishes
- Frontend logs: SSE messages, A* route computations, geolocation errors
- Database: Incident status transitions, responder location history
- Redis: `CLIENT LIST` shows active SSE subscribers per channel

---

## Summary

The **Spatial Emergency Dispatch System** is a production-ready real-time platform that:
- ✅ Eliminates friction for citizens (no login, instant assignment)
- ✅ Empowers responders (live queue, auto-notifications, route guidance)
- ✅ Uses proven tech (Postgres + PostGIS, Redis, SSE, A*)
- ✅ Scales via pub/sub (one incident reaches all responders instantly)
- ✅ Handles connection loss gracefully (SSE + polling fallback)
- ✅ Calculates realistic ETAs (grid-based A* pathfinding)

**Ready for deployment and live testing.**
