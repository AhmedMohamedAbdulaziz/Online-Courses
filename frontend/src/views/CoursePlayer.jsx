import React, { useRef, useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Play, CheckSquare, Square, ChevronLeft, Award, BookOpen, Clock, AlertCircle, Download } from 'lucide-react';
import { API_BASE_URL } from '../context/AuthContext';
import './CoursePlayer.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function CoursePlayer() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, apiCall } = useAuth();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  
  // Progress states
  const [completedLessonIds, setCompletedLessonIds] = useState([]);
  const [progressPercent, setProgressPercent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoError, setVideoError] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const videoRef = useRef(null);
  const allowedVideoTime = useRef(0);

  const normalizeVideoUrl = (url) => {
    if (!url) return '';

    if (/^https?:\/\//i.test(url)) {
      const driveMatch = url.match(/(?:drive\.google\.com\/file\/d\/|drive\.google\.com\/open\?id=)([^/&?#]+)/i);
      if (driveMatch) {
      return `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
      }

      const shareMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/i);
      if (shareMatch) {
        return `https://drive.google.com/uc?export=view&id=${shareMatch[1]}`;
      }

      return url;
    }

    return `${API_BASE_URL.replace('/api', '')}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const normalizedVideoUrl = currentLesson?.video_url ? normalizeVideoUrl(currentLesson.video_url) : '';

  const fetchCourseData = async () => {
    try {
      const res = await apiCall(`/courses/${slug}`);
      const data = await res.json();

      if (res.ok && data.success) {
        if (!data.is_enrolled && !data.is_author) {
          // Force back to details if not enrolled
          navigate(`/courses/${slug}`);
          return;
        }
        
        setCourse(data.course);
        setLessons(data.lessons);
        
        // Load progress details
        if (data.enrollment_details) {
          setCompletedLessonIds(data.enrollment_details.completed_lessons || []);
          setProgressPercent(data.enrollment_details.progress || 0);
        }

        // Default to first lesson if not set
        if (data.lessons.length > 0 && !currentLesson) {
          setCurrentLesson(data.lessons[0]);
        }
      } else {
        setError(data.message || 'Access denied.');
      }
    } catch (err) {
      setError('Connection failed. Please start your Laravel server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [slug]);

  const toggleLessonCompletion = async (lessonId) => {
    try {
      const res = await apiCall(`/lessons/${lessonId}/complete`, {
        method: 'POST',
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setCompletedLessonIds(data.enrollment.completed_lessons || []);
        setProgressPercent(data.enrollment.progress || 0);
      }
    } catch (err) {
      console.error('Error toggling lesson completion:', err);
    }
  };

  const preventVideoSeeking = (event) => {
    const video = event.currentTarget;
    if (Math.abs(video.currentTime - allowedVideoTime.current) > 1.25) {
      video.currentTime = allowedVideoTime.current;
    }
  };

  const handleVideoTimeUpdate = (event) => {
    allowedVideoTime.current = event.currentTarget.currentTime;
  };

  const blockVideoSkipKeys = (event) => {
    if (['ArrowLeft', 'ArrowRight', 'Home', 'End', 'j', 'J', 'l', 'L'].includes(event.key)) {
      event.preventDefault();
    }
  };

  const downloadCertificate = () => {
    const learnerName = user?.name || 'Learner';
    const instructorName = course?.instructor?.name || 'EduSphere Instructor';
    const courseTitle = course?.title || 'Course';
    const issuedAt = new Date().toLocaleDateString();
    const certificateHtml = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Certificate - ${courseTitle}</title>
  <style>
    body { margin: 0; padding: 40px; background: #030712; color: #f9fafb; font-family: Arial, sans-serif; }
    .certificate { max-width: 900px; margin: 0 auto; padding: 56px; border: 8px double #10b981; border-radius: 18px; text-align: center; background: #090d16; }
    .label { color: #10b981; text-transform: uppercase; letter-spacing: 0.28em; font-size: 13px; font-weight: 700; }
    h1 { font-size: 42px; margin: 28px 0 8px; }
    h2 { color: #6366f1; font-size: 28px; margin: 20px 0 36px; }
    p { color: #cbd5e1; font-size: 17px; line-height: 1.7; }
    .footer { display: flex; justify-content: space-between; margin-top: 44px; padding-top: 22px; border-top: 1px solid rgba(255,255,255,0.16); color: #94a3b8; font-size: 14px; }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="label">Certificate of Completion</div>
    <h1>${learnerName}</h1>
    <p>has successfully mastered the curriculum and projects outlined in</p>
    <h2>${courseTitle}</h2>
    <div class="footer">
      <span>Instructor: ${instructorName}</span>
      <span>Issued: ${issuedAt}</span>
      <span>EduSphere Academy</span>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([certificateHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${courseTitle.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase()}-certificate.html`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  if (loading && !course) {
    return (
      <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>
        <h2>Loading Course Player...</h2>
        <div className="skeleton" style={{ height: '400px', width: '100%', marginTop: '2rem' }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ paddingTop: '6rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <AlertCircle size={48} style={{ color: '#f87171', marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Unable to Access Player</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{error}</p>
          <Link to="/courses" className="btn btn-secondary">Go to Catalog</Link>
        </div>
      </div>
    );
  }

  const isCompleted = (id) => completedLessonIds.some((completedId) => String(completedId) === String(id));

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 76px)' }}>
      {/* Player Top bar */}
      <div style={{ 
        backgroundColor: 'var(--bg-dark)', 
        borderBottom: '1px solid var(--border-color)', 
        padding: '0.75rem 2rem', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between' 
      }}>
        <Link to={`/courses/${course.slug}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          <ChevronLeft size={16} />
          <span>Course Details</span>
        </Link>
        <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{course.title}</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '220px' }}>
          <div style={{ flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.05)', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${progressPercent}%`, backgroundColor: 'var(--color-accent)', height: '100%', transition: 'width 0.3s ease' }}></div>
          </div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-accent)' }}>{progressPercent}% Done</span>
        </div>
      </div>

      {/* Main Split Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', flex: 1 }} className="player-split-layout">
        
        {/* Left Side: Video & Description tabs */}
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto' }}>
          {currentLesson ? (
            <>
              {/* Video Player */}
              <div className="video-wrapper">
                {normalizedVideoUrl ? (
                  <>
                    <video 
                      ref={videoRef}
                      src={normalizedVideoUrl} 
                      controls 
                      controlsList="nodownload noplaybackrate"
                      disablePictureInPicture
                      playsInline
                      preload="metadata"
                      key={currentLesson.id} // Forces reload on lesson change
                      onCanPlay={() => setVideoError('')}
                      onTimeUpdate={handleVideoTimeUpdate}
                      onSeeking={preventVideoSeeking}
                      onKeyDown={blockVideoSkipKeys}
                      onLoadedMetadata={() => {
                        allowedVideoTime.current = 0;
                      }}
                      onError={() => setVideoError('This video could not be loaded. Please try another lesson or contact the instructor.')}
                      poster="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=60"
                    />
                    {videoError && (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.75)', color: 'var(--text-primary)', textAlign: 'center', padding: '1rem' }}>
                        {videoError}
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                    <Play size={48} />
                    <p style={{ marginTop: '1rem' }}>No Video Available for this Lesson</p>
                  </div>
                )}
              </div>

              {/* Lesson details & Tabs */}
              <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{currentLesson.title}</h2>
                
                {/* Tabs */}
                <div style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
                  <button 
                    onClick={() => setActiveTab('description')} 
                    style={{ 
                      padding: '0.5rem 0.25rem', 
                      background: 'none', 
                      border: 'none', 
                      color: activeTab === 'description' ? 'var(--color-primary)' : 'var(--text-secondary)',
                      borderBottom: activeTab === 'description' ? '2px solid var(--color-primary)' : 'none',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Lesson Info
                  </button>
                  <button 
                    onClick={() => setActiveTab('resources')} 
                    style={{ 
                      padding: '0.5rem 0.25rem', 
                      background: 'none', 
                      border: 'none', 
                      color: activeTab === 'resources' ? 'var(--color-primary)' : 'var(--text-secondary)',
                      borderBottom: activeTab === 'resources' ? '2px solid var(--color-primary)' : 'none',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Resources
                  </button>
                </div>

                {/* Tab content */}
                {activeTab === 'description' ? (
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {currentLesson.description || 'No detailed instructions provided for this lesson.'}
                  </p>
                ) : (
                  <div className="card" style={{ background: 'rgba(255,255,255,0.01)', padding: '1rem' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      📝 Code snippets, instructions, and github links for this lesson will be posted here by the instructor.
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '6rem 0' }}>
              <BookOpen size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
              <p style={{ color: 'var(--text-secondary)' }}>This course does not have any lessons added yet.</p>
            </div>
          )}

          {/* Certificate Block */}
          {progressPercent === 100 && (
            <div className="card card-glowing-green animate-fade-in" style={{ 
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.02) 100%)',
              borderColor: 'rgba(16, 185, 129, 0.3)',
              padding: '2.5rem',
              textAlign: 'center',
              marginTop: '2rem'
            }}>
              <Award size={64} style={{ color: 'var(--color-accent)', marginBottom: '1rem', filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.4))' }} />
              <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Congratulations!</h2>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 1.5rem auto', fontSize: '0.95rem' }}>
                You have successfully completed all lessons in <strong>{course.title}</strong>! You have been awarded a course completion certificate.
              </p>
              
              {/* Generated Certificate Mock */}
              <div style={{ 
                border: '4px double rgba(16, 185, 129, 0.4)', 
                background: 'var(--bg-dark)', 
                padding: '2rem',
                borderRadius: 'var(--radius-md)',
                maxWidth: '600px',
                margin: '0 auto',
                boxShadow: 'var(--shadow-lg)'
              }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-accent)', letterSpacing: '0.2em', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Certificate of Completion</span>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 600, margin: '0.5rem 0' }}>{user ? user.name : 'Learner'}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '1rem 0' }}>
                  has successfully mastered the curriculum and projects outlined in
                </p>
                <h4 style={{ color: 'var(--color-primary)', fontSize: '1.2rem', marginBottom: '1.5rem' }}>{course.title}</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>Instructor: {course.instructor.name}</span>
                  <span>Platform: EduSphere Academy</span>
                </div>
              </div>
              <button
                type="button"
                onClick={downloadCertificate}
                className="btn btn-accent"
                style={{ marginTop: '1.5rem', gap: '0.5rem' }}
              >
                <Download size={16} />
                <span>Download Certificate</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Lessons Syllabus Accordion */}
        <div style={{ 
          backgroundColor: 'var(--bg-dark)', 
          borderLeft: '1px solid var(--border-color)', 
          display: 'flex', 
          flexDirection: 'column',
          overflowY: 'auto'
        }}>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(255,255,255,0.01)' }}>
            <h3 style={{ fontSize: '1.1rem' }}>Course Content</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {lessons.map((lesson, index) => {
              const active = currentLesson && currentLesson.id === lesson.id;
              const done = isCompleted(lesson.id);

              return (
                <div
                  key={lesson.id}
                  className={`playlist-item${active ? ' active' : ''}`}
                  onClick={() => setCurrentLesson(lesson)}
                >
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); // prevent setting active lesson
                      toggleLessonCompletion(lesson.id);
                    }}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: done ? 'var(--color-accent)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      marginTop: '0.15rem'
                    }}
                  >
                    {done ? <CheckSquare size={20} /> : <Square size={20} />}
                  </button>

                  <div style={{ flex: 1 }}>
                    <h5 style={{ 
                      fontSize: '0.95rem', 
                      fontWeight: 600,
                      color: active ? 'var(--text-primary)' : done ? 'var(--text-secondary)' : 'var(--text-secondary)'
                    }}>
                      {index + 1}. {lesson.title}
                    </h5>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                      <Clock size={12} />
                      {lesson.duration} mins
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
