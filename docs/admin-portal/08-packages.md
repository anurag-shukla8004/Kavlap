# Stage 7 — Packages & Pricing

View wash packages and car-type pricing. Admin CRUD later.

---

## Summary

| Item | Detail |
|---|---|
| **Purpose** | See what customers can book and at what price |
| **Route** | `/admin/packages` |
| **Auth** | JWT + ADMIN (UI) |
| **DB** | `packages`, `package_pricing` |

---

## Backend status

| Capability | Ready? | API |
|---|---|---|
| List packages | Yes | `GET /api/packages` |
| Package detail + pricing | Yes | (see packages/pricing docs) |
| Create / edit package | No | Planned |
| Edit pricing matrix | No | Planned |

---

## Screen — Packages (7a read-only)

### List

| Column | Field |
|---|---|
| Name | `name` |
| Base price | `basePrice` |
| Duration | `durationMinutes` |
| Active | `isActive` |

### Detail panel

- Description + features
- Pricing matrix: car type × seater → price

### Filters

| Filter | Control |
|---|---|
| Active only | Toggle |
| Car type / seater | For pricing view |

---

## Planned admin APIs (7b)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/admin/packages` | Create package |
| `PATCH` | `/api/admin/packages/:id` | Update package |
| `POST` | `/api/admin/packages/:id/pricing` | Upsert price row |
| `PATCH` | `/api/admin/pricing/:id` | Toggle / change price |

---

## Acceptance checklist (7a)

- [ ] Packages list loads from API
- [ ] Pricing matrix visible per package
- [ ] Clear empty / error states

---

## Related

| Prev | [07-service-areas.md](./07-service-areas.md) |
| Next | [09-reviews.md](./09-reviews.md) |
| Backend | `kavlap-server/docs/features/packages.md`, `pricing.md` |
