import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Award, BarChart, Clock, Play } from 'lucide-react';

export default function StudentDashboard() {
  const { apiCall } = useAuth();
  const [stats, setStats] = useState({ total_enrolled: 0, in_progress: 0, completed: 0 });
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await apiCall('/student/dashboard');
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
          setEnrollments(data.enrollments);
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>
        <h2>Loading Student Dashboard...</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginTop: '2rem' }}>
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: '120px' }}></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '3rem' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>My Learning Space</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Track your progress, view credentials, and resume coding sessions</p>
      </div>

      {/* Stats row */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }} className="stats-row">
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.75rem' }}>{stats.total_enrolled}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Enrolled Courses</p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', background: 'rgba(14, 165, 233, 0.1)', color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
            <BarChart size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.75rem' }}>{stats.in_progress}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Courses In Progress</p>
          </div>
        </div>

        <div className="card card-glowing-green" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
            <Award size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.75rem' }}>{stats.completed}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Completed Tracks</p>
          </div>
        </div>
      </section>

      {/* Courses List */}
      <section>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>My Courses</h2>

        {enrollments.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', borderStyle: 'dashed' }}>
            <BookOpen size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Active Enrollments</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              You haven't enrolled in any courses yet. Start your journey by browsing our catalog.
            </p>
            <Link to="/courses" className="btn btn-primary">Browse Catalog</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {enrollments.map(enrollment => {
              const course = enrollment.course;
              return (
                <div 
                  key={enrollment.id} 
                  className={`card ${enrollment.completed ? 'card-glowing-green' : ''}`} 
                  style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '180px 1fr 240px', 
                    gap: '2rem', 
                    alignItems: 'center',
                    padding: '1.5rem'
                  }}
                  className="dashboard-card-layout"
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
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span>Instructor: <strong>{course.instructor.name}</strong></span>
                      <span>•</span>
                      <span>{course.lessons_count} lessons</span>
                    </p>

                    {/* Progress Bar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1.25rem' }}>
                      <div style={{ flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.05)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ 
                          width: `${enrollment.progress}%`, 
                          backgroundColor: enrollment.completed ? 'var(--color-accent)' : 'var(--color-primary)', 
                          height: '100%' 
                        }}></div>
                      </div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: enrollment.completed ? 'var(--color-accent)' : 'var(--color-primary)', width: '45px', textAlign: 'right' }}>
                        {enrollment.progress}%
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '2rem' }} className="card-actions-layout">
                    <Link to={`/learn/${course.slug}`} className={`btn ${enrollment.completed ? 'btn-accent' : 'btn-primary'}`} style={{ gap: '0.5rem' }}>
                      <Play size={16} fill="currentColor" />
                      <span>{enrollment.completed ? 'Review Lessons' : 'Resume Course'}</span>
                    </Link>
                    <Link to={`/courses/${course.slug}`} className="btn btn-secondary">
                      Course Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
