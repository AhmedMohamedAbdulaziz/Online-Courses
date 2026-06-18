import { Edit2, X } from 'lucide-react';
import { styles } from '../adminStyles';

export default function UserEditForm({ form, setForm, onSubmit, onCancel, error, roleLabel = 'User' }) {
  return (
    <form onSubmit={onSubmit} style={styles.formGrid}>
      <input style={styles.input} placeholder={`${roleLabel} name`} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      <input style={styles.input} type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
      <input style={styles.input} type="password" placeholder="New password (optional)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <select style={styles.input} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
        <option value="student">Student</option>
        <option value="instructor">Instructor</option>
        <option value="admin">Admin</option>
      </select>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button type="submit" className="btn btn-primary" style={{ gap: '0.4rem' }}>
          <Edit2 size={16} />
          Update
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel} style={{ gap: '0.4rem' }}>
          <X size={16} />
          Cancel
        </button>
      </div>
      {error && <p className="error-alert-box" style={{ gridColumn: '1 / -1' }}>{error}</p>}
    </form>
  );
}
