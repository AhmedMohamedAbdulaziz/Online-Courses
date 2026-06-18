import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Clock, Star, BookOpen, AlertCircle, Play, User, MessageSquare, Send } from 'lucide-react';
import { API_BASE_URL } from '../context/AuthContext';

export default function CourseDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, token, apiCall } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Review Form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSubmitLoading, setReviewSubmitLoading] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState('');

  const fetchCourseDetails = async () => {
    try {
      // Fetch details using auth header optionally to discover enrollment status
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_BASE_URL}/courses/${slug}`, { headers });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setCourse(data.course);
        setLessons(data.lessons);
        setIsEnrolled(data.is_enrolled);
        setIsAuthor(data.is_author);
      } else {
        setError(data.message || 'Failed to fetch course details.');
      }
    } catch (err) {
      setError('Connection failed. Please check backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseDetails();
  }, [slug, token]);

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/courses/${slug}` } });
      return;
    }

    setLoading(true);
    try {
      const res = await apiCall(`/courses/${course.id}/enroll`, {
        method: 'POST',
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setIsEnrolled(true);
        navigate(`/learn/${slug}`);
      } else {
        alert(data.message || 'Enrollment failed.');
      }
    } catch (err) {
      alert('Network error during enrollment.');
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setReviewSubmitLoading(true);
    setReviewSuccessMsg('');
    try {
      const res = await apiCall(`/courses/${course.id}/reviews`, {
        method: 'POST',
        body: JSON.stringify({ rating, comment }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setReviewSuccessMsg('Review posted successfully!');
        setComment('');
        // Reload course to show new review and rating
        fetchCourseDetails();
      } else {
        alert(data.message || 'Failed to submit review.');
      }
    } catch (err) {
      alert('Connection error submitting review.');
    } finally {
      setReviewSubmitLoading(false);
    }
  };

  if (loading && !course) {
    return (
      <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>
        <div className="skeleton" style={{ height: '350px', width: '100%', marginBottom: '2rem', borderRadius: 'var(--radius-lg)' }}></div>
        <div className="skeleton" style={{ height: '30px', width: '60%', margin: '0 auto 1rem auto' }}></div>
        <div className="skeleton" style={{ height: '20px', width: '40%', margin: '0 auto' }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ paddingTop: '6rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <AlertCircle size={48} style={{ color: '#f87171', marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Error Loading Course</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{error}</p>
          <Link to="/courses" className="btn btn-secondary">Back to Catalog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="course-detail-page animate-fade-in">
      <section className="course-detail-hero">
        <div className="container details-banner-layout">
          <div className="course-detail-info">
            <span className={`badge badge-${course.level}`} style={{ marginBottom: '1rem' }}>
              {course.level}
            </span>
            <h1>{course.title}</h1>
            <p className="course-detail-summary">{course.short_description}</p>

            <div className="course-meta-row">
              <span className="course-meta-chip">
                <Clock size={15} />
                {course.duration} hours
              </span>
              <span className="course-meta-chip">
                <Star size={15} style={{ fill: '#fbbf24', color: '#fbbf24' }} />
                {course.average_rating} ({course.reviews_count} reviews)
              </span>
              <span className="course-meta-chip">
                <BookOpen size={15} />
                {lessons.length} lessons
              </span>
              <span className="course-meta-chip">
                <User size={15} />
                {course.instructor.name}
              </span>
            </div>
          </div>

          <div className="card course-purchase-card card-static">
            <div className="course-purchase-card__thumb">
              <img src={course.thumbnail} alt={course.title} />
            </div>
            <div className="course-purchase-card__body">
              <div className="course-purchase-card__price">
                <span className="course-purchase-card__price-label">Price</span>
                <span className="course-purchase-card__price-value">
                  {course.price > 0 ? `$${course.price}` : 'Free'}
                </span>
              </div>

              {isEnrolled ? (
                <Link to={`/learn/${course.slug}`} className="btn btn-accent" style={{ width: '100%' }}>
                  <Play size={16} fill="currentColor" />
                  <span>Resume Learning</span>
                </Link>
              ) : isAuthor ? (
                <Link to="/instructor" className="btn btn-secondary" style={{ width: '100%' }}>
                  Manage Course
                </Link>
              ) : (
                <button onClick={handleEnroll} className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                  {user ? 'Enroll Now' : 'Sign In to Enroll'}
                </button>
              )}

              <p className="course-purchase-card__note">
                Instant lifetime access · Certificate included
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container details-body-layout">
        <div>
          <div className="course-section">
            <h2 className="course-section-title">About This Course</h2>
            <p className="course-description">{course.description}</p>
          </div>

          <div className="course-section">
            <h2 className="course-section-title">
              Course Curriculum
              <span>{lessons.length} lessons</span>
            </h2>

            <div className="curriculum-list">
              {lessons.map((lesson, index) => (
                <div key={lesson.id} className="curriculum-item">
                  <div className="curriculum-item__left">
                    <span className="curriculum-item__index">{index + 1}</span>
                    <div>
                      <h4 className="curriculum-item__title">{lesson.title}</h4>
                      <p className="curriculum-item__desc">
                        {lesson.description || 'No description provided.'}
                      </p>
                    </div>
                  </div>
                  <span className="curriculum-item__duration">
                    <Clock size={13} />
                    {lesson.duration}m
                  </span>
                </div>
              ))}
            </div>

            {!isEnrolled && !isAuthor && (
              <div className="curriculum-locked">
                Enroll in this course to unlock all video lectures and resources.
              </div>
            )}
          </div>
        </div>

        <aside className="reviews-sidebar">
          <h2 className="course-section-title">Student Reviews</h2>

          {isEnrolled && (
            <div className="review-form-card card-static">
              <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageSquare size={16} />
                <span>Write a Review</span>
              </h3>

              <form onSubmit={submitReview}>
                <div className="form-group">
                  <label className="form-label">Rating</label>
                  <select
                    className="form-control"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                  >
                    <option value={5}>5 — Excellent</option>
                    <option value={4}>4 — Good</option>
                    <option value={3}>3 — Average</option>
                    <option value={2}>2 — Below average</option>
                    <option value={1}>1 — Poor</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Your feedback</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Describe your learning experience..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={reviewSubmitLoading}
                  style={{ width: '100%' }}
                >
                  <Send size={12} />
                  <span>Submit Review</span>
                </button>

                {reviewSuccessMsg && (
                  <p style={{ color: 'var(--color-accent)', fontSize: '0.85rem', marginTop: '0.75rem', textAlign: 'center', fontWeight: 600 }}>
                    {reviewSuccessMsg}
                  </p>
                )}
              </form>
            </div>
          )}

          <div className="reviews-list">
            {course.reviews.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                No reviews yet. Be the first to enroll and leave feedback!
              </p>
            ) : (
              course.reviews.map((review) => (
                <div key={review.id} className="review-card card-static">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{review.user.name}</span>
                    <div style={{ display: 'flex', gap: '0.1rem', color: '#fbbf24' }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={12} fill={i < review.rating ? 'currentColor' : 'none'} />
                      ))}
                    </div>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {review.comment}
                  </p>
                </div>
              ))
            )}
          </div>
        </aside>
      </section>
    </div>
  );
}
