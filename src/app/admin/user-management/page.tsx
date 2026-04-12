'use client';

import React from 'react';
import UserTable from '@/components/admin/UserTable';

export default function UserManagementPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <UserTable />
      </div>
    </div>
  );
}
