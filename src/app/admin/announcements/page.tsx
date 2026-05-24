'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { SearchBar } from '@/components/ui/SearchBar';
import AnnouncementModal from '@/components/admin/AnnouncementModal';

export default function AnnouncementsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [announcements, setAnnouncements] = useState([
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
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<any>(null);

  const handleCreate = () => {
    setEditingAnnouncement(null);
    setIsModalOpen(true);
  };

  const handleEdit = (announcement: any) => {
    setEditingAnnouncement(announcement);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      setAnnouncements(announcements.filter(a => a.id !== id));
    }
  };

  const handleSave = (announcement: any) => {
    if (editingAnnouncement) {
      setAnnouncements(announcements.map(a => a.id === editingAnnouncement.id ? { ...announcement, id: editingAnnouncement.id } : a));
    } else {
      setAnnouncements([...announcements, { ...announcement, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  const filteredAnnouncements = announcements.filter((announcement) =>
    announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    announcement.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in-0 duration-500">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between animate-in slide-in-from-top-4 duration-500">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Announcements</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Create and manage group communications</p>
          </div>
          <button
            onClick={handleCreate}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B5D3B] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#094a2e] sm:w-auto"
          >
            <Plus size={16} />
              New Announcement
          </button>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '100ms' }}>
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="w-full lg:max-w-[420px]">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search announcements..."
                showButton={false}
                className="w-full"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm">Status</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700 text-xs sm:text-sm">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAnnouncements.map((announcement) => (
                  <tr key={announcement.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900 text-xs sm:text-sm">{announcement.title}</p>
                      <p className="mt-1 max-w-xl truncate text-xs text-gray-500">{announcement.message}</p>
                    </td>
                    <td className="py-3 px-4 text-xs sm:text-sm">
                      <p className="font-semibold text-[#0B5D3B]">{new Date(announcement.date).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-500">{announcement.audience}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${
                        announcement.status === 'Published'
                          ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                          : 'bg-amber-100 text-amber-700 border-amber-200'
                      }`}>
                        {announcement.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(announcement)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(announcement.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredAnnouncements.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-500">
                      No announcements found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <AnnouncementModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          announcement={editingAnnouncement}
        />
      </div>
  );
}
