# QuickDine

QuickDine is a full-stack restaurant discovery and table-reservation application. It provides a customer-facing dining experience along with separate owner and administrator dashboards.

## Features

- Browse and search restaurants by location, cuisine, price range, and rating
- View restaurant details, availability, and reviews
- Create and manage table reservations
- Customer dashboard for reservations and recommendations
- Owner dashboard for restaurant and booking management
- Admin dashboard for restaurant approval and platform metrics
- JWT-based authentication and role-based access control

## Tech Stack

| Area | Technology |
| --- | --- |
| Client | React 19, TypeScript, Vite, Tailwind CSS |
| Server | Node.js, Express, TypeScript |
| Database | MongoDB with Mongoose |
| Authentication | JSON Web Tokens and bcrypt |

## Project Structure

```text
QuickDine/
├── Client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── context/
│   └── package.json
├── server/                 # Express API
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   └── server.ts
└── README.md
```

## Prerequisites

- Node.js 18 or later
- npm
- A MongoDB database (local or Atlas)

## Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd QuickDine
```

### 2. Configure the server

Create `server/.env` with the following values:

```env
PORT=5000
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<a-long-random-secret>
NODE_ENV=development
```

Install dependencies and start the API:

```bash
cd server
npm install
npm run start
```

The API runs on `http://localhost:5000` by default.

### 3. Configure the client

Create `Client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Install dependencies and start the development server:

```bash
cd Client
npm install
npm run dev
```

Open the URL shown by Vite, normally `http://localhost:5173`.