import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Views
import Home from './views/Home';
import Courses from './views/Courses';
import CourseDetail from './views/CourseDetail';
import CoursePlayer from './views/CoursePlayer';
import StudentDashboard from './views/StudentDashboard';
import InstructorDashboard from './views/InstructorDashboard';
import AdminDashboard from './views/AdminDashboard';
import CourseForm from './views/CourseForm';
import Login from './views/Login';
import Register from './views/Register';

// Components
import Navbar from './components/Navbar';

// Route Guards
const RequireAuth = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', color: 'var(--text-secondary)' }}>
        <h3>Loading your profile...</h3>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default function App() {
  return (
    <div className="app-container">
      {/* Navigation Header */}
      <Navbar />

      {/* Main Workspace */}
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:slug" element={<CourseDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <RequireAuth allowedRoles={['student', 'admin']}>
                <StudentDashboard />
              </RequireAuth>
            } 
          />
          <Route 
            path="/learn/:slug" 
            element={
              <RequireAuth allowedRoles={['student', 'admin']}>
                <CoursePlayer />
              </RequireAuth>
            } 
          />

          {/* Instructor/Admin Protected Routes */}
          <Route 
            path="/instructor" 
            element={
              <RequireAuth allowedRoles={['instructor', 'admin']}>
                <InstructorDashboard />
              </RequireAuth>
            } 
          />
          {/* Admin Protected Routes */}
          <Route
            path="/admin"
            element={<Navigate to="/admin/dashboard" replace />}
          />
          <Route 
            path="/admin/dashboard" 
            element={
              <RequireAuth allowedRoles={['admin']}>
                <AdminDashboard />
              </RequireAuth>
            } 
          />
          <Route 
            path="/instructor/courses/new" 
            element={
              <RequireAuth allowedRoles={['instructor', 'admin']}>
                <CourseForm />
              </RequireAuth>
            } 
          />
          <Route 
            path="/instructor/courses/:id/edit" 
            element={
              <RequireAuth allowedRoles={['instructor', 'admin']}>
                <CourseForm />
              </RequireAuth>
            } 
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer Branding */}
      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>EduSphere</h3>
              <p style={{ fontSize: '0.9rem', maxWidth: '300px', lineHeight: 1.5 }}>
                Interactive online platform dedicated to fullstack PHP Laravel and React developer training.
              </p>
            </div>
            <div>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '0.95rem' }}>Explore</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
                <Link to="/courses" style={{ color: 'var(--text-secondary)' }}>All Courses</Link>
                <Link to="/login" style={{ color: 'var(--text-secondary)' }}>Sign In</Link>
                <Link to="/register" style={{ color: 'var(--text-secondary)' }}>Registration</Link>
              </div>
            </div>
            <div>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '0.95rem' }}>Tech Stack</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <span>React 19 (Frontend)</span>
                <span>Laravel 10 (Backend API)</span>
                <span>MySQL (Database)</span>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>© {new Date().getFullYear()} EduSphere Academy. All rights reserved.</span>
            <span>Simulation Course Project</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
