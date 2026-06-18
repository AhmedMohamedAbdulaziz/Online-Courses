<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Lesson extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'course_id',
        'title',
        'description',
        'video_url',
        'duration',
        'sort_order',
    ];

    /**
     * Get the course that this lesson belongs to.
     */
    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
