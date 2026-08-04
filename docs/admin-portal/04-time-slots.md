# Stage 3 — Time Slots (Slot Booking Management)

Admin view of slot calendar / capacity by pincode and date. Create/disable slots when backend supports it.

---

## Summary

| Item | Detail |
|---|---|
| **Purpose** | See and manage available wash slots |
| **Route** | `/admin/slots` |
| **Auth** | JWT + ADMIN (UI); public GET exists for availability |
| **DB** | `time_slots`, `service_areas` |

---

## Backend status

| Capability | Ready? | API |
|---|---|---|
| List available slots by pincode + date | Yes | `GET /api/time-slots?pincode=&date=` |
| Create / edit / disable slots | No | Planned admin APIs (see below) |
| Capacity overview across areas | No | Planned |

---

## Screen — Slots (`/admin/slots`)

### Filters

| Filter | Control | Required |
|---|---|---|
| Pincode / service area | Select (from service areas) | Yes |
| Date | Date picker | Yes |

### Layout options

**MVP — list view**
```
Pincode [411001 ▾]   Date [2026-08-04]

| Time        | Capacity | Booked | Available | Active |
| 09:00–11:00 | 5        | 2      | 3         | Yes    |
| 11:00–13:00 | 5        | 5      | 0         | Full   |
```

**Nice-to-have — week calendar**
- Columns = dates
- Rows = time bands
- Cell color by fill % (green → yellow → red)

### Current public API (usable now)

```http
GET /api/time-slots?pincode=411001&date=2026-08-04
```

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "slotDate": "2026-08-04",
      "startTime": "09:00",
      "endTime": "11:00",
      "maxCapacity": 5,
      "bookedCount": 2,
      "availableSpots": 3,
      "isAvailable": true
    }
  ]
}
```

Load service areas for the pincode dropdown:
```http
GET /api/service-areas
```

---

## Planned admin APIs (backend TODO)

Document here so frontend + backend stay aligned. Do **not** invent UI actions until these exist.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/time-slots` | All slots (incl. full / inactive) + filters |
| `POST` | `/api/admin/time-slots` | Create slot(s) for area + date |
| `PATCH` | `/api/admin/time-slots/:id` | Update capacity / times / `isActive` |
| `DELETE` | `/api/admin/time-slots/:id` | Soft-delete slot |

### Suggested create body
```json
{
  "serviceAreaId": "uuid",
  "slotDate": "2026-08-10",
  "startTime": "09:00",
  "endTime": "11:00",
  "maxCapacity": 5
}
```

---

## Stage split

| Sub-stage | What to build |
|---|---|
| **3a** | Read-only slots list using public GET + area dropdown |
| **3b** | Create / edit / disable UI after admin slot APIs ship |

---

## Acceptance checklist (3a)

- [ ] Pick area + date → see slots
- [ ] Show capacity / booked / available
- [ ] Full slots clearly marked
- [ ] Empty state when no slots

---

## Related

| Prev | [03-bookings.md](./03-bookings.md) |
| Next | [05-contacts.md](./05-contacts.md) |
| Backend | `kavlap-server/docs/features/time-slots.md` |
