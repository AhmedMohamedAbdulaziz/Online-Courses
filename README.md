# EduSphere Project

This project is an online learning platform made of two main parts:

- **backend**: the API built with Laravel
- **frontend**: the user interface built with React

---

## 1) Project Structure

```text
Online Courses/
├── backend/     # Laravel API
└── frontend/    # React application
```

### Backend
The backend folder is responsible for:
- handling authentication (login/register)
- managing courses, lessons, and enrollments
- working with the database
- returning JSON data to the frontend

### Frontend
The frontend folder is responsible for:
- displaying pages to users
- communicating with the API
- managing user state (login/register)
- showing dashboards based on the user role

---

## 2) API Base URL

The API runs at:

```text
http://localhost:8000/api
```

### Response Format
Most responses are returned in JSON format, commonly like this:

```json
{
  "success": true,
  "message": "...",
  "data": {}
}
```

In some cases, the response may look like:

```json
{
  "success": true,
  "courses": []
}
```

---

## 3) Types of Endpoints

### A. Public Endpoints (no login required)

#### Auth
- `POST /api/auth/register` → create a new account
- `POST /api/auth/login` → log in and receive a token

#### Courses
- `GET /api/courses` → list all courses
- `GET /api/courses/{slug}` → get details of one course

---

### B. Protected Endpoints (token required)

The token is sent using this header:

```http
Authorization: Bearer {token}
```

#### Authenticated User
- `GET /api/auth/me` → get current user information
- `POST /api/auth/logout` → log out

#### Student Actions
- `GET /api/student/dashboard` → student dashboard
- `POST /api/courses/{courseId}/enroll` → enroll in a course
- `POST /api/lessons/{lessonId}/complete` → mark a lesson as completed
- `POST /api/courses/{courseId}/reviews` → add a review

#### Instructor Actions
- `GET /api/instructor/dashboard` → instructor dashboard
- `POST /api/courses` → create a course
- `PUT /api/courses/{id}` → update a course
- `DELETE /api/courses/{id}` → delete a course
- `POST /api/courses/{courseId}/lessons` → add a lesson
- `PUT /api/lessons/{id}` → update a lesson
- `DELETE /api/lessons/{id}` → delete a lesson

#### Admin Actions
- `GET /api/admin/dashboard` → admin dashboard
- `POST /api/admin/users`
- `PUT /api/admin/users/{id}`
- `DELETE /api/admin/users/{id}`
- `DELETE /api/admin/enrollments/{id}`

---

## 4) Example API Responses

### Login Example

```json
{
  "success": true,
  "message": "Login successful.",
  "access_token": "...",
  "token_type": "Bearer",
  "user": {
    "id": 1,
    "name": "Ahmed",
    "email": "ahmed@example.com",
    "role": "student"
  }
}
```

### Courses Example

```json
{
  "success": true,
  "courses": [
    {
      "id": 1,
      "title": "Laravel Basics",
      "slug": "laravel-basics",
      "price": 0,
      "level": "beginner"
    }
  ]
}
```

---

## 5) How the Frontend Uses the API

The frontend uses:
- `fetch` with headers
- `Authorization: Bearer token` when needed
- `API_BASE_URL = http://localhost:8000/api`

This means that when a user logs in or requests protected data, the frontend sends the token along with the request.

---

## 6) How to Run the Project

### Backend
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 7) Quick Summary

- **backend** = where the logic, database, and API live
- **frontend** = where the interface and user interaction live
- **the API** uses JSON responses and Sanctum tokens for authentication

If you want, I can also turn this into a more professional README with a full endpoint table and clearer setup instructions.
