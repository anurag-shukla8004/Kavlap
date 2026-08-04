# Stage 2 — Bookings (List + Detail + Actions)

Full booking management: list with filters, detail drawer/page, confirm / reject / assign worker.

---

## Summary

| Item | Detail |
|---|---|
| **Purpose** | Review and process customer wash bookings |
| **Routes** | `/admin/bookings`, `/admin/bookings/[id]` |
| **Auth** | JWT + ADMIN |
| **DB (server)** | `bookings`, `booking_status_history`, `worker_assignments` |

---

## Status flow (admin actions)

```
PENDING_REVIEW → CONFIRMED → ASSIGNED → IN_PROGRESS → COMPLETED
       ↓              ↑
   REJECTED      (assign worker)
```

| Action | From | To | API |
|---|---|---|---|
| Confirm | `PENDING_REVIEW` | `CONFIRMED` | `PATCH /api/admin/bookings/:id/confirm` |
| Reject | `PENDING_REVIEW` | `REJECTED` | `PATCH /api/admin/bookings/:id/reject` |
| Assign worker | `CONFIRMED` | `ASSIGNED` | `POST /api/admin/bookings/:id/assign-worker` |

---

## Screen A — Bookings list (`/admin/bookings`)

### Filters

| Filter | Control | Query param | Example |
|---|---|---|---|
| Status | Select | `status` | `PENDING_REVIEW` |
| Slot date | Date picker | `date` | `2026-08-04` |
| Search | Text input | client-side first | name / phone |

**Status options:**
`PENDING_REVIEW`, `CONFIRMED`, `ASSIGNED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`, `REJECTED`

### Table columns

| Column | Field |
|---|---|
| Customer | `customerName` |
| Phone | `customerPhone` |
| Package | `package.name` |
| Slot | `timeSlot.slotDate` + start–end |
| Pincode | `servicePincode` |
| Price | `totalPrice` |
| Status | `status` badge |
| Worker | `worker.name` or `—` |
| Created | `createdAt` |

### API

```http
GET /api/admin/bookings?status=PENDING_REVIEW&date=2026-08-04
Authorization: Bearer <token>
```

Row click → detail page / drawer.

---

## Screen B — Booking detail (`/admin/bookings/[id]`)

### Sections

1. **Customer** — name, phone, user email if present
2. **Service** — address, pincode, package, price, instructions
3. **Vehicle** — car type, seater, model, number plate
4. **Slot** — date, start, end
5. **Status** — current badge + timestamps (`confirmedAt`, `completedAt`)
6. **Worker** — assigned worker or assign form
7. **Actions** — Confirm / Reject / Assign (based on status)

### APIs

```http
GET /api/admin/bookings/:id
Authorization: Bearer <token>
```

```http
PATCH /api/admin/bookings/:id/confirm
Authorization: Bearer <token>
```

```http
PATCH /api/admin/bookings/:id/reject
Authorization: Bearer <token>

{ "rejectionReason": "Slot unavailable due to rain" }
```

```http
GET /api/admin/workers
Authorization: Bearer <token>
```

```http
POST /api/admin/bookings/:id/assign-worker
Authorization: Bearer <token>

{ "workerId": "uuid" }
```

---

## UI rules

| Status | Show buttons |
|---|---|
| `PENDING_REVIEW` | Confirm, Reject (reason required) |
| `CONFIRMED` | Assign worker dropdown + Assign |
| Other | Read-only (no status change from admin MVP) |

Pending rows should sort / highlight first (server already returns `createdAt` desc — client can pin pending).

---

## Acceptance checklist

- [ ] List loads with status + date filters
- [ ] Search by name/phone works (client ok for MVP)
- [ ] Detail shows full booking snapshot
- [ ] Confirm / reject / assign work end-to-end
- [ ] After action, list + detail refresh
- [ ] Errors shown clearly (e.g. already assigned)

---

## Related

| Prev | [02-dashboard.md](./02-dashboard.md) |
| Next | [04-time-slots.md](./04-time-slots.md) |
| Backend | `kavlap-server/docs/features/admin.md`, `bookings.md` |
