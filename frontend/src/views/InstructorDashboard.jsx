import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit2, Trash2, Users, DollarSign, Star, BookOpen, Settings } from 'lucide-react';

export default function InstructorDashboard() {
  const { apiCall } = useAuth();
  
  const [stats, setStats] = useState({ total_courses: 0, total_students: 0, total_earnings: 0, average_rating: 0 });
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInstructorDashboard = async () => {
    try {
      const res = await apiCall('/instructor/dashboard');
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setCourses(data.courses);
      }
    } catch (err) {
      console.error('Error loading instructor stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructorDashboard();
  }, []);

  const handleDeleteCourse = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This will permanently delete all associated lessons and enrollments.`)) {
      return;
    }

    try {
      const res = await apiCall(`/courses/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (res.ok && data.success) {
        alert('Course deleted successfully.');
        // Refresh dashboard
        fetchInstructorDashboard();
      } else {
        alert(data.message || 'Failed to delete course.');
      }
    } catch (err) {
      alert('Connection error deleting course.');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>
        <h2>Loading Instructor Panel...</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginTop: '2rem' }}>
          {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: '120px' }}></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Instructor Panel</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your catalog, analyze course performance, and build curriculum</p>
        </div>
        <Link to="/instructor/courses/new" className="btn btn-primary" style={{ gap: '0.35rem' }}>
          <Plus size={18} />
          <span>Create Course</span>
        </Link>
      </div>

      {/* Stats Counter Rows */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }} className="stats-row">
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.5rem' }}>{stats.total_courses}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Total Courses</p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', background: 'rgba(14, 165, 233, 0.1)', color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
            <Users size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.5rem' }}>{stats.total_students}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Enrolled Students</p>
          </div>
        </div>

        <div className="card card-glowing-green" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.5rem' }}>${stats.total_earnings}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Simulation Revenue</p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
            <Star size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.5rem' }}>{stats.average_rating}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Average Rating</p>
          </div>
        </div>
      </section>

      {/* Courses List */}
      <section>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>My Author Space</h2>

        {courses.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', borderStyle: 'dashed' }}>
            <BookOpen size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Courses Created Yet</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              Publish your first course to begin teaching backend or frontend technologies.
            </p>
            <Link to="/instructor/courses/new" className="btn btn-primary">Create Your First Course</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {courses.map(course => (
              <div 
                key={course.id} 
                className="card" 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '180px 1fr 260px', 
                  gap: '2rem', 
                  alignItems: 'center',
                  padding: '1.5rem'
                }}
              >
                <img 
                  src={course.thumbnail} 
                  alt={course.title} 
                  style={{ width: '100%', height: '120px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                />

                <div>
                  <span className={`badge badge-${course.level}`} style={{ marginBottom: '0.5rem' }}>
                    {course.level}
                  </span>
                  <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>{course.title}</h3>
                  
                  <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.75rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Users size={14} />
                      {course.enrollments_count} enrolled
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <BookOpen size={14} />
                      {course.lessons_count} lessons
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Star size={14} style={{ fill: '#fbbf24', color: '#fbbf24' }} />
                      {course.average_rating} ({course.reviews_count} reviews)
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '2rem' }} className="card-actions-layout">
                  <Link to={`/instructor/courses/${course.id}/edit`} className="btn btn-primary btn-sm" style={{ gap: '0.25rem' }}>
                    <Edit2 size={12} />
                    <span>Edit / Manage Syllabus</span>
                  </Link>
                  <button 
                    onClick={() => handleDeleteCourse(course.id, course.title)} 
                    className="btn btn-danger btn-sm" 
                    style={{ gap: '0.25rem' }}
                  >
                    <Trash2 size={12} />
                    <span>Delete Course</span>
                  </button>
                  <Link to={`/courses/${course.slug}`} className="btn btn-secondary btn-sm" style={{ textAlign: 'center' }}>
                    View Public Page
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
