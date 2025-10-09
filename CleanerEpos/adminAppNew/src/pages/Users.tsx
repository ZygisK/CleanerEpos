import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Key } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Input } from '@/components/ui/Input';
import {
  getAllUsers,
  createUser,
  deleteUser,
} from '@/services/userService';
import { changePassword } from '@/services/authService';
import { getRoles } from '@/services/authService';
import { ApplicationUserModel, CreateUserModel, ApplicationRoleModel } from '@/types/models';

export const Users: React.FC = () => {
  const [users, setUsers] = useState<ApplicationUserModel[]>([]);
  const [roles, setRoles] = useState<ApplicationRoleModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ApplicationUserModel | null>(null);
  const [userToDelete, setUserToDelete] = useState<ApplicationUserModel | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [newUser, setNewUser] = useState<CreateUserModel>({
    fullName: '',
    userName: '',
    email: '',
    phoneNumber: '',
    roles: [],
  });
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      toast.error('Failed to load users');
      console.error('Error fetching users:', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const data = await getRoles();
      setRoles(data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchUsers(), fetchRoles()]);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleAddUser = async () => {
    try {
      if (!newUser.fullName || !newUser.userName || !newUser.email) {
        toast.error('Please fill in all required fields');
        return;
      }

      await createUser(newUser);
      
      toast.success('User created successfully! Set password using the key icon.');
      setIsAddModalOpen(false);
      resetNewUserForm();
      fetchUsers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create user');
    }
  };

  const handleDeleteUserClick = (user: ApplicationUserModel) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      await deleteUser(userToDelete.id);
      
      toast.success('User deleted successfully');
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete user');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleChangePassword = async () => {
    if (!selectedUser) return;

    if (!newPassword || !confirmPassword) {
      toast.error('Please enter both password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 4) {
      toast.error('Password must be at least 4 characters');
      return;
    }

    if (!/\d/.test(newPassword)) {
      toast.error('Password must contain at least one digit (0-9)');
      return;
    }

    if (newPassword.split('').every(char => char === newPassword[0])) {
      toast.error('Password must use at least 1 different character');
      return;
    }

    try {
      await changePassword(selectedUser.id, newPassword);
      
      toast.success('Password changed successfully');
      setIsPasswordModalOpen(false);
      setSelectedUser(null);
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to change password');
    }
  };

  const resetNewUserForm = () => {
    setNewUser({
      fullName: '',
      userName: '',
      email: '',
      phoneNumber: '',
      roles: [],
    });
  };

  const columns = [
    { key: 'fullName', label: 'Full Name' },
    { key: 'userName', label: 'Username' },
    { key: 'email', label: 'Email' },
    { key: 'phoneNumber', label: 'Phone' },
    {
      key: 'roles',
      label: 'Roles',
      render: (user: ApplicationUserModel) => (
        <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
          {user.roles.join(', ') || 'No roles'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right' as const,
      render: (user: ApplicationUserModel) => (
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={() => {
              setSelectedUser(user);
              setIsPasswordModalOpen(true);
            }}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
            title="Set Password"
          >
            <Key className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteUserClick(user)}
            className="p-1 text-red-600 hover:bg-red-50 rounded"
            title="Delete User"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-1">Manage system users</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Users Table */}
      <Card>
        <Table
          data={users}
          columns={columns}
          keyExtractor={(user) => user.id}
          isLoading={isLoading}
          emptyMessage="No users found"
        />
      </Card>

      {/* Add User Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          resetNewUserForm();
        }}
        title="Add New User"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name *"
              value={newUser.fullName}
              onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
              placeholder="John Doe"
            />
            <Input
              label="Username *"
              value={newUser.userName}
              onChange={(e) => setNewUser({ ...newUser, userName: e.target.value })}
              placeholder="johndoe"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email *"
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              placeholder="john@example.com"
            />
            <Input
              label="Phone Number"
              type="tel"
              value={newUser.phoneNumber}
              onChange={(e) => setNewUser({ ...newUser, phoneNumber: e.target.value })}
              placeholder="+1234567890"
            />
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> Password will be set separately after user creation using the key icon in the actions column.
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Roles
            </label>
            <div className="flex flex-wrap gap-2">
              {roles.map((role) => (
                <label key={role.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={Array.isArray(newUser.roles) && newUser.roles.includes(role.name)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setNewUser({
                          ...newUser,
                          roles: [...(newUser.roles ?? []), role.name],
                        });
                      } else {
                        setNewUser({
                          ...newUser,
                          roles: (newUser.roles ?? []).filter((r) => r !== role.name),
                        });
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-sm">{role.name}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="ghost"
              onClick={() => {
                setIsAddModalOpen(false);
                resetNewUserForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddUser}>Create User (No Password)</Button>
          </div>
        </div>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => {
          setIsPasswordModalOpen(false);
          setSelectedUser(null);
          setNewPassword('');
          setConfirmPassword('');
        }}
        title="Set User Password"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Setting password for: <strong>{selectedUser?.fullName}</strong>
          </p>
          
          <Input
            label="Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter password (min 4 chars, 1 digit, varied chars)"
          />
          
          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password (min 4 chars, 1 digit, varied chars)"
          />
          
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="ghost"
              onClick={() => {
                setIsPasswordModalOpen(false);
                setSelectedUser(null);
                setNewPassword('');
                setConfirmPassword('');
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleChangePassword}>Set Password</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={handleDeleteUser}
        title="Delete User"
        message={`Are you sure you want to delete "${userToDelete?.fullName}"? This action cannot be undone.`}
        confirmText="Delete User"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};
