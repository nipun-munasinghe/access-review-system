# Access Review System - Backend API

Node.js + Express + MongoDB backend for a Public Space Accessibility platform.

## 1) Project Overview

This backend provides:

- Authentication and authorization with JWT
- User management
- Public-space management
- Access-feature management
- Accessibility-review management
- Weather context lookup for public spaces (Open-Meteo)

## 2) Tech Stack

- Node.js
- Express
- MongoDB + Mongoose
- JWT (`x-auth-token`)
- Swagger (`swagger-jsdoc`, `swagger-ui-express`)
- Jest + Supertest + mongodb-memory-server
- Artillery (performance testing)
- pnpm

## 3) Project Structure

```text
access-review-system/
├─ app.js
├─ server.js
├─ controllers/
├─ routes/
├─ models/
├─ docs/swagger.js
├─ handlers/
├─ tests/
│  ├─ unit/
│  ├─ integration/
│  └─ performance/
├─ setup/
├─ seeder/
└─ public/uploads/
```

## 4) Environment Variables

Create `.variables.env` from `sample.variables.env`.

Required:

- `DATABASE` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `SECRET` - Express-session secret
- `KEY` - Session cookie key

Optional:

- `PORT` (default runtime fallback is `80`)
- `NODE_ENV`

## 5) Getting Started

Install dependencies:

```bash
pnpm install
```

Run server:

```bash
pnpm start
```

Dev mode:

```bash
pnpm dev
```

Default local endpoints:

- API base: `http://localhost:8888/api`
- Swagger UI: `http://localhost:8888/api-docs`

## 6) Authentication

Header-based auth for protected routes:

- Header: `x-auth-token`
- Value: JWT token returned from login

Flow:

1. `POST /api/register`
2. `POST /api/login`
3. Use returned token in `x-auth-token` for protected endpoints

Behavior from middleware (`isValidToken`):

- Rejects missing token
- Rejects invalid token
- Rejects user not found
- Rejects logged-out users
- Adds current user to `req.user`
