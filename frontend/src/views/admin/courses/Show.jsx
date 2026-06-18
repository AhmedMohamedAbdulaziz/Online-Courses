import { Link } from 'react-router-dom';
import { ArrowUpRight, Trash2 } from 'lucide-react';
import { money, styles } from '../adminStyles';
import AddCourse from './Add';
import EditCourse from './Edit';

export default function ShowCourses({ courses, onDelete }) {
  return (
    <section style={styles.panel}>
      <div style={styles.panelHeader}>
        <div>
          <h2 style={styles.panelTitle}>Courses CRUD</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Create, edit, delete, and open courses.</p>
        </div>
        <AddCourse />
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
                    <EditCourse course={course} />
                    <button type="button" onClick={() => onDelete(course)} style={{ ...styles.iconButton, ...styles.dangerButton }} title="Delete course"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {courses.length === 0 && (
              <tr>
                <td colSpan="5" style={styles.td}>
                  <div style={styles.empty}>No courses found.</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
