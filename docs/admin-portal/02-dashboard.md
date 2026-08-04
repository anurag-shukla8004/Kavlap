# Stage 1 — Dashboard (Stats + Graphs + Filters)

Home overview for admin: counts, simple charts, date filter.

---

## Summary

| Item | Detail |
|---|---|
| **Purpose** | See business health at a glance |
| **Route** | `/admin/dashboard` |
| **Auth** | JWT + ADMIN |
| **Backend** | `GET /api/admin/dashboard` |

---

## Screen layout

```
┌─────────────────────────────────────────────────────┐
│  Dashboard                    [ Date filter ▾ ]     │
├──────────┬──────────┬──────────┬──────────┬─────────┤
│ Pending  │Confirmed │ Assigned │ In Prog  │ Done    │
│   ##     │   ##     │   ##     │   ##     │  ##     │
├──────────┴──────────┴──────────┴──────────┴─────────┤
│  Status pie / bar chart                             │
│  (pending vs confirmed vs assigned vs …)            │
├─────────────────────────────────────────────────────┤
│  Quick links: Pending bookings → /admin/bookings    │
└─────────────────────────────────────────────────────┘
```

---

## Filters

| Filter | Type | Default | Maps to API |
|---|---|---|---|
| Date | Date picker `YYYY-MM-DD` | Today | `?date=` |

---

## API

```http
GET /api/admin/dashboard?date=2026-08-04
Authorization: Bearer <token>
```

**Response `data`:**
```json
{
  "date": "2026-08-04",
  "pendingReview": 3,
  "confirmed": 5,
  "assigned": 2,
  "inProgress": 1,
  "completedToday": 4,
  "totalBookings": 120
}
```

---

## UI elements

| Element | Data source | Notes |
|---|---|---|
| Stat cards | All count fields | Clickable → bookings list with status filter |
| Completed today card | `completedToday` | Depends on date filter |
| Total bookings | `totalBookings` | Lifetime (not date-scoped today) |
| Pie / bar chart | Status counts | Client-side chart (Recharts / Chart.js / simple SVG) |
| Empty / loading / error | — | Standard states |

---

## Graphs (MVP)

Keep simple — no extra backend needed for Stage 1:

1. **Status breakdown** — pie or horizontal bar from dashboard counts
2. Optional later (needs new API): bookings per day (last 7/30 days), revenue trend

---

## Acceptance checklist

- [ ] Date filter refetches dashboard
- [ ] All 6 stats render correctly
- [ ] One visual chart from status counts
- [ ] Clicking “Pending” opens bookings filtered by `PENDING_REVIEW`
- [ ] Unauthorized → login redirect

---

## Related

| Prev | [01-auth-shell.md](./01-auth-shell.md) |
| Next | [03-bookings.md](./03-bookings.md) |
| Backend | `kavlap-server/docs/features/admin.md` |
