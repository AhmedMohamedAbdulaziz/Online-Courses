<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Course extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'short_description',
        'thumbnail',
        'price',
        'level',
        'duration',
        'instructor_id',
    ];

    protected $appends = ['average_rating', 'reviews_count'];

    /**
     * Get the instructor that authored the course.
     */
    public function instructor()
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    /**
     * Get the lessons for the course.
     */
    public function lessons()
    {
        return $this->hasMany(Lesson::class)->orderBy('sort_order', 'asc');
    }

    /**
     * Get all enrollments for this course.
     */
    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    /**
     * Get all reviews for this course.
     */
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Attribute for average rating.
     */
    public function getAverageRatingAttribute()
    {
        return round($this->reviews()->avg('rating') ?? 0, 1);
    }

    /**
     * Attribute for review count.
     */
    public function getReviewsCountAttribute()
    {
        return $this->reviews()->count();
    }
}
