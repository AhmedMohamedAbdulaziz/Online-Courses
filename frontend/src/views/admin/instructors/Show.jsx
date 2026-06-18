import { styles } from '../adminStyles';
import UserTable from '../shared/UserTable';
import AddInstructor from './Add';
import EditInstructor from './Edit';

export default function ShowInstructors({ users, editingUserId, form, setForm, onAdd, onEditSubmit, onCancelEdit, formError, onStartEdit, onDelete }) {
  return (
    <section style={styles.panel}>
      <div style={styles.panelHeader}>
        <div>
          <h2 style={styles.panelTitle}>Instructors CRUD</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Add, edit, and remove instructor accounts.</p>
        </div>
      </div>
      {editingUserId ? (
        <EditInstructor form={form} setForm={setForm} onSubmit={onEditSubmit} onCancel={onCancelEdit} error={formError} />
      ) : (
        <AddInstructor form={form} setForm={setForm} onSubmit={onAdd} error={formError} />
      )}
      <UserTable users={users} onEdit={onStartEdit} onDelete={onDelete} />
    </section>
  );
}
