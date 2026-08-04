# Stage 5 — Workers

List workers for assignment and day-to-day visibility.

---

## Summary

| Item | Detail |
|---|---|
| **Purpose** | See who can be assigned to confirmed bookings |
| **Route** | `/admin/workers` |
| **Auth** | JWT + ADMIN |
| **Backend** | `GET /api/admin/workers` |

---

## Screen — Workers list

### Columns

| Column | Field |
|---|---|
| Code | `employeeCode` |
| Name | `name` |
| Phone | `phone` |
| Available | `isAvailable` badge |
| Service pincodes | `servicePincodes` chips |

### API

```http
GET /api/admin/workers
Authorization: Bearer <token>
```

Example item:
```json
{
  "id": "uuid",
  "employeeCode": "W001",
  "name": "Ravi",
  "phone": "9876543210",
  "isAvailable": true,
  "servicePincodes": ["411001", "411002"]
}
```

### Filters (client MVP)

| Filter | Control |
|---|---|
| Available only | Toggle |
| Pincode | Select / text |
| Search | Name / code / phone |

---

## Used also by

Booking detail **Assign worker** dropdown (Stage 2) uses the same API.

---

## Future (not MVP)

| Feature | Needs |
|---|---|
| Create / edit worker | New admin APIs |
| Worker job calendar | Worker jobs API filtered by worker |
| Performance stats | New analytics API |

---

## Acceptance checklist

- [ ] Workers list loads
- [ ] Available / pincode filters work
- [ ] Same list powers assign dropdown on booking detail

---

## Related

| Prev | [05-contacts.md](./05-contacts.md) |
| Next | [07-service-areas.md](./07-service-areas.md) |
| Backend | `kavlap-server/docs/features/admin.md`, `worker.md` |
