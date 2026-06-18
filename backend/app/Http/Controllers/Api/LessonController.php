<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Lesson;
use App\Http\Requests\LessonRequest;
use Illuminate\Http\Request;

class LessonController extends Controller
{
    /**
     * Store a new lesson under a course (Instructor/Admin only).
     */
    public function store(LessonRequest $request, $courseId)
    {
        $course = Course::find($courseId);
        if (!$course) {
            return response()->json([
                'success' => false,
                'message' => 'Course not found.'
            ], 404);
        }

        $user = $request->user();
        if ($course->instructor_id !== $user->id && $user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. You do not own this course.'
            ], 403);
        }

        // Determine next sort order if not provided
        $sortOrder = $request->sort_order;
        if (is_null($sortOrder)) {
            $sortOrder = $course->lessons()->max('sort_order') + 1;
        }

        $videoUrl = $request->video_url;
        if ($request->hasFile('video_file')) {
            $path = $request->file('video_file')->store('videos', 'public');
            $videoUrl = asset('storage/' . $path);
        }

        $lesson = Lesson::create([
            'course_id' => $course->id,
            'title' => $request->title,
            'description' => $request->description,
            'video_url' => $videoUrl,
            'duration' => $request->duration,
            'sort_order' => $sortOrder,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Lesson created successfully.',
            'lesson' => $lesson
        ], 201);
    }

    /**
     * Update an existing lesson.
     */
    public function update(LessonRequest $request, $id)
    {
        $lesson = Lesson::with('course')->find($id);
        if (!$lesson) {
            return response()->json([
                'success' => false,
                'message' => 'Lesson not found.'
            ], 404);
        }

        $user = $request->user();
        if ($lesson->course->instructor_id !== $user->id && $user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. You do not own this course.'
            ], 403);
        }

        $videoUrl = $lesson->video_url;
        if ($request->hasFile('video_file')) {
            // Delete old local video file if exists
            if ($lesson->video_url && str_contains($lesson->video_url, '/storage/videos/')) {
                $oldPath = str_replace(asset('storage/'), '', $lesson->video_url);
                \Illuminate\Support\Facades\Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('video_file')->store('videos', 'public');
            $videoUrl = asset('storage/' . $path);
        } elseif ($request->has('video_url')) {
            $videoUrl = $request->video_url;
        }

        $lesson->update([
            'title' => $request->title,
            'description' => $request->description,
            'video_url' => $videoUrl,
            'duration' => $request->duration,
            'sort_order' => $request->sort_order,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Lesson updated successfully.',
            'lesson' => $lesson
        ]);
    }

    /**
     * Delete an existing lesson.
     */
    public function destroy(Request $request, $id)
    {
        $lesson = Lesson::with('course')->find($id);
        if (!$lesson) {
            return response()->json([
                'success' => false,
                'message' => 'Lesson not found.'
            ], 404);
        }

        $user = $request->user();
        if ($lesson->course->instructor_id !== $user->id && $user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. You do not own this course.'
            ], 403);
        }

        $lesson->delete();

        return response()->json([
            'success' => true,
            'message' => 'Lesson deleted successfully.'
        ]);
    }
}
