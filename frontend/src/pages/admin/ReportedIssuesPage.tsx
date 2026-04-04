import { AlertCircle, CheckCircle2, Clock, Edit3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import SummaryCard from '../../components/admin/SummaryCard';
import DataTable, { type Column } from '../../components/admin/DataTable';
import Badge from '../../components/admin/Badge';
import Modal from '../../components/admin/Modal';
import Button from '../../components/admin/Button';

interface Issue {
  id: number;
  title: string;
  location: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved';
  reporter: string;
  reportedDate: string;
  description: string;
}

const REPORTED_ISSUES_DATA: Issue[] = [
  {
    id: 1,
    title: 'Wheelchair access blocked',
    location: 'City Mall - Main Entrance',
    severity: 'High',
    status: 'Open',
    reporter: 'John Doe',
    reportedDate: '2024-04-02',
    description:
      'The main entrance has a broken wheelchair ramp that prevents wheelchair users from accessing the building.',
  },
  {
    id: 2,
    title: 'Elevator not functioning',
    location: 'Central Park - Building A',
    severity: 'Critical',
    status: 'In Progress',
    reporter: 'Sarah Smith',
    reportedDate: '2024-04-01',
    description:
      'Second floor elevator is out of service. This prevents persons with mobility issues from accessing upper floors.',
  },
  {
    id: 3,
    title: 'Parking spaces unavailable',
    location: 'Metro Hub - Parking Level 2',
    severity: 'Medium',
    status: 'Resolved',
    reporter: 'Mike Johnson',
    reportedDate: '2024-03-30',
    description: 'Accessible parking spaces are occupied by regular vehicles.',
  },
  {
    id: 4,
    title: 'Braille signage missing',
    location: 'Library Downtown',
    severity: 'Medium',
    status: 'Open',
    reporter: 'Emily Davis',
    reportedDate: '2024-03-28',
    description:
      'Braille labels missing from elevator buttons, making navigation difficult for visually impaired users.',
  },
  {
    id: 5,
    title: 'Door automation issue',
    location: 'Hospital Wing C',
    severity: 'High',
    status: 'In Progress',
    reporter: 'Robert Brown',
    reportedDate: '2024-03-25',
    description: 'Automatic door opener not working properly. Manual force required to open doors.',
  },
];

const COLUMNS: Column[] = [
  {
    key: 'title',
    header: 'Issue Title',
    render: (row) => <span className="font-medium text-gray-900 dark:text-white">{row.title}</span>,
  },
  {
    key: 'location',
    header: 'Location',
    render: (row) => <span className="text-gray-700 dark:text-gray-300">{row.location}</span>,
  },
  {
    key: 'severity',
    header: 'Severity',
    render: (row) => {
      const severityColors = {
        Critical: 'danger',
        High: 'warning',
        Medium: 'info',
        Low: 'success',
      } as const;
      return (
        <Badge variant={severityColors[row.severity as keyof typeof severityColors] || 'default'}>
          {row.severity}
        </Badge>
      );
    },
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => {
      const statusVariants = {
        Open: 'warning',
        'In Progress': 'info',
        Resolved: 'success',
      } as const;
      return (
        <Badge variant={statusVariants[row.status as keyof typeof statusVariants] || 'default'}>
          {row.status}
        </Badge>
      );
    },
  },
  {
    key: 'reporter',
    header: 'Reported By',
    render: (row) => <span className="text-gray-700 dark:text-gray-300">{row.reporter}</span>,
  },
  {
    key: 'reportedDate',
    header: 'Date',
    render: (row) => (
      <span className="text-gray-700 dark:text-gray-300 text-sm">{row.reportedDate}</span>
    ),
  },
];

export default function ReportedIssuesPage() {
  const [issues, setIssues] = useState<Issue[]>(REPORTED_ISSUES_DATA);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Issue>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleViewIssue = (issue: Issue) => {
    setSelectedIssue(issue);
    setViewModalOpen(true);
  };

  const handleEditIssue = (issue: Issue) => {
    setSelectedIssue(issue);
    setEditFormData(issue);
    setEditModalOpen(true);
  };

  const handleDeleteIssue = (issue: Issue) => {
    setSelectedIssue(issue);
    setDeleteModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedIssue) return;
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIssues(
        issues.map((issue) =>
          issue.id === selectedIssue.id ? { ...issue, ...editFormData } : issue,
        ),
      );
      setEditModalOpen(false);
      setSelectedIssue(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedIssue) return;
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIssues(issues.filter((issue) => issue.id !== selectedIssue.id));
      setDeleteModalOpen(false);
      setSelectedIssue(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SummaryCard title="Total Issues" value={issues.length} icon={AlertCircle} delay={0.1} />
          <SummaryCard
            title="Open Issues"
            value={issues.filter((i) => i.status === 'Open').length}
            icon={Clock}
            delay={0.2}
          />
          <SummaryCard
            title="In Progress"
            value={issues.filter((i) => i.status === 'In Progress').length}
            icon={Edit3}
            delay={0.3}
          />
          <SummaryCard
            title="Resolved"
            value={issues.filter((i) => i.status === 'Resolved').length}
            icon={CheckCircle2}
            delay={0.4}
          />
        </div>

        {/* Data Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <DataTable
            title="Reported Issues"
            columns={COLUMNS}
            data={issues}
            onView={handleViewIssue}
            onEdit={handleEditIssue}
            onDelete={handleDeleteIssue}
          />
        </motion.div>

        {/* Issue Statistics Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 shadow-sm border border-gray-100 dark:border-gray-800 transition-colors duration-300"
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-300">
            Issue Distribution
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Severity Distribution */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                By Severity
              </h3>
              <div className="space-y-3">
                {[
                  {
                    label: 'Critical',
                    count: issues.filter((i) => i.severity === 'Critical').length,
                    color: 'bg-red-500',
                  },
                  {
                    label: 'High',
                    count: issues.filter((i) => i.severity === 'High').length,
                    color: 'bg-orange-500',
                  },
                  {
                    label: 'Medium',
                    count: issues.filter((i) => i.severity === 'Medium').length,
                    color: 'bg-yellow-500',
                  },
                  {
                    label: 'Low',
                    count: issues.filter((i) => i.severity === 'Low').length,
                    color: 'bg-green-500',
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Distribution */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                By Status
              </h3>
              <div className="space-y-3">
                {[
                  {
                    label: 'Open',
                    count: issues.filter((i) => i.status === 'Open').length,
                    color: 'bg-blue-500',
                  },
                  {
                    label: 'In Progress',
                    count: issues.filter((i) => i.status === 'In Progress').length,
                    color: 'bg-purple-500',
                  },
                  {
                    label: 'Resolved',
                    count: issues.filter((i) => i.status === 'Resolved').length,
                    color: 'bg-green-500',
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Response Time */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                Average Response Time
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Critical', time: '2 hours' },
                  { label: 'High', time: '8 hours' },
                  { label: 'Medium', time: '24 hours' },
                  { label: 'Low', time: '48 hours' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* View Issue Modal */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title={selectedIssue?.title || 'View Issue'}
        size="lg"
      >
        {selectedIssue && (
          <div className="space-y-6">
            {/* Header with Status */}
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {selectedIssue.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{selectedIssue.location}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Badge
                  variant={
                    selectedIssue.severity === 'Critical'
                      ? 'danger'
                      : selectedIssue.severity === 'High'
                        ? 'warning'
                        : 'info'
                  }
                >
                  {selectedIssue.severity}
                </Badge>
                <Badge
                  variant={
                    selectedIssue.status === 'Resolved'
                      ? 'success'
                      : selectedIssue.status === 'In Progress'
                        ? 'info'
                        : 'warning'
                  }
                >
                  {selectedIssue.status}
                </Badge>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Reported By
                </p>
                <p className="text-gray-900 dark:text-white font-semibold">
                  {selectedIssue.reporter}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Reported Date
                </p>
                <p className="text-gray-900 dark:text-white font-semibold">
                  {selectedIssue.reportedDate}
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Description
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {selectedIssue.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
              <Button
                onClick={() => {
                  setViewModalOpen(false);
                  handleEditIssue(selectedIssue);
                }}
                className="flex-1 h-10 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all"
              >
                Edit Issue
              </Button>
              <Button
                onClick={() => setViewModalOpen(false)}
                className="flex-1 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Issue Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Issue"
        size="md"
      >
        {selectedIssue && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveEdit();
            }}
            className="space-y-4"
          >
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                value={editFormData.status || selectedIssue.status}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    status: e.target.value as Issue['status'],
                  })
                }
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-700 transition-all text-gray-900 dark:text-white"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            {/* Severity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Severity
              </label>
              <select
                value={editFormData.severity || selectedIssue.severity}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    severity: e.target.value as Issue['severity'],
                  })
                }
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-700 transition-all text-gray-900 dark:text-white"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes
              </label>
              <textarea
                value={editFormData.description || selectedIssue.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-700 transition-all text-gray-900 dark:text-white resize-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 h-10 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 transition-all"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="flex-1 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Issue"
        size="sm"
      >
        {selectedIssue && (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Delete Issue Report?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Are you sure you want to delete this issue report? This action cannot be undone.
                </p>
              </div>
            </div>

            {/* Issue Details */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                {selectedIssue.title}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{selectedIssue.location}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleConfirmDelete}
                disabled={isSubmitting}
                className="flex-1 h-10 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-50 transition-all"
              >
                {isSubmitting ? 'Deleting...' : 'Delete'}
              </Button>
              <Button
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
