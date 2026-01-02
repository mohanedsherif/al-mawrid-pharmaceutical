import { useEffect, useState } from 'react';
import { getAllFeedbacks, updateFeedbackStatus, deleteFeedback, getPendingFeedbacksCount, type Feedback, type FeedbackResponseRequest } from '../../api/adminApi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Skeleton from '../../components/ui/Skeleton';

const AdminFeedbacksPage = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'PENDING' | 'APPROVED' | 'REJECTED'>('all');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [adminResponse, setAdminResponse] = useState('');
  const [newStatus, setNewStatus] = useState<'APPROVED' | 'REJECTED'>('APPROVED');

  useEffect(() => {
    fetchFeedbacks();
    fetchPendingCount();
  }, [page, statusFilter]);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const status = statusFilter === 'all' ? undefined : statusFilter;
      const data = await getAllFeedbacks(page, 20, status);
      setFeedbacks(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to fetch feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingCount = async () => {
    try {
      const count = await getPendingFeedbacksCount();
      setPendingCount(count);
    } catch (error) {
      console.error('Failed to fetch pending count:', error);
    }
  };

  const handleApprove = async (feedback: Feedback) => {
    try {
      const request: FeedbackResponseRequest = {
        status: 'APPROVED',
        adminResponse: adminResponse || undefined,
      };
      await updateFeedbackStatus(feedback.id, request);
      await fetchFeedbacks();
      await fetchPendingCount();
      setShowResponseModal(false);
      setAdminResponse('');
      setSelectedFeedback(null);
    } catch (error) {
      console.error('Failed to approve feedback:', error);
    }
  };

  const handleReject = async (feedback: Feedback) => {
    try {
      const request: FeedbackResponseRequest = {
        status: 'REJECTED',
        adminResponse: adminResponse || undefined,
      };
      await updateFeedbackStatus(feedback.id, request);
      await fetchFeedbacks();
      await fetchPendingCount();
      setShowResponseModal(false);
      setAdminResponse('');
      setSelectedFeedback(null);
    } catch (error) {
      console.error('Failed to reject feedback:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedFeedback) return;
    try {
      await deleteFeedback(selectedFeedback.id);
      await fetchFeedbacks();
      await fetchPendingCount();
      setShowDeleteModal(false);
      setSelectedFeedback(null);
    } catch (error) {
      console.error('Failed to delete feedback:', error);
    }
  };

  const openResponseModal = (feedback: Feedback, status: 'APPROVED' | 'REJECTED') => {
    setSelectedFeedback(feedback);
    setNewStatus(status);
    setAdminResponse('');
    setShowResponseModal(true);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
      APPROVED: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      REJECTED: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status as keyof typeof styles]}`}>
        {status}
      </span>
    );
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-slate-300 dark:text-slate-600'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  if (loading && feedbacks.length === 0) {
    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-6 w-3/4 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Feedbacks</p>
              <p className="text-2xl font-heading font-bold">{feedbacks.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Pending</p>
              <p className="text-2xl font-heading font-bold text-yellow-600 dark:text-yellow-400">{pendingCount}</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Approved</p>
              <p className="text-2xl font-heading font-bold text-green-600 dark:text-green-400">
                {feedbacks.filter(f => f.status === 'APPROVED').length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Rejected</p>
              <p className="text-2xl font-heading font-bold text-red-600 dark:text-red-400">
                {feedbacks.filter(f => f.status === 'REJECTED').length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Filter by Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as any);
              setPage(0);
            }}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </Card>

      {/* Feedbacks List */}
      <div className="space-y-4">
        {feedbacks.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-slate-600 dark:text-slate-400">No feedbacks found</p>
          </Card>
        ) : (
          feedbacks.map((feedback) => (
            <Card key={feedback.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{feedback.userName}</h3>
                    {getStatusBadge(feedback.status)}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{feedback.userEmail}</p>
                  {feedback.productName && (
                    <p className="text-sm text-slate-500 dark:text-slate-500 mb-2">
                      Product: <span className="font-medium">{feedback.productName}</span>
                    </p>
                  )}
                  <div className="flex items-center gap-2 mb-3">
                    {renderStars(feedback.rating)}
                    <span className="text-sm text-slate-600 dark:text-slate-400">({feedback.rating}/5)</span>
                  </div>
                  {feedback.comment && (
                    <p className="text-slate-700 dark:text-slate-300 mb-3">{feedback.comment}</p>
                  )}
                  {feedback.adminResponse && (
                    <div className="mt-3 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
                      <p className="text-xs font-semibold text-primary-700 dark:text-primary-400 mb-1">Admin Response:</p>
                      <p className="text-sm text-slate-700 dark:text-slate-300">{feedback.adminResponse}</p>
                    </div>
                  )}
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                    {new Date(feedback.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  {feedback.status === 'PENDING' && (
                    <>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => openResponseModal(feedback, 'APPROVED')}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => openResponseModal(feedback, 'REJECTED')}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedFeedback(feedback);
                      setShowDeleteModal(true);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            Previous
          </Button>
          <span className="text-sm text-slate-600 dark:text-slate-400">
            Page {page + 1} of {totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
          >
            Next
          </Button>
        </div>
      )}

      {/* Response Modal */}
      <Modal
        isOpen={showResponseModal}
        onClose={() => {
          setShowResponseModal(false);
          setSelectedFeedback(null);
          setAdminResponse('');
        }}
        title={newStatus === 'APPROVED' ? 'Approve Feedback' : 'Reject Feedback'}
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowResponseModal(false)}>
              Cancel
            </Button>
            <Button
              variant={newStatus === 'APPROVED' ? 'primary' : 'secondary'}
              onClick={() => {
                if (newStatus === 'APPROVED') {
                  handleApprove(selectedFeedback!);
                } else {
                  handleReject(selectedFeedback!);
                }
              }}
            >
              {newStatus === 'APPROVED' ? 'Approve' : 'Reject'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Admin Response (Optional)</label>
            <textarea
              value={adminResponse}
              onChange={(e) => setAdminResponse(e.target.value)}
              className="input"
              rows={4}
              placeholder="Add a response to this feedback..."
            />
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedFeedback(null);
        }}
        title="Delete Feedback"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="secondary" onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-slate-600 dark:text-slate-400">
          Are you sure you want to delete this feedback? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default AdminFeedbacksPage;

