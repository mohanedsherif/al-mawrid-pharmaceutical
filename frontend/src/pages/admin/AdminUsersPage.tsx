import { useEffect, useState } from 'react';
import { getAllUsers, updateUserRole, toggleUserEnabled, type User } from '../../api/adminApi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Skeleton from '../../components/ui/Skeleton';

const AdminUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newRole, setNewRole] = useState<'USER' | 'ADMIN'>('USER');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async () => {
    if (!selectedUser) return;
    try {
      await updateUserRole(selectedUser.id, newRole);
      await fetchUsers();
      setShowRoleModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Failed to update user role:', error);
    }
  };

  const handleToggleEnabled = async (id: number) => {
    try {
      await toggleUserEnabled(id);
      await fetchUsers();
    } catch (error) {
      console.error('Failed to toggle user enabled:', error);
    }
  };

  const openRoleModal = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setShowRoleModal(true);
  };

  const getStatusColor = (enabled: boolean) => {
    return enabled
      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
  };

  const getRoleColor = (role: string) => {
    return role === 'ADMIN'
      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
      : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-heading font-bold mb-2">User Management</h1>
        <p className="text-slate-600 dark:text-slate-400">Manage user accounts, roles, and access</p>
      </div>

      {loading ? (
        <Card className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </Card>
      ) : (
        <Card className="p-6 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="text-left py-3 px-4 font-semibold text-sm">ID</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Role</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Created</th>
                <th className="text-right py-3 px-4 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4 text-sm">{user.id}</td>
                  <td className="py-3 px-4 font-medium">{user.fullName}</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-semibold ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-semibold ${getStatusColor(user.enabled)}`}>
                      {user.enabled ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-500 dark:text-slate-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openRoleModal(user)}
                      >
                        Change Role
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleEnabled(user.id)}
                      >
                        {user.enabled ? 'Disable' : 'Enable'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              No users found
            </div>
          )}
        </Card>
      )}

      <Modal
        isOpen={showRoleModal}
        onClose={() => {
          setShowRoleModal(false);
          setSelectedUser(null);
        }}
        title="Change User Role"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowRoleModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleRoleChange}>
              Update Role
            </Button>
          </>
        }
      >
        {selectedUser && (
          <div className="space-y-4">
            <p className="text-slate-600 dark:text-slate-400">
              Change role for <strong>{selectedUser.fullName}</strong> ({selectedUser.email})
            </p>
            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as 'USER' | 'ADMIN')}
                className="input"
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminUsersPage;
