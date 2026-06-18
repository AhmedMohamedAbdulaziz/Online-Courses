import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, BookOpen, User } from './Icons';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-inner">
          <Link to="/" className="logo">
            <BookOpen size={28} style={{ color: 'var(--color-primary)' }} />
            <span>EduSphere</span>
          </Link>

          <div className="nav-links">
            <NavLink 
              to="/" 
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              end
            >
              Home
            </NavLink>
            <NavLink 
              to="/courses" 
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
              Courses
            </NavLink>
            
            {user && user.role === 'student' && (
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              >
                My Learning
              </NavLink>
            )}

            {user && (user.role === 'instructor' || user.role === 'admin') && (
              <NavLink 
                to="/instructor" 
                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              >
                Instructor Panel
              </NavLink>
            )}

            {user && user.role === 'admin' && (
              <NavLink 
                to="/admin/dashboard" 
                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              >
                Admin Panel
              </NavLink>
            )}
          </div>

          <div className="nav-auth">
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <User size={16} style={{ color: 'var(--text-secondary)' }} />
                  <span style={{ fontWeight: 600 }}>{user.name}</span>
                  <span className="badge" style={{ 
                    fontSize: '0.65rem', 
                    padding: '0.1rem 0.4rem', 
                    backgroundColor: user.role === 'student' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                    color: user.role === 'student' ? 'var(--color-primary)' : 'var(--color-accent)'
                  }}>
                    {user.role}
                  </span>
                </div>
                <button onClick={handleLogout} className="btn btn-secondary btn-sm" style={{ gap: '0.25rem' }}>
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Link to="/login" className="btn btn-secondary btn-sm">Sign In</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
