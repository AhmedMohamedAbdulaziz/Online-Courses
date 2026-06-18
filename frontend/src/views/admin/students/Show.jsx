import { styles } from '../adminStyles';
import UserTable from '../shared/UserTable';
import AddStudent from './Add';
import EditStudent from './Edit';

export default function ShowStudents({ users, editingUserId, form, setForm, onAdd, onEditSubmit, onCancelEdit, formError, onStartEdit, onDelete }) {
  return (
    <section style={styles.panel}>
      <div style={styles.panelHeader}>
        <div>
          <h2 style={styles.panelTitle}>Students CRUD</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Add, edit, and remove student accounts.</p>
        </div>
      </div>
      {editingUserId ? (
        <EditStudent form={form} setForm={setForm} onSubmit={onEditSubmit} onCancel={onCancelEdit} error={formError} />
      ) : (
        <AddStudent form={form} setForm={setForm} onSubmit={onAdd} error={formError} />
      )}
      <UserTable users={users} onEdit={onStartEdit} onDelete={onDelete} />
    </section>
  );
}
