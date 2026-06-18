import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

export default function AddCourse() {
  return (
    <Link to="/instructor/courses/new" className="btn btn-primary">
      <Plus size={16} />
      Add Course
    </Link>
  );
}
