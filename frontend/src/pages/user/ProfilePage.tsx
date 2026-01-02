import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppSelector';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const ProfilePage = () => {
  const { role } = useAppSelector((state) => state.auth);

  // Redirect admins to admin dashboard
  if (role === 'ADMIN') {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="container-main py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-heading font-bold">Profile</h1>
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">Account</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Update your name, email, and password.</p>
          <Button variant="secondary" size="sm">Edit Account</Button>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">Addresses</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Manage shipping addresses.</p>
          <Button variant="secondary" size="sm">Manage Addresses</Button>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;

