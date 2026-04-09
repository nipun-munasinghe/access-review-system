import { FileText } from 'lucide-react';

import Button from '@/components/admin/Button';

interface GenerateReportButtonProps {
  onClick: () => void;
}

export default function GenerateReportButton({ onClick }: GenerateReportButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      className="rounded-2xl border border-white/60 bg-white/55 px-5 text-gray-900 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl hover:!border-[#7928CA]/18 hover:bg-linear-to-r hover:from-white/80 hover:via-[#7928CA]/[0.05] hover:to-[#38BDF8]/[0.08] hover:text-gray-900 hover:shadow-[0_16px_38px_rgba(121,40,202,0.12)] focus-visible:!border-[#7928CA]/25 focus-visible:ring-[#7928CA]/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:!border-[#38BDF8]/20 dark:hover:bg-linear-to-r dark:hover:from-white/10 dark:hover:via-[#7928CA]/15 dark:hover:to-[#0070F3]/15 dark:hover:text-white dark:hover:shadow-[0_16px_38px_rgba(56,189,248,0.12)] dark:focus-visible:ring-[#38BDF8]/20"
    >
      <FileText size={18} className="mr-2 text-gray-700 dark:text-white" />
      Generate Report
    </Button>
  );
}
