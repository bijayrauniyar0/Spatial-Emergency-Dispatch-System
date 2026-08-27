# Quick Start: Seeding Data for Analytics Testing

## TL;DR - One Command Per Step

### Prerequisites
```bash
# Ensure database is running and Redis is up
docker-compose up -d postgres redis
```

### Complete Setup in 3 Steps

```bash
# Step 1: Seed stations and zones (one-time)
cd backend/backend
npm run seed

# Step 2: Create responders (via admin panel OR SQL)
# Via Admin Panel: Login, go to /admin/responders, click "Add Responder" (5-10 times)
# OR via SQL: See SEEDING_GUIDE.md for SQL commands

# Step 3: Generate 500 incidents with realistic data
npm run seed:incidents
```

After these three steps, **analytics will show meaningful data!**

---

## What Data Gets Created

### After `npm run seed`
```
✅ Created 3 stations:
  - Central Police Station (POLICE)
  - Main Fire Department (FIRE)  
  - City Hospital (MEDICAL)

✅ Created 3 zones (service areas for each station)
```

### After creating responders (4 responders shown as example)
```
✅ 1 responder assigned to each station
✅ Responders ready to claim incidents
```

### After `npm run seed:incidents`
```
✅ Created 150 citizen users (guest accounts)
✅ Created 500 incidents with:
  - 50 PENDING (red status badge)
  - 100 RESPONDING (blue status badge)
  - 100 ARRIVED (purple status badge)
  - 250 RESOLVED (green status badge)
  
✅ Spread across 30 days with realistic timestamps
✅ Random assignment to existing stations and responders
```

---

## Test the Analytics Dashboard

### 1. Start the application
```bash
# Terminal 1: Backend
cd backend/backend
npm run dev

# Terminal 2: Frontend  
cd frontend
npm run dev
```

### 2. Navigate to Admin Analytics
- Go to `http://localhost:3000/admin/analytics`
- You should see:

#### Summary Cards
| Metric | Expected Value |
|--------|--------|
| Total Incidents | ~500 |
| Active Incidents | ~165 (PENDING + RESPONDING + ARRIVED) |
| Avg Dispatch Time | 2-3 min |
| Avg Resolution Time | 15-30 min |

#### Charts
- **Volume Chart**: Daily incident counts showing 30-day trend
- **Category Chart**: Pie chart showing POLICE/FIRE/MEDICAL distribution (~1/3 each)

#### Tables
- **Station Performance**: Each station with incident count and avg resolution time
- **Responder Performance**: Each responder's claimed/resolved counts and metrics

### 3. Test Incident History
- Go to `http://localhost:3000/admin/history`
- Should show paginated list of 500 incidents (20 per page)
- Test pagination: Next/Previous buttons
- Data should include:
  - Incident ID
  - Category badge (POLICE/FIRE/MEDICAL)
  - Status badge (color-coded)
  - Station name
  - Responder email (or "Unclaimed" for PENDING)
  - Creation timestamp

---

## Database Queries to Verify Data

Run these in `psql` to validate seeding:

```sql
-- Verify incident counts by status
SELECT status, COUNT(*) 
FROM incidents 
GROUP BY status;

-- Expected output (approximately):
--  status    | count
-- -----------+-------
--  RESOLVED  |   250
--  ARRIVED   |   100
--  RESPONDING|   100
--  PENDING   |    50

-- Verify incidents are linked to stations
SELECT s.name, COUNT(i.id) as incident_count
FROM incidents i
JOIN stations s ON i.station_id = s.id
GROUP BY s.id, s.name;

-- Verify citizen users were created
SELECT COUNT(*) FROM users WHERE role = 'citizen';
-- Expected: 150

-- Verify responders have incidents assigned
SELECT u.email, COUNT(i.id) as claimed_incidents
FROM responders r
JOIN users u ON r.user_id = u.id
LEFT JOIN incidents i ON r.id = i.responder_id
GROUP BY r.id, u.email;
```

---

## Customizing the Seeding Data

Edit `backend/backend/src/scripts/seedIncidents.ts` to change:

```typescript
// Change number of incidents created
const incidentCount = 500;  // <- Change this number

// Change status distribution (line ~42-49)
const getRandomStatus = (): 'PENDING' | 'RESPONDING' | 'ARRIVED' | 'RESOLVED' => {
  const rand = Math.random();
  if (rand < 0.1) return 'PENDING';      // 10% pending
  if (rand < 0.3) return 'RESPONDING';   // 20% responding
  if (rand < 0.5) return 'ARRIVED';      // 20% arrived
  return 'RESOLVED';                     // 50% resolved
};

// Change number of citizens
const citizenCount = 150;  // <- Change this number

// Change time range (default: last 30 days)
const daysAgo = 30;  // <- Change this number
```

Then re-run: `npm run seed:incidents`

---

## Troubleshooting

### Issue: "No stations found in database"
**Fix:** Run `npm run seed` first to create stations

### Issue: "No responders found in database"  
**Fix:** Create responders via admin panel or SQL INSERT (see SEEDING_GUIDE.md)

### Issue: Analytics shows empty charts
**Fix 1:** Verify incidents exist: `SELECT COUNT(*) FROM incidents;`
**Fix 2:** Check backend is running: `curl http://localhost:9000/api/v1/admin/analytics`
**Fix 3:** Check browser console for API errors

### Issue: Status distribution looks wrong
**Fix:** Verify with this query:
```sql
SELECT status, COUNT(*), ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM incidents), 1) as percentage
FROM incidents
GROUP BY status;
```

### Issue: Timestamps are in wrong timezone
**Fix:** PostgreSQL timezone is independent. Verify with:
```sql
SELECT NOW() AT TIME ZONE 'UTC';
SELECT NOW() AT TIME ZONE 'Asia/Kathmandu';
```

---

## Next Steps After Seeding

1. **Test Analytics Functionality:**
   - Verify all charts render correctly
   - Test that numbers are reasonable
   - Check table sorting and pagination

2. **Test Incident History:**
   - Paginate through incidents
   - Verify incident details are accurate
   - Test date/status filters (when added)

3. **Create More Realistic Data:**
   - Add more responders and run seeding again
   - Create incidents with higher resolution variance
   - Add real station zone boundaries

4. **Performance Testing:**
   - Try 1000+ incidents and measure analytics query time
   - Monitor database query performance
   - Test concurrent admin user access

---

## File Reference

- **Seeding Script:** `backend/backend/src/scripts/seedIncidents.ts`
- **Seeding Guide:** `SEEDING_GUIDE.md` (comprehensive)
- **Analytics API:** `backend/backend/src/controllers/analyticsControllers.ts`
- **Analytics Frontend:** `frontend/src/features/admin/analytics/`
- **Incident History API:** Endpoint in `GET /admin/incidents`
- **Incident History Frontend:** `frontend/src/features/admin/history/`
