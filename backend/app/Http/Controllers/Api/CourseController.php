<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Review;
use App\Http\Requests\CourseRequest;
use App\Http\Requests\StoreReviewRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CourseController extends Controller
{
    private function normalizeThumbnail($thumbnail)
    {
        if (!$thumbnail) {
            return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=60';
        }

        if (filter_var($thumbnail, FILTER_VALIDATE_URL)) {
            return $thumbnail;
        }

        return url($thumbnail);
    }

    /**
     * Get list of courses with filtering and search.
     */
    public function index(Request $request)
    {
        $query = Course::with(['instructor:id,name']);

        // Search by title or description
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('short_description', 'like', "%{$search}%");
            });
        }

        // Filter by difficulty level
        if ($request->has('level') && $request->level !== 'all' && !empty($request->level)) {
            $query->where('level', $request->level);
        }

        // Filter by price range
        if ($request->has('price') && !empty($request->price)) {
            if ($request->price === 'free') {
                $query->where('price', 0);
            } elseif ($request->price === 'paid') {
                $query->where('price', '>', 0);
            }
        }

        $courses = $query->latest()->get();
        $courses->each(function ($course) {
            $course->thumbnail = $this->normalizeThumbnail($course->thumbnail);
        });

        return response()->json([
            'success' => true,
            'courses' => $courses
        ]);
    }

    /**
     * Get course details, syllabus (hiding videos if not enrolled), and reviews.
     */
    public function show(Request $request, $slug)
    {
        $course = Course::where('slug', $slug)
            ->with(['instructor:id,name,email', 'reviews.user:id,name'])
            ->first();

        if (!$course) {
            return response()->json([
                'success' => false,
                'message' => 'Course not found.'
            ], 404);
        }

        $course->thumbnail = $this->normalizeThumbnail($course->thumbnail);

        // Check if user is enrolled, is the instructor, or is an admin
        $isEnrolled = false;
        $enrollment = null;
        $isAuthor = false;

        $user = auth('sanctum')->user();
        if ($user) {
            $isAuthor = ($course->instructor_id === $user->id) || ($user->role === 'admin');
            $enrollment = Enrollment::where('user_id', $user->id)
                ->where('course_id', $course->id)
                ->first();
            if ($enrollment) {
                $isEnrolled = true;
            }
        }

        // Fetch lessons, modify video_url depending on authorization
        $lessons = $course->lessons()->get();

        if (!$isEnrolled && !$isAuthor) {
            // Protect content: strip video URLs for non-enrolled students
            $lessons = $lessons->map(function ($lesson) {
                $lesson->video_url = null; // Hide actual video
                $lesson->description = Str::limit($lesson->description, 60); // Preview description
                return $lesson;
            });
        }

        return response()->json([
            'success' => true,
            'course' => $course,
            'lessons' => $lessons,
            'is_enrolled' => $isEnrolled,
            'is_author' => $isAuthor,
            'enrollment_details' => $enrollment
        ]);
    }

    /**
     * Store a new course (Instructor/Admin only).
     */
    public function store(CourseRequest $request)
    {
        $user = $request->user();
        if ($user->role !== 'instructor' && $user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Only instructors can create courses.'
            ], 403);
        }

        $slug = Str::slug($request->title);
        // Ensure slug is unique
        $originalSlug = $slug;
        $count = 1;
        while (Course::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $count;
            $count++;
        }

        $thumbnail = $request->thumbnail;
        if ($request->hasFile('thumbnail_file')) {
            $path = $request->file('thumbnail_file')->store('thumbnails', 'public');
            $thumbnail = asset('storage/' . $path);
        } elseif (empty($thumbnail)) {
            $thumbnail = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=60';
        }

        $course = Course::create([
            'title' => $request->title,
            'slug' => $slug,
            'description' => $request->description,
            'short_description' => $request->short_description,
            'thumbnail' => $thumbnail,
            'price' => $request->price,
            'level' => $request->level,
            'duration' => $request->duration,
            'instructor_id' => $user->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Course created successfully.',
            'course' => $course
        ], 201);
    }

    /**
     * Update a course (Instructor/Admin only).
     */
    public function update(CourseRequest $request, $id)
    {
        $course = Course::find($id);
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

        $thumbnail = $request->thumbnail ?? $course->thumbnail;
        if ($request->hasFile('thumbnail_file')) {
            if ($course->thumbnail && str_contains($course->thumbnail, '/storage/thumbnails/')) {
                $oldPath = str_replace(asset('storage/'), '', $course->thumbnail);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('thumbnail_file')->store('thumbnails', 'public');
            $thumbnail = asset('storage/' . $path);
        }

        $course->update([
            'title' => $request->title,
            'slug' => Str::slug($request->title) !== $course->slug ? Str::slug($request->title) : $course->slug,
            'description' => $request->description,
            'short_description' => $request->short_description,
            'thumbnail' => $thumbnail,
            'price' => $request->price,
            'level' => $request->level,
            'duration' => $request->duration,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Course updated successfully.',
            'course' => $course
        ]);
    }

    /**
     * Delete a course.
     */
    public function destroy(Request $request, $id)
    {
        $course = Course::find($id);
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

        $course->delete();

        return response()->json([
            'success' => true,
            'message' => 'Course deleted successfully.'
        ]);
    }

    /**
     * Add a review to a course (Students only).
     */
    public function storeReview(StoreReviewRequest $request, $id)
    {
        $course = Course::find($id);
        if (!$course) {
            return response()->json([
                'success' => false,
                'message' => 'Course not found.'
            ], 404);
        }

        $user = $request->user();

        // Ensure user is enrolled
        $isEnrolled = Enrollment::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->exists();

        if (!$isEnrolled) {
            return response()->json([
                'success' => false,
                'message' => 'You must be enrolled in the course to leave a review.'
            ], 403);
        }

        // Add or update review
        $review = Review::updateOrCreate(
            ['user_id' => $user->id, 'course_id' => $course->id],
            ['rating' => $request->rating, 'comment' => $request->comment]
        );

        return response()->json([
            'success' => true,
            'message' => 'Review submitted successfully.',
            'review' => $review
        ]);
    }
}
