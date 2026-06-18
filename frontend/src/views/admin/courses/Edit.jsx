import { Link } from 'react-router-dom';
import { Edit2 } from 'lucide-react';
import { styles } from '../adminStyles';

export default function EditCourse({ course }) {
  return (
    <Link to={`/instructor/courses/${course.id}/edit`} style={styles.iconButton} title="Edit course">
      <Edit2 size={15} />
    </Link>
  );
}
