'use client';

import { MemberLayout } from '@/components/layout/MemberLayout';
import { useState } from 'react';
import { Search, Filter, Eye, Trash2 } from 'lucide-react';

const mockNotifications = [
  { id: 1, title: 'Payment Verified', message: 'Your payment of 50,000 RWF has been verified', date: '2024-01-20 10:30', status: 'Unread' },
  { id: 2, title: 'Loan Approved', message: 'Your loan request of 400,000 RWF has been approved', date: '2024-01-19 14:20', status: 'Read' },
  { id: 3, title: 'Share Created', message: 'New share "Emergency Fund" has been created', date: '2024-01-18 09:15', status: 'Read' },
  { id: 4, title: 'Payment Reminder', message: 'Your next payment is due on 2024-02-15', date: '2024-01-17 08:00', status: 'Unread' },
  { id: 5, title: 'Guarantor Request', message: 'You have been selected as a guarantor for a loan', date: '2024-01-16 16:45', status: 'Read' },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredNotifications = notifications.filter(notif => {
    const matchesSearch = notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notif.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || notif.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleMarkAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: 'Read' } : n));
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this notification?')) {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }
  };

  return (
    <MemberLayout userName="Jean Baptiste Mugabo">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">View all your notifications and alerts</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option>All</option>
                <option>Read</option>
                <option>Unread</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {paginatedNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 rounded-xl border-2 transition-all ${
                  notif.status === 'Unread'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{notif.title}</h3>
                      {notif.status === 'Unread' && (
                        <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{notif.message}</p>
                    <p className="text-xs text-gray-500">{notif.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {notif.status === 'Unread' && (
                      <button
                        onClick={() => handleMarkAsRead(notif.id)}
                        className="p-2 hover:bg-green-100 text-green-600 rounded-lg transition-colors"
                        title="Mark as read"
                      >
                        <Eye size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notif.id)}
                      className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredNotifications.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No notifications found</p>
            </div>
          )}

          {filteredNotifications.length > 0 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-gray-600">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredNotifications.length)} of {filteredNotifications.length} entries
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </MemberLayout>
  );
}
