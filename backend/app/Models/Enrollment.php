<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Enrollment extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'course_id',
        'progress',
        'completed',
        'completed_lessons',
    ];

    protected $casts = [
        'completed_lessons' => 'array',
        'completed' => 'boolean',
    ];

    /**
     * Get the student/user.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the course.
     */
    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
