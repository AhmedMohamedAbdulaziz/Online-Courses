<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Review;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class DashboardController extends Controller
{
    /**
     * Get statistics and courses for student dashboard.
     */
    public function studentDashboard(Request $request)
    {
        $user = $request->user();

        $enrollments = Enrollment::where('user_id', $user->id)
            ->with(['course.instructor:id,name', 'course' => function($query) {
                $query->withCount('lessons');
            }])
            ->latest()
            ->get();

        $stats = [
            'total_enrolled' => $enrollments->count(),
            'in_progress' => $enrollments->where('completed', false)->count(),
            'completed' => $enrollments->where('completed', true)->count(),
        ];

        return response()->json([
            'success' => true,
            'stats' => $stats,
            'enrollments' => $enrollments
        ]);
    }

    /**
     * Get statistics and courses for instructor dashboard.
     */
    public function instructorDashboard(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'instructor' && $user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Only instructors can access the instructor dashboard.'
            ], 403);
        }

        // Fetch courses created by this instructor
        $coursesQuery = Course::where('instructor_id', $user->id)
            ->withCount(['lessons', 'enrollments'])
            ->latest();

        $courses = $coursesQuery->get();

        // Calculate Stats
        $totalCourses = $courses->count();
        $totalStudents = $courses->sum('enrollments_count');
        $totalEarnings = 0;
        
        foreach ($courses as $course) {
            $totalEarnings += $course->price * $course->enrollments_count;
        }

        // Get reviews for all instructor courses
        $courseIds = $courses->pluck('id');
        $avgRating = round(Review::whereIn('course_id', $courseIds)->avg('rating') ?? 0, 1);

        $stats = [
            'total_courses' => $totalCourses,
            'total_students' => $totalStudents,
            'total_earnings' => round($totalEarnings, 2),
            'average_rating' => $avgRating,
        ];

        return response()->json([
            'success' => true,
            'stats' => $stats,
            'courses' => $courses
        ]);
    }

    /**
     * Get statistics and data for admin dashboard.
     */
    public function adminDashboard(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Only admins can access the admin dashboard.'
            ], 403);
        }

        // Stats
        $studentsCount = User::where('role', 'student')->count();
        $instructorsCount = User::where('role', 'instructor')->count();
        $coursesCount = Course::count();
        $enrollmentsCount = Enrollment::count();

        // Total Revenue
        $enrollments = Enrollment::with('course')->get();
        $totalRevenue = 0;
        foreach ($enrollments as $enrollment) {
            if ($enrollment->course) {
                $totalRevenue += $enrollment->course->price;
            }
        }

        // Recent Activity
        $users = User::latest()->get(['id', 'name', 'email', 'role', 'created_at']);
        $courses = Course::with('instructor:id,name')->latest()->get();
        $recentUsers = $users->take(5)->values();
        $recentCourses = $courses->take(5)->values();
        $recentEnrollments = Enrollment::with(['user:id,name,email', 'course:id,title,price'])
            ->latest()
            ->take(5)
            ->get();
        $allEnrollments = Enrollment::with(['user:id,name,email', 'course:id,title,price'])
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'stats' => [
                'total_students' => $studentsCount,
                'total_instructors' => $instructorsCount,
                'total_courses' => $coursesCount,
                'total_enrollments' => $enrollmentsCount,
                'total_revenue' => round($totalRevenue, 2),
            ],
            'recent_users' => $recentUsers,
            'recent_courses' => $recentCourses,
            'recent_enrollments' => $recentEnrollments,
            'users' => $users,
            'courses' => $courses,
            'enrollments' => $allEnrollments,
        ]);
    }

    private function ensureAdmin(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Only admins can manage this resource.'
            ], 403);
        }

        return null;
    }

    public function storeUser(Request $request)
    {
        if ($response = $this->ensureAdmin($request)) {
            return $response;
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
            'role' => ['required', Rule::in(['student', 'instructor', 'admin'])],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'User created successfully.',
            'user' => $user,
        ], 201);
    }

    public function updateUser(Request $request, $id)
    {
        if ($response = $this->ensureAdmin($request)) {
            return $response;
        }

        $user = User::findOrFail($id);
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['nullable', 'string', 'min:6'],
            'role' => ['required', Rule::in(['student', 'instructor', 'admin'])],
        ]);

        $payload = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
        ];

        if (!empty($validated['password'])) {
            $payload['password'] = Hash::make($validated['password']);
        }

        $user->update($payload);

        return response()->json([
            'success' => true,
            'message' => 'User updated successfully.',
            'user' => $user,
        ]);
    }

    public function destroyUser(Request $request, $id)
    {
        if ($response = $this->ensureAdmin($request)) {
            return $response;
        }

        if ($request->user()->id === $id) {
            return response()->json([
                'success' => false,
                'message' => 'You cannot delete your own admin account.'
            ], 422);
        }

        User::findOrFail($id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully.'
        ]);
    }

    public function destroyEnrollment(Request $request, $id)
    {
        if ($response = $this->ensureAdmin($request)) {
            return $response;
        }

        Enrollment::findOrFail($id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Enrollment deleted successfully.'
        ]);
    }
}
