'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Eye, X } from 'lucide-react';
import { SearchBar } from '@/components/ui/SearchBar';
import DeleteConfirmModal from '@/components/ui/DeleteConfirmModal';

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
      status: 'Published',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingAnnouncement, setViewingAnnouncement] = useState<any>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: number | null; title: string }>({ isOpen: false, id: null, title: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [formData, setFormData] = useState({ title: '', message: '', date: '', audience: 'All Members' });

  const handleCreate = () => {
    setEditingAnnouncement(null);
    setFormData({ title: '', message: '', date: new Date().toISOString().split('T')[0], audience: 'All Members' });
    setIsModalOpen(true);
  };

  const handleEdit = (announcement: any) => {
    setEditingAnnouncement(announcement);
    setFormData({ title: announcement.title, message: announcement.message, date: announcement.date, audience: announcement.audience });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number, title: string) => {
    setDeleteModal({ isOpen: true, id, title });
  };

  const confirmDelete = () => {
    if (deleteModal.id) {
      setAnnouncements(announcements.filter(a => a.id !== deleteModal.id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const announcement = { ...formData, status: 'Published' };
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

  const totalPages = Math.ceil(filteredAnnouncements.length / itemsPerPage);
  const paginatedAnnouncements = filteredAnnouncements.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
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
                {paginatedAnnouncements.map((announcement) => (
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
                      <span className="px-2 sm:px-3 py-1 rounded-full text-xs font-medium border bg-emerald-100 text-emerald-700 border-emerald-200">
                        {announcement.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => { setViewingAnnouncement(announcement); setIsViewModalOpen(true); }}
                          className="p-1.5 hover:bg-emerald-50 text-emerald-700 rounded-lg transition-all active:scale-95"
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(announcement)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all active:scale-95"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(announcement.id, announcement.title)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all active:scale-95"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedAnnouncements.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-500">
                      No announcements found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
              Showing {paginatedAnnouncements.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredAnnouncements.length)} of {filteredAnnouncements.length}
            </p>
            <div className="flex gap-2 justify-center flex-wrap">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm rounded-lg transition ${
                    currentPage === page
                      ? 'bg-[#0B5D3B] text-white font-semibold'
                      : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {isViewModalOpen && viewingAnnouncement && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in-0 duration-200">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
              <div className="bg-[#0B5D3B] px-6 py-4 flex items-center justify-between flex-shrink-0">
                <h2 className="text-xl font-bold text-white">Announcement Details</h2>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-xs font-semibold text-gray-600 mb-2">Title</p>
                    <p className="text-lg font-bold text-gray-900">{viewingAnnouncement.title}</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-xs font-semibold text-gray-600 mb-2">Message</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{viewingAnnouncement.message}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <p className="text-xs font-semibold text-gray-600 mb-2">Date</p>
                      <p className="text-sm font-semibold text-gray-900">{new Date(viewingAnnouncement.date).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <p className="text-xs font-semibold text-gray-600 mb-2">Audience</p>
                      <p className="text-sm font-semibold text-gray-900">{viewingAnnouncement.audience}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-xs font-semibold text-gray-600 mb-2">Status</p>
                    <span className="inline-block px-3 py-1.5 rounded-full text-xs font-medium border bg-emerald-100 text-emerald-700 border-emerald-200">
                      {viewingAnnouncement.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex-shrink-0">
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="w-full px-4 py-3 bg-[#0B5D3B] text-white rounded-xl font-semibold hover:bg-[#094a2e] transition-all active:scale-95"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in-0 duration-200">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
              <div className="bg-[#0B5D3B] px-6 py-4 flex items-center justify-between flex-shrink-0">
                <h2 className="text-xl font-bold text-white">{editingAnnouncement ? 'Edit Announcement' : 'Create Announcement'}</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>

              <form onSubmit={handleSave} className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B5D3B] focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B5D3B] focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B5D3B] focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Audience</label>
                    <select
                      value={formData.audience}
                      onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B5D3B] focus:border-transparent"
                    >
                      <option value="All Members">All Members</option>
                      <option value="Active Members">Active Members</option>
                      <option value="Accountants">Accountants</option>
                    </select>
                  </div>
                </div>

                <div className="p-6 border-t border-gray-200 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-[#0B5D3B] text-white rounded-xl font-semibold hover:bg-[#094a2e] transition-all active:scale-95"
                  >
                    {editingAnnouncement ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <DeleteConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, id: null, title: '' })}
          onConfirm={confirmDelete}
          title="Delete Announcement"
          message="Are you sure you want to delete this announcement? This action cannot be undone."
          itemName={deleteModal.title}
        />
      </div>
  );
}
