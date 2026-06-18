import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Clock, Filter, BookOpen, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../context/AuthContext';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('all');
  const [price, setPrice] = useState('all');

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (level !== 'all') params.append('level', level);
      if (price !== 'all') params.append('price', price);

      const res = await fetch(`${API_BASE_URL}/courses?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setCourses(data.courses);
      }
    } catch (err) {
      console.error('Error fetching catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search slightly
    const timer = setTimeout(() => {
      fetchCourses();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, level, price]);

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '3rem' }}>
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Course Catalog</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Explore frontend and backend courses designed by industry experts</p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '280px 1fr', 
        gap: '2.5rem',
        alignItems: 'start'
      }} className="catalog-layout">
        
        {/* Sidebar Filters */}
        <aside className="card" style={{ padding: '1.5rem', position: 'sticky', top: '100px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <Filter size={18} style={{ color: 'var(--color-primary)' }} />
            <h3 style={{ fontSize: '1.15rem' }}>Filter Options</h3>
          </div>

          {/* Search bar */}
          <div className="form-group">
            <label className="form-label">Search Keywords</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Laravel, React, hooks..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          {/* Level Filter */}
          <div className="form-group" style={{ marginTop: '1.5rem' }}>
            <label className="form-label">Difficulty Level</label>
            <select 
              className="form-control"
              value={level}
              onChange={e => setLevel(e.target.value)}
              style={{ cursor: 'pointer' }}
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {/* Price Filter */}
          <div className="form-group" style={{ marginTop: '1.5rem' }}>
            <label className="form-label">Pricing Type</label>
            <select 
              className="form-control"
              value={price}
              onChange={e => setPrice(e.target.value)}
              style={{ cursor: 'pointer' }}
            >
              <option value="all">All Courses</option>
              <option value="free">Free Courses</option>
              <option value="paid">Paid Courses</option>
            </select>
          </div>
        </aside>

        {/* Catalog List */}
        <main>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {[1, 2, 4].map(i => (
                <div key={i} className="card" style={{ height: '380px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="skeleton" style={{ height: '160px', width: '100%' }}></div>
                  <div className="skeleton" style={{ height: '24px', width: '80%' }}></div>
                  <div className="skeleton" style={{ height: '40px', width: '100%' }}></div>
                </div>
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', borderStyle: 'dashed' }}>
              <AlertCircle size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Courses Found</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                We couldn't find any courses matching your keywords or filter parameters.
              </p>
              <button 
                onClick={() => { setSearch(''); setLevel('all'); setPrice('all'); }} 
                className="btn btn-secondary"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {courses.map(course => (
                <div key={course.id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', height: '160px' }}>
                    <img 
                      src={course.thumbnail} 
                      alt={course.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <span className={`badge badge-${course.level}`} style={{ position: 'absolute', top: '10px', left: '10px' }}>
                      {course.level}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={12} />
                        {course.duration} hrs
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Star size={12} style={{ fill: '#fbbf24', color: '#fbbf24' }} />
                        {course.average_rating}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', lineHeight: 1.3 }}>{course.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem', flex: 1 }}>
                      {course.short_description}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: 'auto' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Instructor</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block' }}>{course.instructor.name}</span>
                      </div>
                      <span style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                        {course.price > 0 ? `$${course.price}` : 'Free'}
                      </span>
                    </div>

                    <Link 
                      to={`/courses/${course.slug}`} 
                      className="btn btn-primary btn-sm" 
                      style={{ marginTop: '1rem', width: '100%' }}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
