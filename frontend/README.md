# EduSphere — Frontend

React 19 single-page application for the EduSphere online courses platform. Built with Vite, React Router, and a dark-themed UI.

## Tech stack

- React 19
- Vite 8
- React Router 7
- Lucide React (icons)

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or higher
- npm (included with Node.js)
- **Backend API running** at `http://localhost:8000` (see [backend README](../backend/README.md))

## Quick start

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Start the development server

```bash
npm run dev
```

Open the URL shown in the terminal (usually **http://localhost:5173**).

### 3. Make sure the backend is running

In a separate terminal:

```bash
cd backend
php artisan serve
```

The frontend talks to the API at `http://localhost:8000/api`. If the backend is not running, pages will load but course data and login will fail.

## Available scripts

| Command         | Description                          |
|-----------------|--------------------------------------|
| `npm run dev`   | Start Vite dev server with hot reload |
| `npm run build` | Production build to `dist/`          |
| `npm run preview` | Preview the production build       |
| `npm run lint`  | Run ESLint                           |

## Demo accounts

Use these after seeding the backend database (password: `password`):

| Role       | Email                  | What you can do                          |
|------------|------------------------|------------------------------------------|
| Student    | `student@example.com`  | Browse, enroll, watch lessons, review    |
| Instructor | `instructor@example.com` | Manage courses and lessons             |
| Admin      | `admin@example.com`    | Access student and instructor features   |

## Pages & routes

| Route                          | Access   | Description                |
|--------------------------------|----------|----------------------------|
| `/`                            | Public   | Home page with featured courses |
| `/courses`                     | Public   | Course catalog with filters |
| `/courses/:slug`               | Public   | Course detail page         |
| `/login`                       | Public   | Sign in                    |
| `/register`                    | Public   | Create account             |
| `/dashboard`                   | Student  | My learning dashboard    |
| `/learn/:slug`                 | Student  | Course video player        |
| `/instructor`                  | Instructor | Instructor dashboard     |
| `/instructor/courses/new`      | Instructor | Create a course          |
| `/instructor/courses/:id/edit` | Instructor | Edit a course            |

## Project structure

```
frontend/
├── src/
│   ├── main.jsx              # App entry point
│   ├── App.jsx               # Routes and layout
│   ├── index.css             # Global styles
│   ├── context/
│   │   └── AuthContext.jsx   # Auth state & API helper
│   ├── components/
│   │   └── Navbar.jsx        # Navigation bar
│   └── views/
│       ├── Home.jsx
│       ├── Courses.jsx
│       ├── CourseDetail.jsx
│       ├── CoursePlayer.jsx
│       ├── StudentDashboard.jsx
│       ├── InstructorDashboard.jsx
│       ├── CourseForm.jsx
│       ├── Login.jsx
│       └── Register.jsx
├── index.html
├── vite.config.js
└── package.json
```

## API configuration

The API base URL is defined in `src/context/AuthContext.jsx`:

```js
export const API_BASE_URL = 'http://localhost:8000/api';
```

If your backend runs on a different host or port, update this value.

Authentication tokens are stored in `localStorage` under the key `auth_token` and sent as `Authorization: Bearer {token}` on protected requests.

## Production build

```bash
npm run build
npm run preview
```

The built files are output to the `dist/` folder. Serve them with any static file server or deploy to platforms like Vercel, Netlify, or your own web server.

For production, point `API_BASE_URL` to your live API URL.

## Full project setup (backend + frontend)

**Terminal 1 — Backend:**

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
# Configure DB in .env, then:
php artisan migrate --seed
php artisan serve
```

**Terminal 2 — Frontend:**

```bash
cd frontend
npm install
npm run dev
```

Then open the frontend URL in your browser and sign in with a demo account.

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Blank page | Check the browser console for errors; ensure dependencies are installed |
| No courses showing | Start the backend and confirm `http://localhost:8000/api/courses` returns data |
| Login fails | Run `php artisan db:seed` on the backend; use demo credentials above |
| CORS errors | Backend `config/cors.php` allows all origins for `api/*` by default |
| Port already in use | Vite picks the next free port (e.g. 5174); check the terminal output |
| API connection error | Verify `API_BASE_URL` matches your backend URL |

## Related

- [Backend README](../backend/README.md) — Laravel API setup and endpoints
