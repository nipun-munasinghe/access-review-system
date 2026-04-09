import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Loader, MapPinned, ShieldAlert, Star, Trash2, Users } from 'lucide-react';
import { toast } from 'react-toastify';
import SummaryCard from '../../components/admin/SummaryCard';
import DataTable, { type Column } from '../../components/admin/DataTable';
import Badge from '../../components/admin/Badge';
import Modal from '../../components/admin/Modal';
import Button from '../../components/admin/Button';
import reviewService from '../../services/review.service';
import type { AccessibilityReview } from '../../types/review.type';

type ReviewRow = {
  id: string;
  title: string;
  reviewer: string;
  space: string;
  rating: number;
  status: string;
  date: string;
  comment: string;
  featureCount: number;
  rawReview: AccessibilityReview;
};

const getUserLabel = (reviewer: AccessibilityReview['userId']) => {
  if (typeof reviewer === 'string') {
    return reviewer;
  }

  const fullName = [reviewer?.name, reviewer?.surname].filter(Boolean).join(' ').trim();
  return fullName || reviewer?.email || 'Unknown user';
};

const getSpaceLabel = (space: AccessibilityReview['spaceId']) => {
  if (typeof space === 'string') {
    return space;
  }

  return space?.name || space?.location || space?.category || 'Unknown space';
};

const getRatingVariant = (rating: number) => {
  if (rating >= 4) return 'success';
  if (rating >= 3) return 'info';
  if (rating >= 2) return 'warning';
  return 'danger';
};

const COLUMNS: Column[] = [
  {
    key: 'title',
    header: 'Review',
    render: (row: ReviewRow) => (
      <div className="max-w-[16rem]">
        <p className="font-semibold text-gray-900 dark:text-white truncate transition-colors">
          {row.title}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate transition-colors">
          {row.comment}
        </p>
      </div>
    ),
  },
  {
    key: 'space',
    header: 'Public Space',
    render: (row: ReviewRow) => (
      <span className="text-gray-700 dark:text-gray-300">{row.space}</span>
    ),
  },
  {
    key: 'reviewer',
    header: 'Reviewer',
    render: (row: ReviewRow) => (
      <span className="text-gray-700 dark:text-gray-300">{row.reviewer}</span>
    ),
  },
  {
    key: 'rating',
    header: 'Rating',
    render: (row: ReviewRow) => (
      <div className="flex items-center gap-1.5">
        <span className="font-semibold text-gray-900 dark:text-white">{row.rating}</span>
        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
      </div>
    ),
  },
  {
    key: 'status',
    header: 'Sentiment',
    render: (row: ReviewRow) => (
      <Badge variant={getRatingVariant(row.rating) as 'success' | 'warning' | 'danger' | 'info'}>
        {row.status}
      </Badge>
    ),
  },
  {
    key: 'date',
    header: 'Date',
    render: (row: ReviewRow) => (
      <span className="text-gray-500 dark:text-gray-400 transition-colors">{row.date}</span>
    ),
  },
];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<AccessibilityReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReview, setSelectedReview] = useState<AccessibilityReview | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await reviewService.getAllReviews(1, 100);
      setReviews(response.data.result || []);
    } catch (requestError) {
      console.error('Failed to load accessibility reviews:', requestError);
      setError('Failed to load accessibility reviews. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const reviewRows = useMemo<ReviewRow[]>(
    () =>
      reviews.map((review) => {
        const title = review.title?.trim() || 'Untitled review';
        const comment = review.comment?.trim() || 'No review comment provided.';
        const ratingStatus =
          review.rating >= 4 ? 'Positive' : review.rating >= 3 ? 'Mixed' : 'Needs attention';

        return {
          id: review._id || `${title}-${review.createdAt || ''}`,
          title,
          reviewer: getUserLabel(review.userId),
          space: getSpaceLabel(review.spaceId),
          rating: review.rating,
          status: ratingStatus,
          date: review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'N/A',
          comment,
          featureCount: review.features?.length || 0,
          rawReview: review,
        };
      }),
    [reviews],
  );

  const summary = useMemo(() => {
    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1)
        : '0.0';
    const positiveReviews = reviews.filter((review) => review.rating >= 4).length;
    const attentionReviews = reviews.filter((review) => review.rating <= 2).length;

    return {
      totalReviews,
      averageRating,
      positiveReviews,
      attentionReviews,
    };
  }, [reviews]);

  const handleViewReview = (row: ReviewRow) => {
    setSelectedReview(row.rawReview);
    setIsViewOpen(true);
  };

  const handleDeleteReview = (row: ReviewRow) => {
    setSelectedReview(row.rawReview);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedReview?._id) {
      return;
    }

    setIsDeleting(true);

    try {
      await reviewService.deleteReview(selectedReview._id);
      toast.success('Review deleted successfully.');
      await loadReviews();
      setIsDeleteOpen(false);
      setSelectedReview(null);
    } catch (requestError) {
      console.error('Failed to delete review:', requestError);
      toast.error('Failed to delete review. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
          <Loader className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </motion.div>
      </div>
    );
  }

  const selectedUser = selectedReview ? getUserLabel(selectedReview.userId) : 'N/A';
  const selectedSpace = selectedReview ? getSpaceLabel(selectedReview.spaceId) : 'N/A';

  return (
    <>
      <div className="space-y-8">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-xl flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900 dark:text-red-200">{error}</p>
              <Button onClick={loadReviews} className="mt-2 px-3 py-1 text-sm" variant="danger">
                Retry
              </Button>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SummaryCard
            title="Total Reviews"
            value={summary.totalReviews}
            icon={Users}
            delay={0.1}
          />
          <SummaryCard
            title="Average Rating"
            value={summary.averageRating}
            icon={Star}
            delay={0.2}
          />
          <SummaryCard
            title="Positive Reviews"
            value={summary.positiveReviews}
            icon={MapPinned}
            delay={0.3}
          />
          <SummaryCard
            title="Needs Attention"
            value={summary.attentionReviews}
            icon={ShieldAlert}
            delay={0.4}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <DataTable
            title="Accessibility Reviews"
            columns={COLUMNS}
            data={reviewRows}
            onView={handleViewReview}
            onDelete={handleDeleteReview}
          />
        </motion.div>
      </div>

      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title="Review Details"
        size="lg"
      >
        {selectedReview ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-gray-50 dark:bg-gray-800 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
                  Reviewer
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">{selectedUser}</p>
              </div>
              <div className="rounded-2xl bg-gray-50 dark:bg-gray-800 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
                  Public Space
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">{selectedSpace}</p>
              </div>
              <div className="rounded-2xl bg-gray-50 dark:bg-gray-800 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
                  Rating
                </p>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedReview.rating}/5
                  </p>
                  <Badge
                    variant={
                      getRatingVariant(selectedReview.rating) as
                        | 'success'
                        | 'warning'
                        | 'danger'
                        | 'info'
                    }
                  >
                    {selectedReview.rating >= 4
                      ? 'Positive'
                      : selectedReview.rating >= 3
                        ? 'Mixed'
                        : 'Needs attention'}
                  </Badge>
                </div>
              </div>
              <div className="rounded-2xl bg-gray-50 dark:bg-gray-800 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
                  Submitted
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {selectedReview.createdAt
                    ? new Date(selectedReview.createdAt).toLocaleString()
                    : 'N/A'}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 dark:border-gray-800 p-5 bg-white dark:bg-gray-900">
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
                Title
              </p>
              <p className="text-base font-semibold text-gray-900 dark:text-white">
                {selectedReview.title?.trim() || 'Untitled review'}
              </p>
              <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300 whitespace-pre-line">
                {selectedReview.comment}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 dark:border-gray-800 p-5 bg-white dark:bg-gray-900">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
                    Accessibility Features
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {selectedReview.features?.length || 0} feature checks submitted
                  </p>
                </div>
              </div>

              {selectedReview.features && selectedReview.features.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {selectedReview.features.map((feature, index) => (
                    <div
                      key={`${feature.featureName}-${index}`}
                      className="rounded-xl bg-gray-50 dark:bg-gray-800 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {feature.featureName}
                        </p>
                        <Badge variant={feature.available ? 'success' : 'danger'}>
                          {feature.available ? 'Available' : 'Not available'}
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 capitalize">
                        Condition: {feature.condition.replace('_', ' ')}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No feature breakdown was submitted with this review.
                </p>
              )}
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Review"
        size="md"
      >
        <div className="space-y-6">
          <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
            This will permanently remove the selected accessibility review from the admin view.
          </p>

          <div className="rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 p-4">
            <p className="text-sm font-semibold text-red-900 dark:text-red-200">
              {selectedReview?.title?.trim() || 'Untitled review'}
            </p>
            <p className="text-xs text-red-700 dark:text-red-300 mt-1">
              {selectedReview ? `${selectedUser} · ${selectedSpace}` : 'No review selected'}
            </p>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete} disabled={isDeleting}>
              <Trash2 size={16} className="mr-2" />
              {isDeleting ? 'Deleting...' : 'Delete Review'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
