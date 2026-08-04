# Kavlap Admin Portal — Feature Documentation

Frontend admin dashboard docs. Build **stage by stage**. Backend APIs live in `kavlap-server` — this folder documents the **UI screens**, filters, graphs, and which APIs each screen uses.

---

## Goal

Replace the current basic `/admin` page (Supabase + localStorage login) with a full admin portal powered by **kavlap-server** JWT APIs.

---

## Development stages (build order)

| Stage | Feature | Doc | Backend ready? |
|---|---|---|---|
| 0 | Auth + shell (login, layout, sidebar) | [01-auth-shell.md](./01-auth-shell.md) | Yes |
| 1 | Dashboard (stats + graphs + date filter) | [02-dashboard.md](./02-dashboard.md) | Yes (basic stats) |
| 2 | Bookings list + detail + actions | [03-bookings.md](./03-bookings.md) | Yes |
| 3 | Time slots management | [04-time-slots.md](./04-time-slots.md) | Partial (public GET only) |
| 4 | Contacts list + upload form | [05-contacts.md](./05-contacts.md) | No — needs new APIs |
| 5 | Workers | [06-workers.md](./06-workers.md) | Yes (list) |
| 6 | Service areas | [07-service-areas.md](./07-service-areas.md) | Partial (public GET) |
| 7 | Packages & pricing | [08-packages.md](./08-packages.md) | Partial (public GET) |
| 8 | Reviews moderation | [09-reviews.md](./09-reviews.md) | Yes |

---

## Suggested app routes

```
/admin                  → redirect to /admin/dashboard (if logged in)
/admin/login            → Admin login
/admin/dashboard        → Stats + graphs
/admin/bookings         → Booking list + filters
/admin/bookings/[id]    → Booking detail + confirm/reject/assign
/admin/slots            → Slot calendar / capacity
/admin/contacts         → Contact list
/admin/contacts/upload  → Contact upload form (CSV / manual)
/admin/workers          → Worker list
/admin/service-areas    → Pincode areas
/admin/packages         → Packages + pricing
/admin/reviews          → Review moderation
```

---

## API base

| Environment | URL |
|---|---|
| Local API | `http://localhost:3001` |
| Admin app | `http://localhost:3000/admin` |

**Auth header:** `Authorization: Bearer <jwt>`

**Role required:** `ADMIN`

**Seed admin:**
```
Email:    admin@kavlap.com
Password: admin123
```

---

## Standard API response

**Success:**
```json
{ "success": true, "data": { } }
```

**Error:**
```json
{ "status": "error", "message": "Error description" }
```

---

## Backend reference (read only)

API feature docs live in `kavlap-server/docs/features/`:

| Backend doc | Used by admin screen |
|---|---|
| `auth.md` | Login |
| `admin.md` | Dashboard, bookings, workers |
| `bookings.md` | Booking status flow |
| `time-slots.md` | Slot availability |
| `service-areas.md` | Pincode areas |
| `packages.md` / `pricing.md` | Packages |
| `reviews.md` | Reviews |
| `notifications.md` | Customer notify side-effects |

---

## How to use these docs

1. Pick the next **Stage** from the table above
2. Open that feature doc
3. Build only that screen + wire listed APIs
4. Mark stage done, move to next

Do **not** jump to contacts/upload until Stages 0–3 are solid.
