import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BookOpen,
  CircleDollarSign,
  Edit2,
  GraduationCap,
  LayoutDashboard,
  Plus,
  ReceiptText,
  School,
  ShieldCheck,
  Trash2,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ShowAccess from './admin/access/Show';
import ShowCourses from './admin/courses/Show';
import ShowEnrollments from './admin/enrollments/Show';
import ShowInstructors from './admin/instructors/Show';
import ShowStudents from './admin/students/Show';

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const number = new Intl.NumberFormat('en-US');

const formatDate = (value) => {
  if (!value) return 'Not available';
  return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const styles = {
  shell: {
    display: 'grid',
    gridTemplateColumns: '280px minmax(0, 1fr)',
    gap: '2rem',
    paddingTop: '2rem',
    paddingBottom: '5rem',
  },
  sidebar: {
    position: 'sticky',
    top: 96,
    alignSelf: 'start',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '2rem',
    color: 'var(--text-primary)',
    fontWeight: 800,
    fontSize: '1.05rem',
  },
  navCard: {
    padding: '0.75rem',
    borderRadius: 'var(--radius-md)',
    background: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    boxShadow: 'var(--shadow-md)',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.9rem',
    width: '100%',
    padding: '0.9rem 1rem',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-secondary)',
    fontWeight: 600,
    marginBottom: '0.4rem',
    background: 'transparent',
    border: '1px solid transparent',
    appearance: 'none',
  },
  navActive: {
    background: 'rgba(99, 102, 241, 0.12)',
    color: 'var(--text-primary)',
    border: '1px solid rgba(99, 102, 241, 0.24)',
  },
  navIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255, 255, 255, 0.06)',
    boxShadow: 'var(--shadow-sm)',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '1rem',
    marginBottom: '2rem',
  },
  breadcrumb: {
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    marginBottom: '0.3rem',
  },
  pageTitle: {
    fontSize: '1.7rem',
    margin: 0,
  },
  livePill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.45rem',
    color: '#bae6fd',
    background: 'rgba(14, 165, 233, 0.12)',
    border: '1px solid rgba(14, 165, 233, 0.28)',
    borderRadius: 'var(--radius-full)',
    padding: '0.55rem 0.85rem',
    fontSize: '0.8rem',
    fontWeight: 700,
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, minmax(170px, 1fr))',
    gap: '1.5rem',
    marginBottom: '1.5rem',
  },
  kpi: {
    minHeight: 118,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '1rem',
    padding: '1.15rem',
    borderRadius: 'var(--radius-lg)',
    background: 'rgba(17, 24, 39, 0.74)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: 'var(--shadow-md)',
  },
  kpiIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  metricLabel: {
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    fontWeight: 700,
  },
  metricValue: {
    display: 'block',
    marginTop: '0.35rem',
    fontFamily: 'var(--font-heading)',
    fontSize: '1.7rem',
    lineHeight: 1,
  },
  metricMeta: {
    display: 'block',
    marginTop: '0.35rem',
    color: 'var(--text-muted)',
    fontSize: '0.78rem',
  },
  wideGrid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1.35fr) minmax(340px, 0.95fr)',
    gap: '1.5rem',
    marginBottom: '1.5rem',
  },
  bottomGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem',
  },
  panel: {
    minHeight: 142,
    padding: '1.6rem',
    borderRadius: 'var(--radius-lg)',
    background: 'rgba(17, 24, 39, 0.74)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: 'var(--shadow-md)',
  },
  panelHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    marginBottom: '1.25rem',
  },
  panelTitle: {
    fontSize: '1.15rem',
    margin: 0,
  },
  viewAll: {
    border: 'none',
    background: 'transparent',
    color: 'var(--color-primary)',
    fontSize: '0.88rem',
    fontWeight: 800,
    cursor: 'pointer',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '0.85rem 1rem',
    borderBottom: '1px solid var(--border-color)',
    color: '#94a3b8',
    fontSize: '0.78rem',
    textTransform: 'uppercase',
    textAlign: 'left',
  },
  td: {
    padding: '0.85rem 1rem',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    color: 'var(--text-secondary)',
    fontSize: '0.88rem',
  },
  miniRow: {
    display: 'grid',
    gridTemplateColumns: 'auto minmax(0, 1fr) auto',
    alignItems: 'center',
    gap: '0.85rem',
    padding: '0.75rem 0',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 10,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
    fontWeight: 800,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: 999,
    padding: '0.25rem 0.6rem',
    fontSize: '0.72rem',
    fontWeight: 800,
    textTransform: 'capitalize',
  },
  empty: {
    padding: '2rem 0',
    color: 'var(--text-muted)',
    textAlign: 'center',
  },
  actionRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '0.5rem',
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 8,
    border: '1px solid var(--border-color)',
    background: 'rgba(255,255,255,0.05)',
    color: 'var(--text-primary)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  dangerButton: {
    color: '#f87171',
    borderColor: 'rgba(248, 113, 113, 0.25)',
    background: 'rgba(248, 113, 113, 0.08)',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  input: {
    width: '100%',
    padding: '0.72rem 0.85rem',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border-color)',
    background: 'var(--bg-input)',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-body)',
  },
};

const tones = [
  { background: 'linear-gradient(135deg, #d946ef, #7c3aed)', color: '#fff' },
  { background: 'linear-gradient(135deg, #60a5fa, #334155)', color: '#fff' },
  { background: 'linear-gradient(135deg, #1f2937, #111827)', color: '#fff' },
  { background: 'linear-gradient(135deg, #fb923c, #ef4444)', color: '#fff' },
  { background: 'linear-gradient(135deg, #84cc16, #16a34a)', color: '#fff' },
];

const roleColors = {
  admin: { color: '#fbbf24', background: 'rgba(245, 158, 11, 0.13)' },
  instructor: { color: '#38bdf8', background: 'rgba(14, 165, 233, 0.13)' },
  student: { color: '#34d399', background: 'rgba(16, 185, 129, 0.13)' },
};

export default function AdminDashboard() {
  const { apiCall } = useAuth();
  const [stats, setStats] = useState({
    total_students: 0,
    total_instructors: 0,
    total_courses: 0,
    total_enrollments: 0,
    total_revenue: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentCourses, setRecentCourses] = useState([]);
  const [recentEnrollments, setRecentEnrollments] = useState([]);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [editingUserId, setEditingUserId] = useState(null);
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAdminDashboard = async () => {
    try {
      const res = await apiCall('/admin/dashboard');
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || 'Failed to fetch admin stats');
        return;
      }
      setStats(data.stats || {});
      setRecentUsers(data.recent_users || []);
      setRecentCourses(data.recent_courses || []);
      setRecentEnrollments(data.recent_enrollments || []);
      setUsers(data.users || data.recent_users || []);
      setCourses(data.courses || data.recent_courses || []);
      setEnrollments(data.enrollments || data.recent_enrollments || []);
    } catch (err) {
      console.error('Error fetching admin dashboard:', err);
      setError('Connection error. Please make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminDashboard();
  }, [apiCall]);

  const derived = useMemo(() => {
    const enrollments = Number(stats.total_enrollments || 0);
    const revenue = Number(stats.total_revenue || 0);
    const courses = Number(stats.total_courses || 0);
    return {
      averageOrder: enrollments ? revenue / enrollments : 0,
      enrollmentsPerCourse: courses ? enrollments / courses : 0,
    };
  }, [stats]);

  const cards = [
    { label: 'Total Students', value: number.format(Number(stats.total_students || 0)), meta: '+12%', icon: Users },
    { label: 'Total Instructors', value: number.format(Number(stats.total_instructors || 0)), meta: '+8%', icon: GraduationCap },
    { label: 'Total Courses', value: number.format(Number(stats.total_courses || 0)), meta: '+3%', icon: BookOpen },
    { label: 'Total Revenue', value: money.format(Number(stats.total_revenue || 0)), meta: `${money.format(derived.averageOrder)} avg`, icon: CircleDollarSign },
    { label: 'New Enrollments', value: number.format(Number(stats.total_enrollments || 0)), meta: `${derived.enrollmentsPerCourse.toFixed(1)} / course`, icon: ReceiptText },
  ];

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'instructors', label: 'Instructors', icon: GraduationCap },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'enrollments', label: 'Enrollments', icon: ReceiptText },
    { id: 'access', label: 'Access', icon: ShieldCheck },
  ];

  const filteredUsers = activeSection === 'instructors'
    ? users.filter((user) => user.role === 'instructor')
    : activeSection === 'students'
      ? users.filter((user) => user.role === 'student')
      : users;

  const resetUserForm = () => {
    setEditingUserId(null);
    setUserForm({ name: '', email: '', password: '', role: activeSection === 'instructors' ? 'instructor' : 'student' });
    setFormError('');
  };

  const startEditUser = (user) => {
    setEditingUserId(user.id);
    setUserForm({ name: user.name, email: user.email, password: '', role: user.role });
    setFormError('');
  };

  const submitUserForm = async (event) => {
    event.preventDefault();
    setFormError('');

    const payload = {
      name: userForm.name,
      email: userForm.email,
      role: userForm.role,
      ...(userForm.password ? { password: userForm.password } : {}),
    };

    try {
      const res = await apiCall(editingUserId ? `/admin/users/${editingUserId}` : '/admin/users', {
        method: editingUserId ? 'PUT' : 'POST',
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        const firstError = data.errors ? Object.values(data.errors)[0]?.[0] : null;
        setFormError(firstError || data.message || 'Failed to save user.');
        return;
      }

      resetUserForm();
      fetchAdminDashboard();
    } catch (err) {
      setFormError('Connection error while saving user.');
    }
  };

  const deleteUser = async (user) => {
    if (!window.confirm(`Delete ${user.name}?`)) return;
    const res = await apiCall(`/admin/users/${user.id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok || !data.success) {
      alert(data.message || 'Failed to delete user.');
      return;
    }
    fetchAdminDashboard();
  };

  const deleteCourse = async (course) => {
    if (!window.confirm(`Delete course: ${course.title}?`)) return;
    const res = await apiCall(`/courses/${course.id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok || !data.success) {
      alert(data.message || 'Failed to delete course.');
      return;
    }
    fetchAdminDashboard();
  };

  const deleteEnrollment = async (enrollment) => {
    if (!window.confirm('Remove this enrollment?')) return;
    const res = await apiCall(`/admin/enrollments/${enrollment.id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok || !data.success) {
      alert(data.message || 'Failed to delete enrollment.');
      return;
    }
    fetchAdminDashboard();
  };

  const renderUserManager = (title, description) => (
    <section style={styles.panel}>
      <div style={styles.panelHeader}>
        <div>
          <h2 style={styles.panelTitle}>{title}</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>{description}</p>
        </div>
        {editingUserId && (
          <button type="button" onClick={resetUserForm} style={styles.iconButton} title="Cancel edit">
            <X size={16} />
          </button>
        )}
      </div>

      <form onSubmit={submitUserForm} style={styles.formGrid}>
        <input style={styles.input} placeholder="Name" value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} required />
        <input style={styles.input} type="email" placeholder="Email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} required />
        <input style={styles.input} type="password" placeholder={editingUserId ? 'New password (optional)' : 'Password'} value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} required={!editingUserId} />
        <select style={styles.input} value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}>
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="btn btn-primary" style={{ gap: '0.4rem' }}>
          {editingUserId ? <Edit2 size={16} /> : <Plus size={16} />}
          {editingUserId ? 'Update User' : 'Add User'}
        </button>
      </form>

      {formError && <p className="error-alert-box">{formError}</p>}

      <div className="table-responsive">
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Created</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td style={styles.td}>{user.name}</td>
                <td style={styles.td}>{user.email}</td>
                <td style={styles.td}><span style={{ ...styles.badge, ...(roleColors[user.role] || roleColors.student) }}>{user.role}</span></td>
                <td style={styles.td}>{formatDate(user.created_at)}</td>
                <td style={{ ...styles.td, textAlign: 'right' }}>
                  <div style={styles.actionRow}>
                    <button type="button" onClick={() => startEditUser(user)} style={styles.iconButton} title="Edit user"><Edit2 size={15} /></button>
                    <button type="button" onClick={() => deleteUser(user)} style={{ ...styles.iconButton, ...styles.dangerButton }} title="Delete user"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );

  const renderCoursesManager = () => (
    <section style={styles.panel}>
      <div style={styles.panelHeader}>
        <div>
          <h2 style={styles.panelTitle}>Courses CRUD</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Create, edit, delete, and open courses.</p>
        </div>
        <Link to="/instructor/courses/new" className="btn btn-primary"><Plus size={16} /> Add Course</Link>
      </div>
      <div className="table-responsive">
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Course</th>
              <th style={styles.th}>Instructor</th>
              <th style={styles.th}>Level</th>
              <th style={styles.th}>Price</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td style={styles.td}>{course.title}</td>
                <td style={styles.td}>{course.instructor?.name || 'Instructor'}</td>
                <td style={styles.td}><span className={`badge badge-${course.level}`}>{course.level}</span></td>
                <td style={styles.td}>{money.format(Number(course.price || 0))}</td>
                <td style={{ ...styles.td, textAlign: 'right' }}>
                  <div style={styles.actionRow}>
                    <Link to={`/courses/${course.slug}`} style={styles.iconButton} title="Open course"><ArrowUpRight size={15} /></Link>
                    <Link to={`/instructor/courses/${course.id}/edit`} style={styles.iconButton} title="Edit course"><Edit2 size={15} /></Link>
                    <button type="button" onClick={() => deleteCourse(course)} style={{ ...styles.iconButton, ...styles.dangerButton }} title="Delete course"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );

  const renderEnrollmentsManager = () => (
    <section style={styles.panel}>
      <div style={styles.panelHeader}>
        <div>
          <h2 style={styles.panelTitle}>Enrollments</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Review and remove student enrollments.</p>
        </div>
      </div>
      <div className="table-responsive">
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Student</th>
              <th style={styles.th}>Course</th>
              <th style={styles.th}>Progress</th>
              <th style={styles.th}>Date</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((enrollment) => (
              <tr key={enrollment.id}>
                <td style={styles.td}>{enrollment.user?.name || 'Student'}</td>
                <td style={styles.td}>{enrollment.course?.title || 'Course'}</td>
                <td style={styles.td}>{enrollment.progress || 0}%</td>
                <td style={styles.td}>{formatDate(enrollment.created_at)}</td>
                <td style={{ ...styles.td, textAlign: 'right' }}>
                  <button type="button" onClick={() => deleteEnrollment(enrollment)} style={{ ...styles.iconButton, ...styles.dangerButton }} title="Delete enrollment"><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>
        <h2>Loading Admin Dashboard...</h2>
        <div style={styles.kpiGrid}>
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="skeleton" style={{ height: 118, borderRadius: 'var(--radius-lg)' }} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ paddingTop: '5rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: 520, margin: '0 auto', padding: '3rem 2rem' }}>
          <AlertTriangle size={38} style={{ color: '#f87171', marginBottom: '1rem' }} />
          <h3 style={{ marginBottom: '0.75rem' }}>Dashboard unavailable</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{error}</p>
          <Link to="/" className="btn btn-primary">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={styles.shell}>
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <School size={28} style={{ color: 'var(--color-primary)' }} />
          <span>EduSphere Admin</span>
        </div>
        <div style={styles.navCard}>
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setActiveSection(id);
                if (id === 'students' || id === 'instructors' || id === 'access') {
                  setUserForm({ name: '', email: '', password: '', role: id === 'instructors' ? 'instructor' : 'student' });
                  setEditingUserId(null);
                }
              }}
              style={{ ...styles.navItem, ...(activeSection === id ? styles.navActive : {}), border: 'none', cursor: 'pointer', textAlign: 'left' }}
            >
              <span style={{ ...styles.navIcon, color: activeSection === id ? 'var(--color-primary)' : 'var(--text-secondary)' }}>
                <Icon size={20} />
              </span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </aside>

      <main>
        <div style={styles.header}>
          <div>
            <div style={styles.breadcrumb}>Pages / Dashboard Overview</div>
            <h1 style={styles.pageTitle}>
              {activeSection === 'dashboard' && 'Dashboard Overview'}
              {activeSection === 'students' && 'Students Management'}
              {activeSection === 'instructors' && 'Instructors Management'}
              {activeSection === 'courses' && 'Courses Management'}
              {activeSection === 'enrollments' && 'Enrollments Management'}
              {activeSection === 'access' && 'Access Management'}
            </h1>
          </div>
          <span style={styles.livePill}>
            <Activity size={14} />
            Live API data
          </span>
        </div>

        {activeSection === 'dashboard' && (
          <>
            <section style={styles.kpiGrid}>
              {cards.map(({ label, value, meta, icon: Icon }, index) => (
                <article key={label} style={styles.kpi}>
                  <div>
                    <div style={styles.metricLabel}>{label}</div>
                    <strong style={styles.metricValue}>{value}</strong>
                    <span style={{ ...styles.metricMeta, color: index === 4 ? '#ef4444' : '#84cc16' }}>{meta}</span>
                  </div>
                  <div style={{ ...styles.kpiIcon, ...tones[index] }}>
                    <Icon size={24} />
                  </div>
                </article>
              ))}
            </section>

            <section style={styles.wideGrid}>
              <div style={styles.panel}>
                <div style={styles.panelHeader}>
                  <div>
                    <h2 style={styles.panelTitle}>Recent Enrollments</h2>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.9rem' }}>Latest 5 bookings</p>
                  </div>
                </div>
                <div className="table-responsive">
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Student</th>
                        <th style={styles.th}>Course</th>
                        <th style={styles.th}>Date</th>
                        <th style={{ ...styles.th, textAlign: 'right' }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentEnrollments.map((entry) => (
                        <tr key={entry.id}>
                          <td style={styles.td}>{entry.user?.name || 'Student'}</td>
                          <td style={styles.td}>{entry.course?.title || 'Course'}</td>
                          <td style={styles.td}>{formatDate(entry.created_at)}</td>
                          <td style={{ ...styles.td, textAlign: 'right', color: 'var(--color-accent)', fontWeight: 800 }}>
                            {money.format(Number(entry.course?.price || 0))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div style={styles.panel}>
                <div style={styles.panelHeader}>
                  <h2 style={styles.panelTitle}>Course Status Overview</h2>
                </div>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  <div style={{ ...styles.miniRow, gridTemplateColumns: '1fr auto' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Active catalog</span>
                    <strong>{number.format(Number(stats.total_courses || 0))}</strong>
                  </div>
                  <div style={{ ...styles.miniRow, gridTemplateColumns: '1fr auto' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Total seats sold</span>
                    <strong>{number.format(Number(stats.total_enrollments || 0))}</strong>
                  </div>
                  <div style={{ ...styles.miniRow, gridTemplateColumns: '1fr auto', borderBottom: 'none' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Revenue per enrollment</span>
                    <strong>{money.format(derived.averageOrder)}</strong>
                  </div>
                </div>
              </div>
            </section>

            <section style={styles.bottomGrid}>
              <div style={styles.panel}>
                <div style={styles.panelHeader}>
                  <h2 style={styles.panelTitle}>New Users</h2>
                  <button type="button" onClick={() => setActiveSection('access')} style={styles.viewAll}>View All</button>
                </div>
                {recentUsers.map((user) => (
                  <div key={user.id} style={styles.miniRow}>
                    <span style={styles.avatar}>{user.name?.charAt(0) || 'U'}</span>
                    <div style={{ minWidth: 0 }}>
                      <strong style={{ display: 'block' }}>{user.name}</strong>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{user.email}</span>
                    </div>
                    <span style={{ ...styles.badge, ...(roleColors[user.role] || roleColors.student) }}>{user.role}</span>
                  </div>
                ))}
              </div>

              <div style={styles.panel}>
                <div style={styles.panelHeader}>
                  <h2 style={styles.panelTitle}>Newest Courses</h2>
                  <button type="button" onClick={() => setActiveSection('courses')} style={styles.viewAll}>View All</button>
                </div>
                {recentCourses.map((course) => (
                  <div key={course.id} style={styles.miniRow}>
                    <span style={styles.avatar}><BookOpen size={18} /></span>
                    <div style={{ minWidth: 0 }}>
                      <strong style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{course.title}</strong>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{course.instructor?.name || 'Instructor'}</span>
                    </div>
                    <Link to={`/courses/${course.slug}`} style={{ color: 'var(--color-primary)' }} aria-label={`Open ${course.title}`}>
                      <ArrowUpRight size={18} />
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {activeSection === 'students' && (
          <ShowStudents
            users={users.filter((user) => user.role === 'student')}
            editingUserId={editingUserId}
            form={userForm}
            setForm={setUserForm}
            onAdd={submitUserForm}
            onEditSubmit={submitUserForm}
            onCancelEdit={resetUserForm}
            formError={formError}
            onStartEdit={startEditUser}
            onDelete={deleteUser}
          />
        )}
        {activeSection === 'instructors' && (
          <ShowInstructors
            users={users.filter((user) => user.role === 'instructor')}
            editingUserId={editingUserId}
            form={userForm}
            setForm={setUserForm}
            onAdd={submitUserForm}
            onEditSubmit={submitUserForm}
            onCancelEdit={resetUserForm}
            formError={formError}
            onStartEdit={startEditUser}
            onDelete={deleteUser}
          />
        )}
        {activeSection === 'access' && (
          <ShowAccess
            users={users}
            editingUserId={editingUserId}
            form={userForm}
            setForm={setUserForm}
            onAdd={submitUserForm}
            onEditSubmit={submitUserForm}
            onCancelEdit={resetUserForm}
            formError={formError}
            onStartEdit={startEditUser}
            onDelete={deleteUser}
          />
        )}
        {activeSection === 'courses' && <ShowCourses courses={courses} onDelete={deleteCourse} />}
        {activeSection === 'enrollments' && <ShowEnrollments enrollments={enrollments} onDelete={deleteEnrollment} />}
      </main>
    </div>
  );
}
