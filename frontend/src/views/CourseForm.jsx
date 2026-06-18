import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Save, Plus, Trash2, Edit2, ChevronLeft } from '../components/Icons';

export default function CourseForm() {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { apiCall } = useAuth();

  // Course Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [price, setPrice] = useState(0);
  const [level, setLevel] = useState('beginner');
  const [duration, setDuration] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Lessons State
  const [lessons, setLessons] = useState([]);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonDescription, setLessonDescription] = useState('');
  const [lessonVideo, setLessonVideo] = useState('');
  const [videoSource, setVideoSource] = useState('upload'); // 'upload' or 'link'
  const [lessonVideoFile, setLessonVideoFile] = useState(null);
  const [lessonDuration, setLessonDuration] = useState(10);
  
  // Lesson editing state
  const [editingLessonId, setEditingLessonId] = useState(null);
  const [lessonLoading, setLessonLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const fetchCourseAndSyllabus = async () => {
        setLoading(true);
        try {
          const res = await apiCall(`/instructor/dashboard`);
          if (res.ok) {
            const data = await res.json();
            const courseToEdit = data.courses.find(c => c.id === id);
            
            if (courseToEdit) {
              setTitle(courseToEdit.title);
              setDescription(courseToEdit.description);
              setShortDescription(courseToEdit.short_description);
              setThumbnail(courseToEdit.thumbnail || '');
              setPrice(courseToEdit.price);
              setLevel(courseToEdit.level);
              setDuration(courseToEdit.duration);

              const detailsRes = await apiCall(`/courses/${courseToEdit.slug}`);
              const detailsData = await detailsRes.json();
              if (detailsRes.ok && detailsData.success) {
                setLessons(detailsData.lessons || []);
              }
            } else {
              setError('Course not found or unauthorized.');
            }
          }
        } catch (err) {
          setError('Failed to fetch course details.');
        } finally {
          setLoading(false);
        }
      };
      fetchCourseAndSyllabus();
    }
  }, [id, isEditMode]);

  const handleSubmitCourse = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('short_description', shortDescription);
    formData.append('price', Number(price));
    formData.append('level', level);
    formData.append('duration', Number(duration));

    if (thumbnailFile) {
      formData.append('thumbnail_file', thumbnailFile);
    } else if (thumbnail) {
      formData.append('thumbnail', thumbnail);
    }

    try {
      const endpoint = isEditMode ? `/courses/${id}` : '/courses';
      const method = isEditMode ? 'PUT' : 'POST';

      const res = await apiCall(endpoint, {
        method,
        body: formData,
      });
      const data = await res.json();

      if (res.ok && data.success) {
        if (!isEditMode) {
          navigate(`/instructor/courses/${data.course.id}/edit`);
        } else {
          alert('Course details saved successfully!');
        }
      } else {
        setError(data.message || 'Validation failed. Check inputs.');
        if (data.errors) {
          const firstErr = Object.values(data.errors)[0][0];
          setError(firstErr);
        }
      }
    } catch (err) {
      setError('Connection failed. Please verify Laravel server is online.');
    } finally {
      setLoading(false);
    }
  };

  // Add or Edit Lesson
  const handleSaveLesson = async (e) => {
    e.preventDefault();
    if (!lessonTitle) {
      alert('Lesson title is required.');
      return;
    }

    if (videoSource === 'link' && !lessonVideo) {
      alert('Video URL is required.');
      return;
    }

    if (videoSource === 'upload' && !lessonVideoFile && !editingLessonId) {
      alert('Please choose a video file to upload.');
      return;
    }

    setLessonLoading(true);

    const formData = new FormData();
    formData.append('title', lessonTitle);
    formData.append('description', lessonDescription);
    formData.append('duration', Number(lessonDuration));

    if (videoSource === 'link') {
      formData.append('video_url', lessonVideo);
    } else if (lessonVideoFile) {
      formData.append('video_file', lessonVideoFile);
    }

    try {
      let res, data;
      if (editingLessonId) {
        formData.append('_method', 'PUT');
        const currentSortOrder = lessons.find(l => l.id === editingLessonId)?.sort_order || 1;
        formData.append('sort_order', currentSortOrder);

        res = await apiCall(`/lessons/${editingLessonId}`, {
          method: 'POST',
          body: formData,
        });
      } else {
        formData.append('sort_order', lessons.length + 1);
        res = await apiCall(`/courses/${id}/lessons`, {
          method: 'POST',
          body: formData,
        });
      }
      data = await res.json();

      if (res.ok && data.success) {
        if (editingLessonId) {
          setLessons(lessons.map(l => l.id === editingLessonId ? data.lesson : l));
        } else {
          setLessons([...lessons, data.lesson]);
        }
        
        setLessonTitle('');
        setLessonDescription('');
        setLessonVideo('');
        setLessonVideoFile(null);
        const fileInput = document.getElementById('lesson-file-input');
        if (fileInput) fileInput.value = '';
        
        setLessonDuration(10);
        setEditingLessonId(null);
      } else {
        alert(data.message || 'Failed to save lesson.');
      }
    } catch (err) {
      alert('Connection error saving lesson.');
    } finally {
      setLessonLoading(false);
    }
  };

  const handleEditLessonSetup = (lesson) => {
    setEditingLessonId(lesson.id);
    setLessonTitle(lesson.title);
    setLessonDescription(lesson.description || '');
    if (lesson.video_url && lesson.video_url.includes('/storage/videos/')) {
      setVideoSource('upload');
      setLessonVideo('');
    } else {
      setVideoSource('link');
      setLessonVideo(lesson.video_url || '');
    }
    setLessonDuration(lesson.duration || 10);
    setLessonVideoFile(null);
  };

  const handleDeleteLesson = async (lessonId, title) => {
    if (!window.confirm(`Are you sure you want to delete lesson: "${title}"?`)) {
      return;
    }

    try {
      const res = await apiCall(`/lessons/${lessonId}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setLessons(lessons.filter(l => l.id !== lessonId));
      } else {
        alert(data.message || 'Failed to delete lesson.');
      }
    } catch (err) {
      alert('Error connecting to delete lesson.');
    }
  };

  return (
    <div className="container animate-fade-in page-container">
      <div style={{ marginBottom: '2.5rem' }}>
        <Link to="/instructor" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
          <ChevronLeft size={16} />
          <span>Back to Panel</span>
        </Link>
        <h1 style={{ fontSize: '2.25rem' }}>{isEditMode ? 'Edit Course Details' : 'Create a New Course'}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Configure course parameters and assemble the syllabus timeline</p>
      </div>

      <div className="course-form-layout">
        
        {/* Left Column: Course Metadata Form */}
        <div className="card" style={{ padding: '2rem' }}>
          <h2 className="form-card-title">General Settings</h2>
          
          {error && (
            <p className="error-alert-box">
              ⚠️ {error}
            </p>
          )}

          <form onSubmit={handleSubmitCourse}>
            <div className="form-group">
              <label className="form-label">Course Title</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. Mastering React 19 from Scratch"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Short Summary (Featured Snippet)</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Brief sentence outlining course goal."
                value={shortDescription}
                onChange={e => setShortDescription(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Detailed Description</label>
              <textarea 
                className="form-control" 
                rows={6}
                placeholder="Provide a comprehensive breakdown of what learners will study, build, and achieve."
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label">Price ($)</label>
                <input 
                  type="number" 
                  step="0.01"
                  className="form-control" 
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Difficulty Level</label>
                <select 
                  className="form-control"
                  value={level}
                  onChange={e => setLevel(e.target.value)}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Duration (Hours)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Thumbnail Image</label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
              />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.5rem' }}>
                Upload an image from your device, or leave this empty to keep the current image.
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Or use thumbnail URL</label>
              <input
                type="url"
                className="form-control"
                placeholder="https://images.unsplash.com/... (image address)"
                value={thumbnail}
                onChange={e => setThumbnail(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', gap: '0.35rem' }} disabled={loading}>
              <Save size={16} />
              <span>{isEditMode ? 'Save Settings' : 'Create Course & Continue'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Syllabus/Lessons Builder (Only visible in edit mode) */}
        {isEditMode && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Add/Edit Lesson Form */}
            <div className="card" style={{ padding: '2rem', border: '1px solid rgba(99, 102, 241, 0.15)' }}>
              <h2 className="form-card-title" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                {editingLessonId ? 'Edit Lesson' : 'Add New Lesson'}
              </h2>

              <form onSubmit={handleSaveLesson}>
                <div className="form-group">
                  <label className="form-label">Lesson Title</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. Setting up Context API Providers"
                    value={lessonTitle}
                    onChange={e => setLessonTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Video Source</label>
                  <div className="form-source-selector">
                    <button 
                      type="button" 
                      className={`btn ${videoSource === 'upload' ? 'btn-accent' : 'btn-secondary'} btn-sm form-source-btn`} 
                      onClick={() => setVideoSource('upload')}
                    >
                      Desktop Upload (Preferred)
                    </button>
                    
                  </div>

                  {videoSource === 'upload' ? (
                    <div>
                      <input 
                        id="lesson-file-input"
                        type="file" 
                        accept="video/*" 
                        className="form-control" 
                        onChange={e => setLessonVideoFile(e.target.files[0])}
                      />
                      {editingLessonId && (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                          Leave empty to keep the current video.
                        </p>
                      )}
                    </div>
                  ) : (
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Enter Google Drive share link or external URL"
                      value={lessonVideo}
                      onChange={e => setLessonVideo(e.target.value)}
                    />
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                  <div className="form-group">
                    <label className="form-label">Duration (Minutes)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={lessonDuration}
                      onChange={e => setLessonDuration(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description / Code snippets</label>
                  <textarea 
                    className="form-control" 
                    rows={3}
                    placeholder="Write detailed instructions or notes for students."
                    value={lessonDescription}
                    onChange={e => setLessonDescription(e.target.value)}
                  ></textarea>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button type="submit" className="btn btn-accent" style={{ flex: 1, gap: '0.25rem' }} disabled={lessonLoading}>
                    <Plus size={16} />
                    <span>{editingLessonId ? 'Update Lesson' : 'Add to Syllabus'}</span>
                  </button>

                  {editingLessonId && (
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => {
                        setEditingLessonId(null);
                        setLessonTitle('');
                        setLessonDescription('');
                        setLessonVideo('');
                        setLessonDuration(10);
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Current Lessons Timeline List */}
            <div className="card" style={{ padding: '2rem' }}>
              <h2 className="form-card-title">Current Curriculum</h2>
              
              {lessons.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontStyle: 'italic', textAlign: 'center', padding: '2rem 0' }}>
                  No lessons added yet. Use the form above to add lectures.
                </p>
              ) : (
                <div className="lesson-curriculum-list">
                  {lessons.map((lesson, idx) => (
                    <div 
                      key={lesson.id} 
                      className="lesson-curriculum-item"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>#{idx + 1}</span>
                        <div>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{lesson.title}</h4>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{lesson.duration} mins</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => handleEditLessonSetup(lesson)} 
                          className="btn btn-secondary btn-sm" 
                          style={{ padding: '0.35rem' }}
                          title="Edit Lesson"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button 
                          onClick={() => handleDeleteLesson(lesson.id, lesson.title)} 
                          className="btn btn-danger btn-sm" 
                          style={{ padding: '0.35rem' }}
                          title="Delete Lesson"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
