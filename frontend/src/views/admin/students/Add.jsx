import UserAddForm from '../shared/UserAddForm';

export default function AddStudent(props) {
  return <UserAddForm {...props} roleLabel="Student" />;
}
