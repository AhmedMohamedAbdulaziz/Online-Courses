<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lesson;
use Illuminate\Http\Request;

class EnrollmentController extends Controller
{
    /**
     * Enroll user in a course (simulating enrollment success).
     */
    public function enroll(Request $request, $courseId)
    {
        $course = Course::find($courseId);
        if (!$course) {
            return response()->json([
                'success' => false,
                'message' => 'Course not found.'
            ], 404);
        }

        $user = $request->user();

        // Check if already enrolled
        $existing = Enrollment::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->first();

        if ($existing) {
            return response()->json([
                'success' => true,
                'message' => 'You are already enrolled in this course.',
                'enrollment' => $existing
            ]);
        }

        // Create enrollment
        $enrollment = Enrollment::create([
            'user_id' => $user->id,
            'course_id' => $course->id,
            'progress' => 0,
            'completed' => false,
            'completed_lessons' => [],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Successfully enrolled in course.',
            'enrollment' => $enrollment
        ], 201);
    }

    /**
     * Mark a lesson as complete/incomplete and update course progress.
     */
    public function completeLesson(Request $request, $lessonId)
    {
        $lesson = Lesson::find($lessonId);
        if (!$lesson) {
            return response()->json([
                'success' => false,
                'message' => 'Lesson not found.'
            ], 404);
        }

        $user = $request->user();

        // Find enrollment
        $enrollment = Enrollment::where('user_id', $user->id)
            ->where('course_id', $lesson->course_id)
            ->first();

        if (!$enrollment) {
            return response()->json([
                'success' => false,
                'message' => 'You are not enrolled in this course.'
            ], 403);
        }

        $completedLessons = array_map('strval', $enrollment->completed_lessons ?? []);
        $lessonId = (string) $lessonId;

        // Toggle completion status
        if (in_array($lessonId, $completedLessons, true)) {
            // Mark incomplete
            $completedLessons = array_values(array_filter($completedLessons, function ($id) use ($lessonId) {
                return $id !== $lessonId;
            }));
        } else {
            // Mark complete
            $completedLessons[] = $lessonId;
        }

        // Get total lessons
        $totalLessons = Lesson::where('course_id', $lesson->course_id)->count();

        // Calculate progress percentage
        $progress = $totalLessons > 0 ? (int)round((count($completedLessons) / $totalLessons) * 100) : 0;
        $completed = $progress >= 100;

        $enrollment->update([
            'completed_lessons' => $completedLessons,
            'progress' => $progress,
            'completed' => $completed
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Lesson completion toggled.',
            'enrollment' => $enrollment
        ]);
    }
}
