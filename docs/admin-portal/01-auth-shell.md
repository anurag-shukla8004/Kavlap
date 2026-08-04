# Stage 0 — Auth + Admin Shell

Login, JWT storage, protected layout, sidebar navigation.

---

## Summary

| Item | Detail |
|---|---|
| **Purpose** | Secure admin entry + shared chrome for all admin pages |
| **Route** | `/admin/login`, layout wraps all `/admin/*` |
| **Auth** | JWT from kavlap-server (`ADMIN` role) |
| **Replaces** | Current `localStorage adminLoggedIn` hack |

---

## Screens

### 1. Login (`/admin/login`)

| Field | Rules |
|---|---|
| Email | Required |
| Password | Required |

**API:**
```http
POST /api/auth/login
Content-Type: application/json

{ "email": "admin@kavlap.com", "password": "admin123" }
```

**On success:**
1. Store JWT (e.g. `localStorage` or httpOnly cookie later)
2. Check `user.role === "ADMIN"` — if not, show error and clear token
3. Redirect to `/admin/dashboard`

**On failure:** Show API error message.

---

### 2. Admin layout (shell)

Shared for all authenticated admin pages:

| UI piece | Behavior |
|---|---|
| Sidebar | Links to Dashboard, Bookings, Slots, Contacts, Workers, Areas, Packages, Reviews |
| Top bar | Admin name + Logout |
| Auth guard | If no token / invalid → redirect `/admin/login` |
| Logout | Clear token → `/admin/login` |

**Optional API on load:**
```http
GET /api/auth/me
Authorization: Bearer <token>
```

Use to verify session and show admin name.

---

## Frontend file plan (suggested)

```
app/admin/
├── login/page.tsx
├── layout.tsx              → shell + auth guard
├── dashboard/page.tsx
├── bookings/...
lib/admin/
├── api.ts                  → fetch wrapper + base URL
├── auth.ts                 → token get/set/clear
└── types.ts
components/admin/
├── Sidebar.tsx
├── TopBar.tsx
└── AuthGuard.tsx
```

---

## Acceptance checklist

- [ ] Login with seed admin works
- [ ] Non-admin users cannot enter portal
- [ ] Refresh keeps session (token persists)
- [ ] Logout clears session
- [ ] Sidebar navigates to all stage routes (pages can be placeholders)

---

## Related

| Next stage | [02-dashboard.md](./02-dashboard.md) |
| Backend | `kavlap-server/docs/features/auth.md` |
