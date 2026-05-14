import React, { useState } from 'react';
import Image from 'next/image';
import { User } from '@/types/user';
import UserViewModal from './UserViewModal';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import AddUserModal from './AddUserModal';

const UserTable: React.FC = () => {
  // State management
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      role: 'Admin',
      avatar: '',
      bio: 'Experienced administrator with 5+ years in system management.',
      address: '123 Main St, New York, NY 10001',
      createdAt: '2023-01-15T10:30:00Z',
      status: 'Active',
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '+1 (555) 234-5678',
      role: 'Manager',
      avatar: '',
      bio: 'Project manager specializing in agile methodologies.',
      address: '456 Oak Ave, Los Angeles, CA 90001',
      createdAt: '2023-02-20T14:45:00Z',
      status: 'Active',
    },
    {
      id: '3',
      firstName: 'Mike',
      lastName: 'Johnson',
      email: 'mike.johnson@example.com',
      phone: '+1 (555) 345-6789',
      role: 'User',
      avatar: '',
      bio: 'Software developer passionate about clean code.',
      address: '789 Pine Rd, Chicago, IL 60601',
      createdAt: '2023-03-10T09:15:00Z',
      status: 'Active',
    },
    {
      id: '4',
      firstName: 'Sarah',
      lastName: 'Williams',
      email: 'sarah.williams@example.com',
      phone: '+1 (555) 456-7890',
      role: 'Viewer',
      avatar: '',
      bio: 'Data analyst with expertise in business intelligence.',
      address: '321 Elm St, Houston, TX 77001',
      createdAt: '2023-04-05T16:20:00Z',
      status: 'Inactive',
    },
  ]);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  // Handlers
  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setUserToEdit(user);
    setIsEditModalOpen(true);
  };

  const handleRestrictUser = (user: User) => {
    setUsers(users.map(u => 
      u.id === user.id 
        ? { ...u, status: u.status === 'Restricted' ? 'Active' : 'Restricted' }
        : u
    ));
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setUsers(users.filter((u) => u.id !== userToDelete.id));
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
      setIsLoading(false);
      
      // Show success message
      alert(`User ${userToDelete.firstName} ${userToDelete.lastName} deleted successfully`);
    }, 500);
  };
  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setUserToDelete(null);
  };
  const handleEditSave = (updatedUser: any) => {
    if (!userToEdit) return;
    const [firstName, ...lastNameParts] = updatedUser.name.split(' ');
    const lastName = lastNameParts.join(' ');
    setUsers(users.map(u => 
      u.id === userToEdit.id 
        ? { 
            ...u, 
            firstName, 
            lastName, 
            email: updatedUser.email,
            phone: updatedUser.phone,
            role: updatedUser.role.charAt(0).toUpperCase() + updatedUser.role.slice(1),
            status: updatedUser.isActive ? 'Active' : 'Inactive'
          }
        : u
    ));
    setIsEditModalOpen(false);
    setUserToEdit(null);
  };

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      Admin: 'bg-purple-100 text-purple-800',
      Manager: 'bg-blue-100 text-blue-800',
      User: 'bg-green-100 text-green-800',
      Viewer: 'bg-gray-100 text-gray-800',
    };
    return colors[role as keyof typeof colors] || colors.User;
  };

  const getStatusBadgeColor = (status: string) => {
    const colors = {
      Active: 'bg-green-100 text-green-800',
      Inactive: 'bg-gray-100 text-gray-800',
      Suspended: 'bg-red-100 text-red-800',
      Restricted: 'bg-orange-100 text-orange-800',
    };
    return colors[status as keyof typeof colors] || colors.Inactive;
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-lg sm:text-2xl font-bold text-gray-900">User Management</h1>
        <p className="mt-1 text-xs sm:text-sm text-gray-600">
          Manage your team members and their account permissions
        </p>
      </div>

      {/* Desktop Table View */}
      <div className="bg-white rounded-lg shadow overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            {/* Table Header */}
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  {/* User Info */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {user.avatar ? (
                          <Image
                            className="h-10 w-10 rounded-full object-cover"
                            src={user.avatar}
                            alt={`${user.firstName} ${user.lastName}`}
                            width={40}
                            height={40}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                            {user.firstName.charAt(0)}
                            {user.lastName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.phone}</div>
                  </td>

                  {/* Role */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(
                        user.status
                      )}`}
                    >
                      {user.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {/* View Button */}
                      <button
                        onClick={() => handleViewUser(user)}
                        className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 p-2 rounded-lg transition-colors"
                        title="Edit User"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>

                      {/* Restrict/Unrestrict Button */}
                      <button
                        onClick={() => handleRestrictUser(user)}
                        className={`${user.status === 'Restricted' ? 'text-green-600 hover:text-green-900 hover:bg-green-50' : 'text-orange-600 hover:text-orange-900 hover:bg-orange-50'} p-2 rounded-lg transition-colors`}
                        title={user.status === 'Restricted' ? 'Unrestrict User' : 'Restrict User'}
                      >
                        {user.status === 'Restricted' ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                        )}
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteClick(user)}
                        className="text-red-600 hover:text-red-900 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        title="Delete User"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State - Desktop */}
        {users.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No users</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding a new user.
            </p>
          </div>
        )}
      </div>

      {/* Mobile Card View */}
      <div className="space-y-4 md:hidden">
        {users.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No users</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding a new user.
            </p>
          </div>
        ) : (
          users.map((user) => (
            <div key={user.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              {/* User Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0 h-10 w-10">
                    {user.avatar ? (
                      <Image
                        className="h-10 w-10 rounded-full object-cover"
                        src={user.avatar}
                        alt={`${user.firstName} ${user.lastName}`}
                        width={40}
                        height={40}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xs">
                        {user.firstName.charAt(0)}
                        {user.lastName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-xs text-gray-500 truncate">{user.email}</div>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${getStatusBadgeColor(
                    user.status
                  )}`}
                >
                  {user.status}
                </span>
              </div>

              {/* User Details */}
              <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Phone:</span>
                  <span className="text-gray-900 font-medium truncate ml-2">{user.phone}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Role:</span>
                  <span
                    className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getRoleBadgeColor(
                      user.role
                    )}`}
                  >
                    {user.role}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Joined:</span>
                  <span className="text-gray-900 font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 justify-end">
                <button
                  onClick={() => handleViewUser(user)}
                  className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 p-2 rounded-lg transition-colors flex-shrink-0"
                  title="View Details"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => handleEditUser(user)}
                  className="text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 p-2 rounded-lg transition-colors flex-shrink-0"
                  title="Edit User"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => handleDeleteClick(user)}
                  className="text-red-600 hover:text-red-900 hover:bg-red-50 p-2 rounded-lg transition-colors flex-shrink-0"
                  title="Delete User"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      <UserViewModal
        user={selectedUser}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        userName={
          userToDelete
            ? `${userToDelete.firstName} ${userToDelete.lastName}`
            : ''
        }
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      <AddUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onAdd={handleEditSave}
        user={userToEdit}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;
