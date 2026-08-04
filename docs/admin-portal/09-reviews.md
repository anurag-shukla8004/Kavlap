# Stage 8 — Reviews Moderation

List customer reviews and toggle visibility.

---

## Summary

| Item | Detail |
|---|---|
| **Purpose** | Moderate public reviews |
| **Route** | `/admin/reviews` |
| **Auth** | JWT + ADMIN |
| **Backend** | Admin review endpoints on `/api/admin/reviews` |

---

## APIs

```http
GET /api/admin/reviews
Authorization: Bearer <token>
```

```http
PATCH /api/admin/reviews/:id
Authorization: Bearer <token>

{ "isVisible": false }
```

---

## Screen — Reviews list

### Columns

| Column | Notes |
|---|---|
| Rating | Stars 1–5 |
| Comment | Truncate + expand |
| Customer | From review user |
| Booking | Link to booking detail |
| Worker | If present |
| Visible | Toggle |
| Created | Date |

### Filters

| Filter | Control |
|---|---|
| Visible | All / Yes / No |
| Rating | 1–5 |
| Search | Comment / customer name |

---

## Acceptance checklist

- [ ] Reviews list loads
- [ ] Toggle visibility updates via PATCH
- [ ] Link to related booking works

---

## Related

| Prev | [08-packages.md](./08-packages.md) |
| Backend | `kavlap-server/docs/features/reviews.md`, `admin.md` |
