# TrustinSecond 

E-commerce platform to sell and find all your second electronics

## Tech Stack

- React 18
- Vite
- React Router DOM
- Axios

## Getting Started

From the repository root, install dependencies and run the backend (if not already):

```bash
npm install
node src/server.js
```

Then set up and run the client:

```bash
cd client
npm install
npm run dev
```

The client runs on `http://localhost:3000` and proxies API requests to `http://localhost:5025`.

Make sure your `.env` for the backend defines `PORT=5025` and a valid `JWT_SECRET`.
