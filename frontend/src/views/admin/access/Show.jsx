import { styles } from '../adminStyles';
import UserTable from '../shared/UserTable';
import AddAccessUser from './Add';
import EditAccessUser from './Edit';

export default function ShowAccess({ users, editingUserId, form, setForm, onAdd, onEditSubmit, onCancelEdit, formError, onStartEdit, onDelete }) {
  return (
    <section style={styles.panel}>
      <div style={styles.panelHeader}>
        <div>
          <h2 style={styles.panelTitle}>All Users & Access</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Manage students, instructors, and admins in one place.</p>
        </div>
      </div>
      {editingUserId ? (
        <EditAccessUser form={form} setForm={setForm} onSubmit={onEditSubmit} onCancel={onCancelEdit} error={formError} />
      ) : (
        <AddAccessUser form={form} setForm={setForm} onSubmit={onAdd} error={formError} />
      )}
      <UserTable users={users} onEdit={onStartEdit} onDelete={onDelete} />
    </section>
  );
}
