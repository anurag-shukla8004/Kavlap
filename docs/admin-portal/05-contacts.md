# Stage 4 — Contacts (List + Upload Form)

Customer / lead contact book for admin. List contacts, add manually, or bulk upload CSV.

> **Note:** kavlap-server has **no contacts module yet**. Stage 4a can start from booking/user data; Stage 4b needs new backend APIs.

---

## Summary

| Item | Detail |
|---|---|
| **Purpose** | Keep customer contacts for follow-up, marketing, or manual booking help |
| **Routes** | `/admin/contacts`, `/admin/contacts/upload`, `/admin/contacts/new` |
| **Auth** | JWT + ADMIN |

---

## What is a “Contact”?

| Field | Required | Notes |
|---|---|---|
| Name | Yes | |
| Phone | Yes | Primary key-ish for dedupe |
| Email | No | |
| Address | No | |
| Pincode | No | Link to service area |
| Source | No | `BOOKING`, `UPLOAD`, `MANUAL`, `WEBSITE` |
| Notes | No | Free text |
| Tags | No | e.g. VIP, lead |

---

## Stage 4a — Contact list (from existing data)

Until contacts API exists, build a **read-only** list derived from admin bookings:

| Column | Source |
|---|---|
| Name | `customerName` |
| Phone | `customerPhone` |
| Address | `serviceAddress` |
| Pincode | `servicePincode` |
| Last booking | latest booking date |
| Bookings count | aggregate client-side |

**API (temporary):**
```http
GET /api/admin/bookings
Authorization: Bearer <token>
```

Dedupe by phone on the client.

### Filters (list)

| Filter | Control |
|---|---|
| Search | Name / phone / email |
| Pincode | Select |
| Date range | Last booking date (client) |

---

## Stage 4b — Dedicated contacts (needs backend)

### Planned screens

#### 1. Contact list (`/admin/contacts`)

| Column | Field |
|---|---|
| Name | `name` |
| Phone | `phone` |
| Email | `email` |
| Pincode | `pincode` |
| Source | badge |
| Created | `createdAt` |

Actions: View, Edit, Delete (soft).

#### 2. Manual add / edit (`/admin/contacts/new`)

Simple form matching contact fields above.

#### 3. Upload form (`/admin/contacts/upload`)

```
┌────────────────────────────────────────┐
│  Upload contacts                       │
│                                        │
│  [ Choose CSV file ]  or drag & drop   │
│                                        │
│  Template download link                │
│                                        │
│  Preview table (first 10 rows)         │
│  Errors highlighted                    │
│                                        │
│  [ Cancel ]  [ Import ]                │
└────────────────────────────────────────┘
```

**CSV columns (suggested):**
```csv
name,phone,email,address,pincode,notes
Anurag,9876543210,a@mail.com,"MG Road",411001,VIP lead
```

**Upload rules:**
- Phone required, 10 digits
- Skip / report duplicate phones
- Max rows per upload (e.g. 500)
- Show success count + error rows

---

## Planned backend APIs

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/contacts` | List + search/filter |
| `GET` | `/api/admin/contacts/:id` | Detail |
| `POST` | `/api/admin/contacts` | Create one |
| `PATCH` | `/api/admin/contacts/:id` | Update |
| `DELETE` | `/api/admin/contacts/:id` | Soft delete |
| `POST` | `/api/admin/contacts/upload` | CSV / JSON bulk import |

### Suggested list query

| Query | Description |
|---|---|
| `search` | Name / phone / email |
| `pincode` | Exact pincode |
| `source` | `MANUAL` / `UPLOAD` / `BOOKING` |
| `page` / `limit` | Pagination |

### Suggested upload response
```json
{
  "success": true,
  "data": {
    "imported": 42,
    "skipped": 3,
    "errors": [
      { "row": 5, "phone": "123", "message": "Invalid phone" }
    ]
  }
}
```

### Suggested DB table (server)

```
contacts
  id, name, phone, email, address, pincode,
  source, notes, created_by, deleted_at, created_at, updated_at
```

Unique index on `phone` (where not deleted) recommended.

---

## Acceptance checklist

**4a**
- [ ] Contacts page lists unique customers from bookings
- [ ] Search + pincode filter work

**4b** (after APIs)
- [ ] Manual create form works
- [ ] CSV upload with preview + error report
- [ ] Duplicates handled cleanly
- [ ] List uses real contacts API

---

## Related

| Prev | [04-time-slots.md](./04-time-slots.md) |
| Next | [06-workers.md](./06-workers.md) |
| Backend gap | New feature — not in `kavlap-server/docs/features` yet |
