import { Link } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppSelector';
import Button from '../ui/Button';

const AdminAccessButton = () => {
  const { role, accessToken } = useAppSelector((state) => state.auth);

  // If user is admin but Admin link isn't showing, provide direct access
  if (accessToken && role === 'ADMIN') {
    return (
      <Link to="/admin">
        <Button variant="primary" size="sm" className="ml-2">
          🎛️ Admin Dashboard
        </Button>
      </Link>
    );
  }

  return null;
};

export default AdminAccessButton;

