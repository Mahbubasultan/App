'use client';

import React, { useState } from 'react';
import { X, Check, AlertCircle, DollarSign, UserCheck, Bell, Trash2 } from 'lucide-react';

interface Notification {
  id: string;
  type: 'payment' | 'loan' | 'guarantor' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: string;
}

export const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({ isOpen, onClose, userRole }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'payment',
      title: 'Payment Approved',
      message: 'Your payment of 50,000 RWF has been approved',
      time: '5 min ago',
      read: false,
    },
    {
      id: '2',
      type: 'loan',
      title: 'Loan Request Update',
      message: 'Your loan request of 400,000 RWF is under review',
      time: '1 hour ago',
      read: false,
    },
    {
      id: '3',
      type: 'guarantor',
      title: 'Guarantor Request',
      message: 'Jean Baptiste requested you as a guarantor',
      time: '2 hours ago',
      read: true,
    },
    {
      id: '4',
      type: 'system',
      title: 'Payment Reminder',
      message: 'Your next payment is due on Feb 15, 2024',
      time: '1 day ago',
      read: true,
    },
    {
      id: '5',
      type: 'payment',
      title: 'Payment Received',
      message: 'Payment of 75,000 RWF received from Marie Claire',
      time: '2 days ago',
      read: true,
    },
  ]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <DollarSign size={20} className="text-green-600" />;
      case 'loan':
        return <AlertCircle size={20} className="text-orange-600" />;
      case 'guarantor':
        return <UserCheck size={20} className="text-blue-600" />;
      case 'system':
        return <Bell size={20} className="text-purple-600" />;
      default:
        return <Bell size={20} className="text-gray-600" />;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
      
      {/* Dropdown */}
      <div className="absolute right-0 mt-2 w-full sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 animate-in slide-in-from-top-4 fade-in-0 duration-200 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <p className="text-xs text-gray-600">{unreadCount} unread</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-[#0B5D3B] font-semibold hover:underline"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto touch-pan-y">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-600 font-medium">No notifications</p>
              <p className="text-sm text-gray-500 mt-1">You&apos;re all caught up!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors group ${
                    !notification.read ? 'bg-blue-50/50' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-semibold ${
                          !notification.read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-[#0B5D3B] rounded-full flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-500">{notification.time}</p>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-1.5 hover:bg-green-100 text-green-600 rounded-lg transition-colors"
                              title="Mark as read"
                            >
                              <Check size={14} />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1.5 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-gray-200 flex-shrink-0">
            <button
              onClick={clearAll}
              className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg font-semibold transition-colors"
            >
              Clear All Notifications
            </button>
          </div>
        )}
      </div>
    </>
  );
};
