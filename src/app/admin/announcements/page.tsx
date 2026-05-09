'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Megaphone, Plus, Calendar, Users } from 'lucide-react';

export default function AnnouncementsPage() {
  const announcements = [
    {
      id: 1,
      title: 'Monthly Meeting Reminder',
      message: 'Don\'t forget our monthly general meeting this Saturday at 2 PM. All members are required to attend.',
      date: '2024-01-20',
      audience: 'All Members',
      status: 'Published',
    },
    {
      id: 2,
      title: 'Share Payment Deadline',
      message: 'Monthly share payments are due by the 15th. Late payments will incur penalties.',
      date: '2024-01-10',
      audience: 'All Members',
      status: 'Published',
    },
    {
      id: 3,
      title: 'New Loan Application Process',
      message: 'We have updated our loan application process. Please review the new requirements.',
      date: '2024-01-05',
      audience: 'All Members',
      status: 'Draft',
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in-0 duration-500">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in slide-in-from-top-4 duration-500">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Announcements</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Create and manage group communications</p>
          </div>
          <Button className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
            <Plus size={16} />
            New Announcement
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '100ms' }}>
          {announcements.map((announcement) => (
            <Card key={announcement.id} hover>
              <CardContent>
                <div className="flex items-start justify-between mb-3">
                  <Megaphone size={20} className="text-primary-500 mt-1" />
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    announcement.status === 'Published'
                      ? 'bg-success-100 text-success-700'
                      : 'bg-warning-100 text-warning-700'
                  }`}>
                    {announcement.status}
                  </span>
                </div>

                <h3 className="font-semibold text-gray-900 mb-2">{announcement.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{announcement.message}</p>

                <div className="space-y-2 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span>{new Date(announcement.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={14} />
                    <span>{announcement.audience}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {announcements.length === 0 && (
          <Card>
            <CardContent>
              <div className="text-center py-8 sm:py-12">
                <Megaphone size={40} className="text-gray-400 mx-auto mb-4 sm:w-12 sm:h-12" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No Announcements Yet</h3>
                <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">Create your first announcement to communicate with group members.</p>
                <Button className="w-full sm:w-auto">
                  <Plus size={16} className="mr-2" />
                  Create Announcement
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
  );
}