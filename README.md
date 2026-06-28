# Homemade Food Business Management System

Version: 1.0

## Phase 1 - Project Initialization

This repository contains the initial scaffold for a full stack Homemade Food Business application.

### Structure
- `client/` - React SPA built with Vite and TailwindCSS
- `backend/` - Express API server
- `data/` - JSON database skeleton

### Available scripts
- `npm run dev` - start backend and frontend in development
- `npm run build` - build the frontend for production
- `npm run preview` - preview the built frontend
- `npm start` - start the backend server

### Next phase
Phase 2 will set up the folder structure and baseline component pages for the customer SPA and admin dashboard.

## Deployment notes

- To deploy the frontend to GitHub Pages while pointing it at a hosted backend, set a repository secret named `BACKEND_URL` to your backend API base (including `/api`), for example: `https://your-backend.example.com/api`.
- The included GitHub Actions workflow (`.github/workflows/build-and-deploy.yml`) will set `VITE_API_BASE_URL` during the build using that secret, then run `npm run build` and `npm run deploy`.

Example: create a backend (Render/Vercel/Heroku) serving the Express API, then add the secret and push to the default branch to trigger deployment.

Local testing:

```
npm run dev
# Open the frontend at the Vite URL (usually http://localhost:5173) and the backend runs at http://localhost:4000
```

Notes:
- GitHub Pages is a static host and cannot accept PUT/POST API calls. The built frontend must point to a running backend API for uploads and updates to work.
