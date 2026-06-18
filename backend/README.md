# EduSphere — Backend API

Laravel 10 REST API for the EduSphere online courses platform. Handles authentication (Sanctum), course catalog, enrollments, lessons, reviews, and instructor management.

## Tech stack

- PHP 8.1+
- Laravel 10
- Laravel Sanctum (API tokens)
- MySQL

## Prerequisites

- [PHP](https://www.php.net/downloads) 8.1 or higher with extensions: `openssl`, `pdo`, `mbstring`, `tokenizer`, `xml`, `ctype`, `json`, `bcmath`
- [Composer](https://getcomposer.org/)
- [MySQL](https://dev.mysql.com/downloads/) (or MariaDB)

## Quick start

### 1. Install dependencies

```bash
cd backend
composer install
```

### 2. Environment setup

Copy the example environment file and generate an application key:

```bash
cp .env.example .env
php artisan key:generate
```

Edit `.env` and set your database credentials:

```env
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=online_courses
DB_USERNAME=root
DB_PASSWORD=your_password
```

Create the database in MySQL before running migrations:

```sql
CREATE DATABASE online_courses;
```

### 3. Run migrations and seed data

```bash
php artisan migrate
php artisan db:seed
```

This creates demo users, courses, lessons, and sample reviews.

### 4. Start the development server

```bash
php artisan serve
```

The API will be available at **http://localhost:8000**.

Test it in the browser or with curl:

```bash
curl http://localhost:8000/api/courses
```

## Demo accounts

After seeding, you can log in with these accounts (password for all: `password`):

| Role       | Email                  |
|------------|------------------------|
| Student    | `student@example.com`  |
| Instructor | `instructor@example.com` |
| Admin      | `admin@example.com`    |

## API overview

Base URL: `http://localhost:8000/api`

### Public endpoints

| Method | Endpoint              | Description              |
|--------|-----------------------|--------------------------|
| POST   | `/auth/register`      | Register a new user      |
| POST   | `/auth/login`         | Login and get API token  |
| GET    | `/courses`            | List all courses         |
| GET    | `/courses/{slug}`     | Course details + lessons |

### Protected endpoints (Bearer token required)

Send the token in the `Authorization` header:

```
Authorization: Bearer {your_token}
```

| Method | Endpoint                        | Description                    |
|--------|---------------------------------|--------------------------------|
| GET    | `/auth/me`                      | Current user profile           |
| POST   | `/auth/logout`                  | Revoke token                   |
| GET    | `/student/dashboard`            | Student enrollments & progress |
| POST   | `/courses/{courseId}/enroll`    | Enroll in a course             |
| POST   | `/lessons/{lessonId}/complete`  | Mark lesson complete           |
| POST   | `/courses/{courseId}/reviews`   | Submit a course review         |
| GET    | `/instructor/dashboard`         | Instructor stats & courses     |
| POST   | `/courses`                      | Create a course                |
| PUT    | `/courses/{id}`                 | Update a course                |
| DELETE | `/courses/{id}`                 | Delete a course                |
| POST   | `/courses/{courseId}/lessons`   | Add a lesson                   |
| PUT    | `/lessons/{id}`                 | Update a lesson                |
| DELETE | `/lessons/{id}`                 | Delete a lesson                |

## Project structure

```
backend/
├── app/
│   ├── Http/Controllers/Api/   # API controllers
│   └── Models/                 # Eloquent models
├── database/
│   ├── migrations/             # Database schema
│   └── seeders/                # Demo data
├── routes/
│   └── api.php                 # API route definitions
└── config/
    └── cors.php                # CORS settings (allows frontend)
```

## Common commands

```bash
# Fresh database with seed data
php artisan migrate:fresh --seed

# Clear application cache
php artisan cache:clear
php artisan config:clear

# Run tests
php artisan test
```

## Connecting the frontend

The React frontend expects the API at `http://localhost:8000/api`. Start the backend before the frontend so course data and authentication work correctly.

See the [frontend README](../frontend/README.md) for UI setup instructions.

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `SQLSTATE[HY000] [1049] Unknown database` | Create the `online_courses` database in MySQL |
| `No application encryption key` | Run `php artisan key:generate` |
| CORS errors from frontend | CORS is enabled for `api/*` in `config/cors.php` |
| 401 on protected routes | Include a valid `Authorization: Bearer` token |
| Empty course list | Run `php artisan db:seed` |
