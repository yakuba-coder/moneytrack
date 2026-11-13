# PennyTrack — DevCamp 2.0 Personal Finance Tracker

A full-stack MERN starter application with JWT authentication, MongoDB persistence,
transaction CRUD, monthly budgets, custom expense categories, filters, and a responsive dashboard.

## Requirements
- Node.js 18+
- MongoDB local instance or MongoDB Atlas connection string

## Run locally

### 1. Backend
```bash
cd backend
cp .env.example .env
# Set MONGO_URI and JWT_SECRET in .env
npm install
npm run dev
```
Backend runs at `http://localhost:5000`.

### 2. Frontend
In a second terminal:
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`.

The Vite dev server proxies `/api` requests to the backend.

## Main API
All `/api/transactions`, `/api/categories`, `/api/budgets`, and `/api/dashboard` routes require
`Authorization: Bearer <token>`.

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET|POST /api/transactions`
- `GET|PUT|DELETE /api/transactions/:id`
- `GET|POST /api/categories`
- `PUT|DELETE /api/categories/:id`
- `GET|PUT /api/budgets/:month` (month format: `YYYY-MM`)
- `GET /api/dashboard?month=YYYY-MM`

## Security notes
- Passwords are hashed with bcrypt.
- JWT-protected routes derive the user ID from the token.
- Every user-owned database query is scoped by `req.user.id`.
- Never commit `.env` files. Use a long, random JWT secret in production.
- Add HTTPS, rate limiting, stricter production CORS, and request logging before public launch.

## Deploy
Deploy `backend` as a Node service and `frontend` as a static Vite site. Set:
- Backend: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, `PORT`
- Frontend: `VITE_API_URL` (your deployed backend origin plus `/api`)

This is a project starter, not a financial institution or bank-connected service.
