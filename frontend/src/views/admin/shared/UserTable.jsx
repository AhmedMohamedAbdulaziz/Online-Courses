import { Edit2, Trash2 } from 'lucide-react';
import { formatDate, roleColors, styles } from '../adminStyles';

export default function UserTable({ users, onEdit, onDelete }) {
  return (
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
          {users.map((user) => (
            <tr key={user.id}>
              <td style={styles.td}>{user.name}</td>
              <td style={styles.td}>{user.email}</td>
              <td style={styles.td}>
                <span style={{ ...styles.badge, ...(roleColors[user.role] || roleColors.student) }}>{user.role}</span>
              </td>
              <td style={styles.td}>{formatDate(user.created_at)}</td>
              <td style={{ ...styles.td, textAlign: 'right' }}>
                <div style={styles.actionRow}>
                  <button type="button" onClick={() => onEdit(user)} style={styles.iconButton} title="Edit user">
                    <Edit2 size={15} />
                  </button>
                  <button type="button" onClick={() => onDelete(user)} style={{ ...styles.iconButton, ...styles.dangerButton }} title="Delete user">
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan="5" style={styles.td}>
                <div style={styles.empty}>No users found.</div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
