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

## 7) Data Models

### User (`models/User.js`)

- `email` (unique, required)
- `password` (required)
- `userType` (`admin` | `user` | `guest`)
- `name`, `surname` (required)
- `removed`, `enabled`, `isLoggedIn`, `createdAt`
- Virtual relation: `accessibilityReviews`

### PublicSpace (`models/PublicSpace.js`)

- `name` (required)
- `category` (`Mall` | `Park` | `Hospital` | `Station` | `Other`)
- `locationDetails.address` (required)
- `locationDetails.coordinates.lat/lng` (required)
- `imageUrl`, `description`
- Virtual relation: `accessibilityReviews`

### AccessFeature (`models/AccessFeatures.js`)

- `name` (required, unique)
- `description` (required)
- `category` (`Mobility` | `Visual` | `Auditory` | `Cognitive` | `Other`)
- `isActive`
- `createdBy` (ref `User`)

### AccessibilityReview (`models/AccessibilityReview.js`)

- `spaceId` (ref `PublicSpace`)
- `userId` (ref `User`)
- `rating` (1-5)
- `comment` (10-1000 chars)
- `title` (max 100)
- `features[]` with `featureName`, `available`, `condition`
- `removed` (soft delete)

Important indexes:

- Unique active review per user+space (`removed: false` partial index)
- List/query optimization indexes by `spaceId` and `userId`

## 8) Complete API Reference

Base URL: `/api`

### Auth

| Method | Endpoint    | Auth | Description         |
| ------ | ----------- | ---- | ------------------- |
| POST   | `/login`    | No   | Login and get JWT   |
| POST   | `/register` | No   | Register new user   |
| POST   | `/logout`   | Yes  | Logout current user |

### User

All `/api/user/*` routes are protected.

| Method | Endpoint                                       | Description     |
| ------ | ---------------------------------------------- | --------------- |
| GET    | `/user/read/:id`                               | Get user by ID  |
| PATCH  | `/user/update/:id`                             | Update user     |
| DELETE | `/user/delete/:id`                             | Delete user     |
| GET    | `/user/search?q=...&fields=name,surname,email` | Search users    |
| GET    | `/user/list?page=1&items=10`                   | Paginated users |
| PATCH  | `/user/password-update/:id`                    | Update password |

### Public Spaces

| Method | Endpoint                     | Auth | Description    |
| ------ | ---------------------------- | ---- | -------------- |
| POST   | `/public-space/create`       | Yes  | Create space   |
| GET    | `/public-space/list`         | No   | List spaces    |
| PATCH  | `/public-space/update/:id`   | Yes  | Update space   |
| DELETE | `/public-space/delete/:id`   | Yes  | Delete space   |
| GET    | `/public-space/search/:name` | No   | Search by name |

### Access Features

| Method | Endpoint               | Auth | Description                                |
| ------ | ---------------------- | ---- | ------------------------------------------ |
| POST   | `/access-features`     | Yes  | Create feature                             |
| GET    | `/access-features`     | No   | List features (`activeOnly=true` optional) |
| GET    | `/access-features/:id` | No   | Get feature                                |
| PUT    | `/access-features/:id` | Yes  | Update feature                             |
| DELETE | `/access-features/:id` | Yes  | Deactivate feature                         |

### Accessibility Reviews

| Method | Endpoint                         | Auth | Description                    |
| ------ | -------------------------------- | ---- | ------------------------------ |
| POST   | `/review/create`                 | Yes  | Create review                  |
| GET    | `/review/read/:id`               | No   | Read review                    |
| PATCH  | `/review/update/:id`             | Yes  | Update review (owner only)     |
| DELETE | `/review/delete/:id`             | Yes  | Delete review (owner/admin)    |
| GET    | `/review/list`                   | No   | List with pagination + filters |
| GET    | `/review/search?q=...`           | No   | Search title/comment           |
| GET    | `/review/my-reviews`             | Yes  | Current user reviews           |
| GET    | `/review/space/:spaceId`         | No   | Reviews by public space        |
| GET    | `/review/space/:spaceId/summary` | No   | Aggregate summary              |
| GET    | `/review/space/:spaceId/weather` | No   | Weather context                |
