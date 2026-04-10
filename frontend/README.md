# Access Review System - Frontend

React + TypeScript + Vite client for the AccessAble platform.

## Stack

- React 19
- TypeScript
- Vite
- Axios
- React Router
- Framer Motion
- Tailwind/Lightswind utility styling

## Run Locally

From the frontend folder:

```bash
pnpm install
pnpm dev
```

Default local URL:

- Frontend: http://localhost:5173

Environment setup:

- `src/.env` should define `VITE_API_URL` (example: `http://localhost:8888/api/`)
- API URL normalization is handled in `src/lib/api.ts`

## Review Feature (Frontend)

### Service Layer

Review API client is in `src/services/review.service.ts` with methods for:

- createReview
- getAllReviews
- getReviewById
- updateReview
- deleteReview
- getMyReviews
- getReviewsBySpace
- getSpaceSummary
- getSpaceWeather
- searchReviews

### Where Review Flows Are Implemented

- Admin review management: `src/pages/admin/ReviewsPage.tsx`
  - list all reviews
  - view review details
  - delete review

- Admin dashboard review analytics + export: `src/pages/admin/DashboardPage.tsx`
  - recent reviews activity
  - export reviews report (PDF/CSV)

- User profile review management: `src/pages/ProfilePage.tsx`
  - list current user's reviews
  - edit own review
  - delete own review

- Space-level community reviews: `src/pages/ExploreSpacesPage.tsx`
  - list reviews for selected public space
  - show summary and weather context
  - create/update/delete own review in-space

### Review Report Export

Client-side export utility:

- `src/utils/downloadReviewsReport.ts`

Supported formats:

- PDF
- CSV

## Build and Quality Checks

```bash
pnpm build
pnpm lint
```

## Notes

- Some pages include advanced visual styling and animation; keep existing patterns when adding features.
- Review authorization relies on JWT token from local storage via shared auth header helpers.
