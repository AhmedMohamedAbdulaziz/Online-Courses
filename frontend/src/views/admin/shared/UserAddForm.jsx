import { Plus } from 'lucide-react';
import { styles } from '../adminStyles';

export default function UserAddForm({ form, setForm, onSubmit, error, roleLabel = 'User' }) {
  return (
    <form onSubmit={onSubmit} style={styles.formGrid}>
      <input style={styles.input} placeholder={`${roleLabel} name`} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      <input style={styles.input} type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
      <input style={styles.input} type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
      <select style={styles.input} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
        <option value="student">Student</option>
        <option value="instructor">Instructor</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit" className="btn btn-primary" style={{ gap: '0.4rem' }}>
        <Plus size={16} />
        Add {roleLabel}
      </button>
      {error && <p className="error-alert-box" style={{ gridColumn: '1 / -1' }}>{error}</p>}
    </form>
  );
}
