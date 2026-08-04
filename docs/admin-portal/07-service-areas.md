# Stage 6 — Service Areas

Manage / view pincodes where Kavlap operates.

---

## Summary

| Item | Detail |
|---|---|
| **Purpose** | Know which areas are serviceable; later CRUD |
| **Route** | `/admin/service-areas` |
| **Auth** | JWT + ADMIN (UI) |
| **DB** | `service_areas` |

---

## Backend status

| Capability | Ready? | API |
|---|---|---|
| List active areas | Yes | `GET /api/service-areas` |
| Check one pincode | Yes | `GET /api/service-areas/check?pincode=` |
| Create / edit / disable | No | Planned admin APIs |

---

## Screen — Service areas (6a read-only)

### Columns

| Column | Field |
|---|---|
| Pincode | `pincode` |
| City | `city` |
| Area | `areaName` |

### Filters

| Filter | Control |
|---|---|
| Search | Pincode / city / area name |

### API

```http
GET /api/service-areas
```

---

## Planned admin APIs (6b)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/admin/service-areas` | Add pincode |
| `PATCH` | `/api/admin/service-areas/:id` | Update / toggle `isActive` |
| `DELETE` | `/api/admin/service-areas/:id` | Soft delete |

---

## Acceptance checklist (6a)

- [ ] Table of all active service areas
- [ ] Search works
- [ ] Used as dropdown source for Slots + Contacts filters

---

## Related

| Prev | [06-workers.md](./06-workers.md) |
| Next | [08-packages.md](./08-packages.md) |
| Backend | `kavlap-server/docs/features/service-areas.md` |
