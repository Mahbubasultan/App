'use client';

import React from 'react';
import UserTable from '@/components/admin/UserTable';

export default function UserManagementPage() {
  return (
    <div className="w-full">
      <div className="space-y-4 sm:space-y-6">
        <div className="animate-in slide-in-from-top-4 duration-500">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Manage group members and their account permissions</p>
        </div>
        <UserTable />
      </div>
    </div>
  );
}
