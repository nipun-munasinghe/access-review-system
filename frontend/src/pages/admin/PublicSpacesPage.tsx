import { useState, useEffect, useCallback } from 'react';
import { Plus, Download, Loader2, X, MapPin, Tag, FileText, Image, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import Button from '../../components/admin/Button';
import DataTable, { type Column } from '../../components/admin/DataTable';
import publicSpaceService from '../../services/public-space.service';
import { useToast } from '../../hooks/useToast';
import type { PublicSpace, SpaceCategory } from '../../types/publicSpace.type';

// types
type ModalMode = 'add' | 'edit' | 'view' | null;

interface FormValues {
  name: string;
  category: SpaceCategory;
  address: string;
  lat: string;
  lng: string;
  imageUrl: string;
  description: string;
}

const CATEGORIES: SpaceCategory[] = ['Mall', 'Park', 'Hospital', 'Station', 'Other'];

const CATEGORY_COLORS: Record<SpaceCategory, string> = {
  Mall: 'text-purple-400',
  Park: 'text-green-400',
  Hospital: 'text-red-400',
  Station: 'text-blue-400',
  Other: 'text-gray-400',
};

//Validations
const validationSchema = Yup.object({
  name: Yup.string()
    .required('Space name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must not exceed 100 characters')
    .trim(),
  category: Yup.string()
    .required('Category is required')
    .oneOf(CATEGORIES, 'Invalid category'),
  address: Yup.string()
    .required('Address is required')
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address must not exceed 200 characters')
    .trim(),
  lat: Yup.number()
    .typeError('Latitude must be a number')
    .required('Latitude is required')
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90'),
  lng: Yup.number()
    .typeError('Longitude must be a number')
    .required('Longitude is required')
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180'),
  imageUrl: Yup.string().url('Must be a valid URL').optional(),
  description: Yup.string().max(500, 'Description must not exceed 500 characters').optional(),
});

const blankValues = (): FormValues => ({
  name: '',
  category: 'Mall',
  address: '',
  lat: '',
  lng: '',
  imageUrl: '',
  description: '',
});

const spaceToFormValues = (space: PublicSpace): FormValues => ({
  name: space.name,
  category: space.category,
  address: space.locationDetails.address,
  lat: String(space.locationDetails.coordinates.lat),
  lng: String(space.locationDetails.coordinates.lng),
  imageUrl: space.imageUrl ?? '',
  description: space.description ?? '',
});

//PDF Download───
function downloadPDF(spaces: PublicSpace[]) {
  const doc = new jsPDF({ orientation: 'landscape' });
  doc.setFontSize(16);
  doc.text('Public Spaces Directory', 14, 16);
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 23);

  autoTable(doc, {
    startY: 28,
    head: [['#', 'Name', 'Category', 'Address', 'Latitude', 'Longitude', 'Description']],
    body: spaces.map((s, i) => [
      i + 1,
      s.name,
      s.category,
      s.locationDetails.address,
      s.locationDetails.coordinates.lat,
      s.locationDetails.coordinates.lng,
      s.description ?? '—',
    ]),
    headStyles: { fillColor: [139, 92, 246] },
    alternateRowStyles: { fillColor: [245, 245, 250] },
    styles: { fontSize: 9 },
  });

  doc.save('public-spaces.pdf');
}

//Shared input
const inputCls = (invalid: boolean) =>
  `w-full px-3.5 py-2.5 rounded-lg text-sm text-white bg-gray-700/70 border transition-all
   focus:outline-none focus:ring-2 focus:ring-purple-500/40
   placeholder:text-gray-500
   ${invalid ? 'border-red-500/70' : 'border-gray-600/60 focus:border-purple-500/60'}`;

export default function PublicSpacesPage() {
  const { success: showSuccess, error: showError } = useToast();

  const [spaces, setSpaces] = useState<PublicSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedSpace, setSelectedSpace] = useState<PublicSpace | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PublicSpace | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  //  Fetch all spaces
  const fetchSpaces = useCallback(async () => {
    try {
      setLoading(true);
      const data = await publicSpaceService.getAllPublicSpaces();
      setSpaces(data);
    } catch {
      showError('Failed to load public spaces.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSpaces();
  }, [fetchSpaces]);

  const formik = useFormik<FormValues>({
    initialValues: blankValues(),
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      const payload = {
        name: values.name.trim(),
        category: values.category,
        locationDetails: {
          address: values.address.trim(),
          coordinates: {
            lat: parseFloat(values.lat),
            lng: parseFloat(values.lng),
          },
        },
        imageUrl: values.imageUrl.trim() || undefined,
        description: values.description.trim() || undefined,
      };

      try {
        if (modalMode === 'add') {
          await publicSpaceService.createPublicSpace(payload);
          showSuccess('Public space created successfully!');
        } else if (modalMode === 'edit' && selectedSpace) {
          await publicSpaceService.updatePublicSpace(selectedSpace._id, payload);
          showSuccess('Public space updated successfully!');
        }
        closeModal();
        fetchSpaces();
      } catch (err) {
        const e = err as { response?: { data?: { message?: string } } };
        showError(e.response?.data?.message ?? 'Something went wrong. Please try again.');
      }
    },
  });

  const openAdd = () => {
    formik.resetForm({ values: blankValues() });
    setSelectedSpace(null);
    setModalMode('add');
  };

  const openEdit = (space: PublicSpace) => {
    formik.resetForm({ values: spaceToFormValues(space) });
    setSelectedSpace(space);
    setModalMode('edit');
  };

  const openView = (space: PublicSpace) => {
    setSelectedSpace(space);
    setModalMode('view');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedSpace(null);
    formik.resetForm();
  };

  // Delete
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleteLoading(true);
      await publicSpaceService.deletePublicSpace(deleteTarget._id);
      showSuccess('Public space deleted successfully!');
      setDeleteTarget(null);
      fetchSpaces();
    } catch {
      showError('Failed to delete public space.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Table columns
  const columns: Column[] = [
    {
      key: 'name',
      header: 'Name',
      render: (row) => (
        <span className="font-medium text-white">{row.name}</span>
      ),
    },
    {
      key: 'locationDetails',
      header: 'Address',
      render: (row) => (
        <span className="text-gray-300 max-w-50 truncate block">
          {row.locationDetails.address}
        </span>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (row: PublicSpace) => (
        <span className={`font-medium ${CATEGORY_COLORS[row.category]}`}>
          {row.category}
        </span>
      ),
    },
    {
      key: 'coordinates',
      header: 'Coordinates',
      render: (row) => (
        <span className="font-mono text-xs text-gray-400">
          {row.locationDetails.coordinates.lat.toFixed(4)},{' '}
          {row.locationDetails.coordinates.lng.toFixed(4)}
        </span>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (row) => (
        <span className="text-gray-400 text-xs max-w-40 truncate block">
          {row.description || '—'}
        </span>
      ),
    },
  ];

  const fieldErr = (k: keyof FormValues) =>
    formik.touched[k] && formik.errors[k] ? formik.errors[k] : undefined;

  const isInvalid = (k: keyof FormValues) => !!(formik.touched[k] && formik.errors[k]);

  //PDF download button (passed as toolbarActions to DataTable)
  const pdfButton = (
    <button
      onClick={() => downloadPDF(spaces)}
      aria-label="Download PDF"
      title="Download as PDF"
      className="p-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white
                 transition-colors flex items-center gap-1.5 text-xs"
    >
      <Download size={14} />
      <span className="hidden sm:inline">PDF</span>
    </button>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="space-y-6"
    >
      {/* Top bar  */}
      <div className="flex justify-end">
        <Button variant="primary" gradient onClick={openAdd}>
          <Plus size={16} className="mr-1.5" />
          Add Public Space
        </Button>
      </div>

      {/* Loading skeleton */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-10 rounded-lg bg-gray-700/50 animate-pulse"
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>
      ) : (
        /* DataTable */
        <DataTable
          title="All Public Spaces"
          columns={columns}
          data={spaces}
          onView={(row) => openView(row as PublicSpace)}
          onEdit={(row) => openEdit(row as PublicSpace)}
          onDelete={(row) => setDeleteTarget(row as PublicSpace)}
          toolbarActions={pdfButton}
        />
      )}

      {/* Add/EDIT Modal */}
      <AnimatePresence>
        {(modalMode === 'add' || modalMode === 'edit') && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={closeModal}
            />

            {/* Modal panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.22 }}
              className="relative z-10 w-full max-w-lg bg-gray-800 border border-gray-700/60 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700/50">
                <h2 className="text-base font-semibold text-white">
                  {modalMode === 'add' ? 'Add New Public Space' : 'Edit Public Space'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={formik.handleSubmit} className="px-6 py-5 space-y-4">

                {/* Space Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Space Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      {...formik.getFieldProps('name')}
                      placeholder="e.g., City Mall"
                      className={`${inputCls(isInvalid('name'))} pl-9`}
                    />
                  </div>
                  {fieldErr('name') && (
                    <p className="mt-1 text-xs text-red-400">{fieldErr('name')}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    {...formik.getFieldProps('category')}
                    className={inputCls(isInvalid('category'))}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="bg-gray-800">
                        {cat}
                      </option>
                    ))}
                  </select>
                  {fieldErr('category') && (
                    <p className="mt-1 text-xs text-red-400">{fieldErr('category')}</p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Address <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      {...formik.getFieldProps('address')}
                      placeholder="e.g., No. 01, Galle Road, Colombo 03"
                      className={`${inputCls(isInvalid('address'))} pl-9`}
                    />
                  </div>
                  {fieldErr('address') && (
                    <p className="mt-1 text-xs text-red-400">{fieldErr('address')}</p>
                  )}
                </div>

                {/* Coordinates row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      Latitude <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Navigation size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <input
                        type="number"
                        step="any"
                        {...formik.getFieldProps('lat')}
                        placeholder="6.9271"
                        className={`${inputCls(isInvalid('lat'))} pl-9`}
                      />
                    </div>
                    {fieldErr('lat') && (
                      <p className="mt-1 text-xs text-red-400">{fieldErr('lat')}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      Longitude <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Navigation size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none rotate-90" />
                      <input
                        type="number"
                        step="any"
                        {...formik.getFieldProps('lng')}
                        placeholder="79.8612"
                        className={`${inputCls(isInvalid('lng'))} pl-9`}
                      />
                    </div>
                    {fieldErr('lng') && (
                      <p className="mt-1 text-xs text-red-400">{fieldErr('lng')}</p>
                    )}
                  </div>
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Image URL <span className="text-gray-500 text-xs font-normal">(optional)</span>
                  </label>
                  <div className="relative">
                    <Image size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type="url"
                      {...formik.getFieldProps('imageUrl')}
                      placeholder="https://example.com/image.jpg"
                      className={`${inputCls(isInvalid('imageUrl'))} pl-9`}
                    />
                  </div>
                  {fieldErr('imageUrl') && (
                    <p className="mt-1 text-xs text-red-400">{fieldErr('imageUrl')}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Description{' '}
                    <span className="text-gray-500 text-xs font-normal">
                      ({formik.values.description.length}/500, optional)
                    </span>
                  </label>
                  <div className="relative">
                    <FileText size={14} className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
                    <textarea
                      rows={3}
                      {...formik.getFieldProps('description')}
                      placeholder="Brief description of the space..."
                      className={`${inputCls(isInvalid('description'))} pl-9 resize-none`}
                    />
                  </div>
                  {fieldErr('description') && (
                    <p className="mt-1 text-xs text-red-400">{fieldErr('description')}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-sm rounded-lg border border-gray-600 text-gray-300
                               hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formik.isSubmitting}
                    className="flex items-center gap-2 px-5 py-2 text-sm rounded-lg font-medium text-white
                               bg-linear-to-r from-pink-500 via-purple-600 to-blue-500
                               hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                  >
                    {formik.isSubmitting && <Loader2 size={14} className="animate-spin" />}
                    {modalMode === 'add' ? 'Create' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View modal*/}
      <AnimatePresence>
        {modalMode === 'view' && selectedSpace && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={closeModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 w-full max-w-md bg-gray-800 border border-gray-700/60 rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700/50">
                <h2 className="text-base font-semibold text-white">Space Details</h2>
                <button
                  onClick={closeModal}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Content */}
              <div className="px-6 py-5 space-y-4">
                {/* Image */}
                {selectedSpace.imageUrl && (
                  <img
                    src={selectedSpace.imageUrl}
                    alt={selectedSpace.name}
                    className="w-full h-40 object-cover rounded-xl"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}

                <div className="space-y-3">
                  <DetailRow label="Name" value={selectedSpace.name} />
                  <DetailRow
                    label="Category"
                    value={
                      <span className={`font-medium ${CATEGORY_COLORS[selectedSpace.category]}`}>
                        {selectedSpace.category}
                      </span>
                    }
                  />
                  <DetailRow label="Address" value={selectedSpace.locationDetails.address} />
                  <DetailRow
                    label="Coordinates"
                    value={
                      <span className="font-mono text-xs">
                        {selectedSpace.locationDetails.coordinates.lat},{' '}
                        {selectedSpace.locationDetails.coordinates.lng}
                      </span>
                    }
                  />
                  {selectedSpace.description && (
                    <DetailRow label="Description" value={selectedSpace.description} />
                  )}
                  {selectedSpace.createdAt && (
                    <DetailRow
                      label="Added"
                      value={new Date(selectedSpace.createdAt).toLocaleDateString()}
                    />
                  )}
                </div>

                {/* Footer buttons */}
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => {
                      closeModal();
                      openEdit(selectedSpace);
                    }}
                    className="px-4 py-2 text-sm rounded-lg bg-yellow-500/10 text-yellow-400
                               hover:bg-yellow-500/20 transition-colors border border-yellow-500/20"
                  >
                    Edit
                  </button>
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 text-sm rounded-lg border border-gray-600 text-gray-300
                               hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION DIALOG */}
      <AnimatePresence>
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setDeleteTarget(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.18 }}
              className="relative z-10 w-full max-w-sm bg-gray-800 border border-gray-700/60 rounded-2xl shadow-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-red-500/15 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Delete Space</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Are you sure you want to delete{' '}
                    <span className="font-medium text-white">"{deleteTarget.name}"</span>? This
                    action cannot be undone.
                  </p>
                </div>
                <div className="flex gap-3 w-full pt-1">
                  <button
                    onClick={() => setDeleteTarget(null)}
                    disabled={deleteLoading}
                    className="flex-1 py-2 text-sm rounded-lg border border-gray-600 text-gray-300
                               hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={deleteLoading}
                    className="flex-1 flex items-center justify-center gap-2 py-2 text-sm rounded-lg
                               bg-red-500/90 text-white hover:bg-red-500 transition-colors
                               disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleteLoading && <Loader2 size={14} className="animate-spin" />}
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Small helper component
function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <span className="text-xs font-medium text-gray-500 w-24 shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-gray-200 flex-1">{value}</span>
    </div>
  );
}
