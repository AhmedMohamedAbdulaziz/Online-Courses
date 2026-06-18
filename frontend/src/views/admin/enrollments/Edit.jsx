import { Edit2 } from 'lucide-react';
import { styles } from '../adminStyles';

export default function EditEnrollment() {
  return (
    <button type="button" style={styles.iconButton} title="Enrollment editing needs an admin update API" disabled>
      <Edit2 size={15} />
    </button>
  );
}
