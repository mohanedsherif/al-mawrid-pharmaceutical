import { Outlet, Link, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { useAuthInit } from '../../hooks/useAuthInit';

const AdminLayout = () => {
  useAuthInit();
  const location = useLocation();
  
  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin') return 'Dashboard';
    if (path === '/admin/products') return 'Products';
    if (path === '/admin/categories') return 'Categories';
    if (path === '/admin/orders') return 'Orders';
    if (path === '/admin/users') return 'Users';
    if (path === '/admin/feedbacks') return 'Feedbacks';
    return 'Admin Panel';
  };
  
  return (
    <div className="min-h-screen bg-[#ECF0F3] dark:bg-[#0F1E2E]">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-heading font-bold text-slate-900 dark:text-slate-100">
                {getPageTitle()}
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Manage your e-commerce platform
              </p>
            </div>
            <Link
              to="/"
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              ← Back to Store
            </Link>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

