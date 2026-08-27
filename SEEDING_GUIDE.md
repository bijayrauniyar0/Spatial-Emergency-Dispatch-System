# Data Seeding Guide

This guide explains how to seed the database with realistic data for testing and development.

## Prerequisites

- Database is running (PostgreSQL with PostGIS extension)
- Backend dependencies installed (`npm install`)
- Redis is running (for SSE functionality)

## Seeding Steps

### Step 1: Seed Base Data (Stations & Zones)

First, seed the initial stations and zones:

```bash
cd backend/backend
npm run seed
```

This creates stations (POLICE, FIRE, MEDICAL) with their service zones using data from `src/constants/sample-data.json`.

**Output:** 
- Multiple stations (e.g., "Central Police Station", "Main Fire Department", "City Hospital")
- Associated service zones for each station

### Step 2: Create Admin & Responders (via Admin Panel)

You need at least one admin and some responders to test incidents:

**Option A: Manual via Frontend Admin Panel**
1. Start the backend and frontend
2. Log in to the admin panel (or create account first)
3. Go to `/admin/responders` 
4. Click "Add Responder" and create 5-10 responders across different stations

**Option B: Direct Database Query**

```sql
-- Create an admin user
INSERT INTO users (name, email, password, number, verified, oauth_provider, role, created_at, updated_at)
VALUES ('Admin User', 'admin@example.com', 'hashed_password', '9800000000', true, 'local', 'admin', NOW(), NOW());

-- Create responder users
INSERT INTO users (name, email, password, number, verified, oauth_provider, role, created_at, updated_at)
VALUES 
  ('Officer John', 'officer1@police.com', 'hashed_password', '9801111111', true, 'local', 'responder', NOW(), NOW()),
  ('Officer Jane', 'officer2@police.com', 'hashed_password', '9802222222', true, 'local', 'responder', NOW(), NOW()),
  ('Firefighter Mike', 'firefighter1@fire.com', 'hashed_password', '9803333333', true, 'local', 'responder', NOW(), NOW()),
  ('Paramedic Sarah', 'paramedic1@medical.com', 'hashed_password', '9804444444', true, 'local', 'responder', NOW(), NOW());

-- Link responders to stations (replace station_ids and user_ids with actual values from your DB)
INSERT INTO responders (station_id, user_id, status, has_active_task, created_at, updated_at)
SELECT s.id, u.id, 'AVAILABLE', false, NOW(), NOW()
FROM stations s, users u
WHERE u.role = 'responder'
LIMIT 4;
```

### Step 3: Seed Incident Data

Once you have stations and responders, seed 500 realistic incidents with varied statuses and timestamps:

```bash
cd backend/backend
npm run seed:incidents
```

**What this creates:**
- 150 citizen users (guest accounts)
- 500 incidents distributed across:
  - **Statuses:** PENDING (10%), RESPONDING (20%), ARRIVED (20%), RESOLVED (50%)
  - **Categories:** Matched to station categories (POLICE, FIRE, MEDICAL)
  - **Time range:** Last 30 days (creates time series data for analytics charts)
  - **Locations:** Random coordinates in Kathmandu area (realistic geo-distribution)
  - **Responders:** Random assignment to existing responders for claimed/resolved incidents

**Output example:**
```
✅ Incident seeding completed successfully!

📊 Summary:
  - Citizens created: 150
  - Incidents created: 500
  - Stations used: 3
  - Responders used: 4

💡 Analytics dashboard should now show meaningful data!
```

## What to Test After Seeding

### Analytics Dashboard (`/admin/analytics/`)
After seeding, the analytics dashboard should display:

1. **Summary Cards:**
   - Total Incidents: ~500
   - Active Incidents: ~165 (30% of total in PENDING/RESPONDING/ARRIVED)
   - Avg Dispatch Time: 2-3 minutes
   - Avg Resolution Time: 15-30 minutes

2. **Volume Chart:**
   - Daily incident counts across 30 days
   - Should show natural distribution with some peaks and valleys

3. **Category Distribution Pie Chart:**
   - POLICE, FIRE, MEDICAL incidents roughly equal (1/3 each)

4. **Station Performance Table:**
   - Each station with incident count and average resolution time
   - Should reflect responder availability differences

5. **Responder Performance Table:**
   - Each responder's claimed and resolved incident counts
   - Average resolution times per responder

### Incident History (`/admin/history/`)
After seeding, the history page should:
- Display paginated list of 500 incidents (20 per page)
- Show filters for status, category, station, date range
- Display incident metadata (ID, status badge, category badge, responder info, creation time)

## Database Queries for Validation

Verify data quality with these SQL queries:

```sql
-- Count incidents by status
SELECT status, COUNT(*) as count FROM incidents GROUP BY status;

-- Average resolution times by station
SELECT s.name, AVG(EXTRACT(EPOCH FROM (i.updated_at - i.created_at)))/60 as avg_minutes
FROM incidents i JOIN stations s ON i.station_id = s.id
WHERE i.status = 'RESOLVED'
GROUP BY s.id, s.name;

-- Incidents per day (last 30 days)
SELECT DATE(created_at) as day, COUNT(*) as count
FROM incidents
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY day DESC;

-- Responder performance
SELECT u.email, COUNT(i.id) as claimed, 
  COUNT(CASE WHEN i.status = 'RESOLVED' THEN 1 END) as resolved,
  AVG(EXTRACT(EPOCH FROM (i.updated_at - i.created_at)))/60 as avg_minutes
FROM responders r
JOIN users u ON r.user_id = u.id
LEFT JOIN incidents i ON r.id = i.responder_id
GROUP BY r.id, u.email;
```

## Notes

- **Guest Citizens:** Seeded citizen users use `oauth_provider = 'guest'` to match the behavior of citizens who submit incidents without login
- **Realistic Timestamps:** Incident timestamps are spread across the last 30 days to provide meaningful analytics
- **Status Distribution:** Status distribution (10% PENDING, 20% RESPONDING, 20% ARRIVED, 50% RESOLVED) reflects a working dispatch system
- **Dispatch Times:** `accepted_at` is 0-5 minutes after `created_at` to show realistic dispatch latency
- **Resolution Times:** `updated_at` is 0-30 minutes after `accepted_at` to show realistic resolution duration

## Troubleshooting

### Error: "No stations found in database"
**Solution:** Run `npm run seed` first to create stations and zones.

### Error: "No responders found in database"
**Solution:** Create responders via admin panel or direct SQL INSERT (see Step 2).

### Analytics shows no data
**Solution:** 
1. Verify incidents were created: `SELECT COUNT(*) FROM incidents;`
2. Check timestamps: `SELECT MIN(created_at), MAX(created_at) FROM incidents;`
3. Ensure analytics endpoint is working: `curl http://localhost:9000/api/v1/admin/analytics`

### Timestamps look wrong
**Solution:** Verify database timezone is correct with `SELECT NOW();` and compare to system time.

## Resetting Data

To start fresh and clear all data:

```bash
# Option 1: Delete and recreate database
DROP DATABASE dispatch;
CREATE DATABASE dispatch;
CREATE EXTENSION postgis;

# Then re-run seeding from Step 1

# Option 2: Clear only incidents (keep stations/responders)
DELETE FROM incidents;

# Option 3: Clear all data
DELETE FROM incidents;
DELETE FROM responders;
DELETE FROM users WHERE role != 'admin';
DELETE FROM zones;
DELETE FROM stations;
```

## Performance Notes

- **500 incidents:** Seeding takes ~5-10 seconds
- **1000+ incidents:** Consider using raw SQL INSERT for faster seeding
- **Analytics queries:** Should respond in <1 second for 500 incidents

For larger datasets, modify `seedIncidents.ts` to increase `incidentCount`.
