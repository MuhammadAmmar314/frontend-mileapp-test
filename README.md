# MileApp Frontend (Vue 3 + Vite + TailwindCSS)

Frontend for the **MileApp Fullstack Developer Test**, built with **Vue 3**, **Vite**, and **TailwindCSS**, and deployed on **Vercel**.

---

## Live App
https://frontend-mileapp-test.vercel.app

---

## What I Built
A responsive and dynamic SPA (Single Page Application) that allows users to:
- Login using mock credentials
- View, add, edit, and delete tasks
- Search, sort, and paginate task lists
- Display loading overlays for smooth UX

All API interactions are connected to the backend hosted on Railway.

---

## Design Decisions

### Vue 3 + Vite
Chosen for its simplicity and fast development cycle.  
Vite’s hot module reload makes frontend iteration much faster during testing.

### TailwindCSS
Provides utility-first styling that’s:
- Highly responsive by default
- Lightweight (no heavy component library)
- Perfect for quick layout adjustments

### Axios + Vue Router
Used for API calls and routing:
- `/login` — authentication page  
- `/tasks` — protected route for CRUD task UI

### SPA Routing
Handled with Vue Router in **history mode**, fixed for Vercel using a vercel.json rewrite rule to prevent 404 errors when refreshing or visiting nested routes.

---

## Strengths of This Module
- **Fully responsive design**
- **Reusable components**
- **Reactive UI updates** without reload
- **Consistent state management using localStorage**
- **Clean UX with loading overlay and transitions**

---

## Local Setup
```bash
cd frontend
npm install
npm run dev
```

App runs at:  
`http://localhost:5173`

---

## Mock Login Credentials
```json
{
  "username": "admin",
  "password": "password"
}
```

---

## Deployment
- **Platform:** Vercel  
- **URL:** https://frontend-mileapp-test.vercel.app  
- **Auto Deploy:** on GitHub push  
- **Routing Fix:** via `vercel.json` rewrite rule

---

## Summary
This frontend module was designed to:
- Mirror real-world CRUD workflows
- Emphasize responsiveness and interactivity
- Demonstrate understanding of Vue ecosystem + API integration
- Use clean and modern UI design principles
