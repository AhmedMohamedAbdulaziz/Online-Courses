import { Trash2 } from 'lucide-react';
import { formatDate, styles } from '../adminStyles';
import AddEnrollment from './Add';
import EditEnrollment from './Edit';

export default function ShowEnrollments({ enrollments, onDelete }) {
  return (
    <section style={styles.panel}>
      <div style={styles.panelHeader}>
        <div>
          <h2 style={styles.panelTitle}>Enrollments</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Review and remove student enrollments.</p>
        </div>
        <AddEnrollment />
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
                  <div style={styles.actionRow}>
                    <EditEnrollment />
                    <button type="button" onClick={() => onDelete(enrollment)} style={{ ...styles.iconButton, ...styles.dangerButton }} title="Delete enrollment">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {enrollments.length === 0 && (
              <tr>
                <td colSpan="5" style={styles.td}>
                  <div style={styles.empty}>No enrollments found.</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
