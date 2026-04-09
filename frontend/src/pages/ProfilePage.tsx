import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AuthService from '@/services/auth.service';
import UsersService from '@/services/users.service';
import { Button } from '@/components/shared/Button';
import { LogOut, Home, CheckCircle, AlertCircle, Edit2, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

interface User {
  id: string;
  name: string;
  email?: string;
  surname?: string;
  isLoggedIn: boolean;
  userType: string;
}

const profileValidationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  name: Yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  surname: Yup.string().min(2, 'Surname must be at least 2 characters'),
});

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const { success, error } = useToast();

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();

    if (!currentUser?.user || !currentUser?.token) {
      navigate('/login');
      return;
    }

    setUser(currentUser.user);
    setLoading(false);
  }, [navigate]);

  const formik = useFormik({
    initialValues: {
      email: user?.email || '',
      name: user?.name || '',
      surname: user?.surname || '',
    },
    validationSchema: profileValidationSchema,
    enableReinitialize: true,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      if (!user?.id) return;

      setIsSaving(true);
      try {
        const updateData = {
          email: values.email,
          name: values.name,
          surname: values.surname,
        };

        const response = await UsersService.updateUser(user.id, updateData);

        // Update localStorage with response data (preserves userType)
        const currentUserData = AuthService.getCurrentUser();
        if (currentUserData && response.data?.result) {
          const updatedUser = {
            ...currentUserData.user,
            email: response.data.result.email ?? currentUserData.user.email,
            name: response.data.result.name ?? currentUserData.user.name,
            surname: response.data.result.surname ?? currentUserData.user.surname,
            // Keep userType from response (preserves admin/user/guest role)
            userType: response.data.result.userType ?? currentUserData.user.userType,
          };
          currentUserData.user = updatedUser;
          localStorage.setItem('user', JSON.stringify(currentUserData));
        }

        // Update local state with response data
        if (response.data?.result) {
          setUser((prev) =>
            prev
              ? {
                  ...prev,
                  email: response.data.result.email ?? prev.email,
                  name: response.data.result.name ?? prev.name,
                  surname: response.data.result.surname ?? prev.surname,
                  userType: response.data.result.userType ?? prev.userType,
                }
              : prev,
          );
        }

        success('Profile updated successfully');
        setIsEditing(false);
      } catch (err) {
        error('Failed to update profile. Please try again.');
        console.error(err);
      } finally {
        setIsSaving(false);
      }
    },
  });

  const handleLogout = () => {
    AuthService.logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white"></div>
          <p className="mt-4 text-gray-900 dark:text-gray-100 font-semibold">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 pt-32 pb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-black tracking-tighter mb-4 text-gray-900 dark:text-white">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Unable to load profile information.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-wider hover:opacity-90"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-32 pb-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter bg-gradient-to-b from-black to-gray-400 dark:from-white dark:to-gray-600 bg-clip-text text-transparent">
            Welcome, {user.name}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
            Manage your account and access reviews
          </p>
        </div>

        <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-xl space-y-6">
          {isEditing ? (
            <>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Edit Profile
              </h2>
              <form onSubmit={formik.handleSubmit} className="space-y-5">
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400 font-bold tracking-wide block mb-2">
                    EMAIL
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                    placeholder="your@email.com"
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-red-600 text-xs mt-1 font-semibold">{formik.errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400 font-bold tracking-wide block mb-2">
                    FIRST NAME
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                    placeholder="John"
                  />
                  {formik.touched.name && formik.errors.name && (
                    <p className="text-red-600 text-xs mt-1 font-semibold">{formik.errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400 font-bold tracking-wide block mb-2">
                    LAST NAME
                  </label>
                  <input
                    type="text"
                    name="surname"
                    value={formik.values.surname}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                    placeholder="Doe"
                  />
                  {formik.touched.surname && formik.errors.surname && (
                    <p className="text-red-600 text-xs mt-1 font-semibold">
                      {formik.errors.surname}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <Button
                    type="submit"
                    disabled={!formik.isValid || isSaving}
                    className="h-12 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-wider hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>{isSaving ? 'Saving...' : 'Save'}</span>
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      formik.resetForm();
                    }}
                    className="h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold uppercase tracking-wider hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancel</span>
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <>
              <div className="border-b border-gray-200 dark:border-gray-800 pb-6">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-bold tracking-wide mb-2">
                  EMAIL
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{user.email}</p>
              </div>

              <div className="border-b border-gray-200 dark:border-gray-800 pb-6">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-bold tracking-wide mb-2">
                  NAME
                </p>
                <p className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
                  {user.name}
                </p>
              </div>

              {user.surname && (
                <div className="border-b border-gray-200 dark:border-gray-800 pb-6">
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-bold tracking-wide mb-2">
                    SURNAME
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {user.surname}
                  </p>
                </div>
              )}

              <div className="border-b border-gray-200 dark:border-gray-800 pb-6">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-bold tracking-wide mb-2">
                  USER ID
                </p>
                <p className="text-lg font-mono text-gray-700 dark:text-gray-300 break-all">
                  {user.id}
                </p>
              </div>

              <div className="border-b border-gray-200 dark:border-gray-800 pb-6">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-bold tracking-wide mb-2">
                  ACCOUNT TYPE
                </p>
                <div className="inline-block">
                  <span className="px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-bold uppercase tracking-wider">
                    {user.userType}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-bold tracking-wide mb-2">
                  LOGIN STATUS
                </p>
                <div className="flex items-center gap-2">
                  {user.isLoggedIn ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-bold uppercase tracking-wider text-green-700 dark:text-green-400">
                        Logged In
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      <span className="text-sm font-bold uppercase tracking-wider text-red-700 dark:text-red-400">
                        Logged Out
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-800">
                <Button
                  className="h-12 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-wider hover:opacity-90 flex items-center justify-center gap-2"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="h-4 w-4" />
                  <span>Edit</span>
                </Button>
                <Button
                  className="h-12 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold uppercase tracking-wider hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center gap-2"
                  onClick={() => navigate('/')}
                >
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Button>
                <Button
                  className="h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold uppercase tracking-wider hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center gap-2"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
