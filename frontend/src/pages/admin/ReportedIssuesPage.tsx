import { AlertCircle, CheckCircle2, Clock, Edit3 } from 'lucide-react';
import { motion } from 'framer-motion';
import SummaryCard from '../../components/admin/SummaryCard';
import DataTable, { type Column } from '../../components/admin/DataTable';
import Badge from '../../components/admin/Badge';

const REPORTED_ISSUES_DATA = [
  {
    id: 1,
    title: 'Wheelchair access blocked',
    location: 'City Mall - Main Entrance',
    severity: 'High',
    status: 'Open',
    reporter: 'John Doe',
    reportedDate: '2024-04-02',
    description: 'The main entrance has a broken wheelchair ramp',
  },
  {
    id: 2,
    title: 'Elevator not functioning',
    location: 'Central Park - Building A',
    severity: 'Critical',
    status: 'In Progress',
    reporter: 'Sarah Smith',
    reportedDate: '2024-04-01',
    description: 'Second floor elevator is out of service',
  },
  {
    id: 3,
    title: 'Parking spaces unavailable',
    location: 'Metro Hub - Parking Level 2',
    severity: 'Medium',
    status: 'Resolved',
    reporter: 'Mike Johnson',
    reportedDate: '2024-03-30',
    description: 'Accessible parking spaces are occupied',
  },
  {
    id: 4,
    title: 'Braille signage missing',
    location: 'Library Downtown',
    severity: 'Medium',
    status: 'Open',
    reporter: 'Emily Davis',
    reportedDate: '2024-03-28',
    description: 'Braille labels missing from elevator buttons',
  },
  {
    id: 5,
    title: 'Door automation issue',
    location: 'Hospital Wing C',
    severity: 'High',
    status: 'In Progress',
    reporter: 'Robert Brown',
    reportedDate: '2024-03-25',
    description: 'Automatic door opener not working properly',
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
  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard title="Total Issues" value={24} icon={AlertCircle} delay={0.1} />
        <SummaryCard title="Open Issues" value={12} icon={Clock} delay={0.2} />
        <SummaryCard title="In Progress" value={8} icon={Edit3} delay={0.3} />
        <SummaryCard title="Resolved" value={4} icon={CheckCircle2} delay={0.4} />
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
          data={REPORTED_ISSUES_DATA}
          onView={(row) => console.log('View issue:', row)}
          onEdit={(row) => console.log('Edit issue:', row)}
          onDelete={(row) => console.log('Delete issue:', row)}
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
                { label: 'Critical', count: 1, color: 'bg-red-500' },
                { label: 'High', count: 6, color: 'bg-orange-500' },
                { label: 'Medium', count: 12, color: 'bg-yellow-500' },
                { label: 'Low', count: 5, color: 'bg-green-500' },
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
                { label: 'Open', count: 12, color: 'bg-blue-500' },
                { label: 'In Progress', count: 8, color: 'bg-purple-500' },
                { label: 'Resolved', count: 4, color: 'bg-green-500' },
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
  );
}
