<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\LessonController;
use App\Http\Controllers\Api\EnrollmentController;
use App\Http\Controllers\Api\DashboardController;

// Public Auth Routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Public Course Catalog Routes
Route::get('/courses', [CourseController::class, 'index']);
Route::get('/courses/{slug}', [CourseController::class, 'show']);

// Authenticated API Routes (Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    // Auth & Identity
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Student Dashboard & Learning Actions
    Route::get('/student/dashboard', [DashboardController::class, 'studentDashboard']);
    Route::post('/courses/{courseId}/enroll', [EnrollmentController::class, 'enroll']);
    Route::post('/lessons/{lessonId}/complete', [EnrollmentController::class, 'completeLesson']);
    Route::post('/courses/{courseId}/reviews', [CourseController::class, 'storeReview']);

    // Instructor Dashboard & Management Actions
    Route::get('/instructor/dashboard', [DashboardController::class, 'instructorDashboard']);
    Route::post('/courses', [CourseController::class, 'store']);
    Route::put('/courses/{id}', [CourseController::class, 'update']);
    Route::delete('/courses/{id}', [CourseController::class, 'destroy']);

    Route::post('/courses/{courseId}/lessons', [LessonController::class, 'store']);
    Route::put('/lessons/{id}', [LessonController::class, 'update']);
    Route::delete('/lessons/{id}', [LessonController::class, 'destroy']);

    // Admin Dashboard & Management Actions
    Route::get('/admin/dashboard', [DashboardController::class, 'adminDashboard']);
    Route::post('/admin/users', [DashboardController::class, 'storeUser']);
    Route::put('/admin/users/{id}', [DashboardController::class, 'updateUser']);
    Route::delete('/admin/users/{id}', [DashboardController::class, 'destroyUser']);
    Route::delete('/admin/enrollments/{id}', [DashboardController::class, 'destroyEnrollment']);
});
