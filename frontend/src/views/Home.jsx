import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Clock, BookOpen, User, Zap, Shield, Sparkles } from 'lucide-react';
import { API_BASE_URL } from '../context/AuthContext';

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/courses`);
        if (res.ok) {
          const data = await res.json();
          // Display top 3 courses on landing page
          setCourses(data.courses.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section style={{ padding: '6rem 0 4rem 0', textAlign: 'center', position: 'relative' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            color: 'var(--color-primary)',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '2rem'
          }}>
            <Sparkles size={14} />
            <span>The Next Gen of Dev Learning</span>
          </div>

          <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', lineHeight: 1.1 }}>
            Master <span style={{ background: 'linear-gradient(135deg, #a5b4fc 0%, var(--color-primary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>New Skills</span> & <span style={{ background: 'linear-gradient(135deg, #38bdf8 0%, var(--color-secondary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Online Learning</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '2.5rem', lineHeight: 1.5, maxWidth: '700px', margin: '0 auto 2.5rem auto' }}>
          Advance your career with expert-led online courses designed to help you learn in-demand skills. Explore interactive lessons, real-world projects, and practical training across technology, business, design, and more.          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem' }}>
            <Link to="/courses" className="btn btn-primary" style={{ padding: '0.9rem 2rem', gap: '0.5rem' }}>
              <span>Explore Courses</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/register" className="btn btn-secondary" style={{ padding: '0.9rem 2rem' }}>
              Join for Free
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section style={{ padding: '2rem 0', margin: '2rem 0' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '2rem',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            textAlign: 'center'
          }} className="stats-container">
            <div>
              <h3 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>12k+</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>Active Learners</p>
            </div>
            <div>
              <h3 style={{ fontSize: '2.5rem', color: 'var(--color-primary)', marginBottom: '0.25rem' }}>4.9</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>Average Rating</p>
            </div>
            <div>
              <h3 style={{ fontSize: '2.5rem', color: 'var(--color-secondary)', marginBottom: '0.25rem' }}>45+</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>Expert Classes</p>
            </div>
            <div>
              <h3 style={{ fontSize: '2.5rem', color: 'var(--color-accent)', marginBottom: '0.25rem' }}>99.2%</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>Success Ratio</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>Why Learn on EduSphere?</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            EduSphere provides high-quality online learning experiences designed to help students, professionals, and lifelong learners achieve their goals.            </p>
          </div>

          <div className="grid-3">
            <div className="card">
              <div style={{
                background: 'rgba(99, 102, 241, 0.1)',
                color: 'var(--color-primary)',
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <Zap size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Flexible Learning</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Study anytime, anywhere with self-paced courses that fit your schedule and learning style.              </p>
            </div>

            <div className="card">
              <div style={{
                background: 'rgba(14, 165, 233, 0.1)',
                color: 'var(--color-secondary)',
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <Shield size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Expert Instructors</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Learn from experienced professionals and industry experts who share practical knowledge and real-world insights.              </p>
            </div>

            <div className="card card-glowing-green">
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                color: 'var(--color-accent)',
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <BookOpen size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Hands-On Projects</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Apply your knowledge through assignments, projects, and interactive exercises that reinforce learning.
                            </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Grid */}
      <section style={{ padding: '4rem 0', backgroundColor: 'rgba(255, 255, 255, 0.01)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem' }}>
            <div>
              <h2 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Featured Courses</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Handpicked learning tracks to kickstart your web dev career</p>
            </div>
            <Link to="/courses" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span>View All</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="grid-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="card" style={{ height: '380px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="skeleton" style={{ height: '180px', width: '100%', borderRadius: 'var(--radius-md)' }}></div>
                  <div className="skeleton" style={{ height: '28px', width: '80%' }}></div>
                  <div className="skeleton" style={{ height: '40px', width: '100%' }}></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid-3">
              {courses.map(course => (
                <div key={course.id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', height: '180px' }}>
                    <img 
                      src={course.thumbnail} 
                      alt={course.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'var(--transition-slow)' }}
                      onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                    />
                    <span 
                      className={`badge badge-${course.level}`} 
                      style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 1, boxShadow: 'var(--shadow-sm)' }}
                    >
                      {course.level}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={14} />
                        {course.duration} hrs
                      </span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Star size={14} style={{ fill: '#fbbf24', color: '#fbbf24' }} />
                        {course.average_rating} ({course.reviews_count})
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', lineHeight: 1.3 }}>{course.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1 }}>
                      {course.short_description}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: 'auto' }}>
                      <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Instructor</span>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{course.instructor.name}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                          {course.price > 0 ? `$${course.price}` : 'Free'}
                        </span>
                      </div>
                    </div>

                    <Link 
                      to={`/courses/${course.slug}`} 
                      className="btn btn-primary" 
                      style={{ marginTop: '1.25rem', width: '100%' }}
                    >
                      <span>View Course Details</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '6rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>What Our Students Say</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Loved by developers around the globe</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem', color: '#fbbf24' }}>
                {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="currentColor" />)}
              </div>
              <p style={{ fontStyle: 'italic', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                "The React 19 course is phenomenal. The instructor covers state transitions and compile changes in detail. Using the custom API integration with Laravel made it completely click."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>AM</div>
                <div>
                  <h4 style={{ fontSize: '0.95rem' }}>Alex Martinez</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Frontend Engineer</p>
                </div>
              </div>
            </div>

            <div className="card card-glowing-green" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem', color: '#fbbf24' }}>
                {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="currentColor" />)}
              </div>
              <p style={{ fontStyle: 'italic', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                "Setting up Laravel Sanctum API auth with token requests used to be a hassle. Jane breaks it down so simply. The course player dashboard is extremely premium and sleek!"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>SK</div>
                <div>
                  <h4 style={{ fontSize: '0.95rem' }}>Sarah Koenig</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Fullstack Developer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
