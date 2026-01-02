import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuthInit } from '../hooks/useAuthInit';
import { useI18n } from '../contexts/I18nContext';

const Layout = () => {
  useAuthInit();
  const { isRTL } = useI18n();
  
  // Ensure RTL is properly applied to the layout
  useEffect(() => {
    const html = document.documentElement;
    html.dir = isRTL ? 'rtl' : 'ltr';
    html.lang = isRTL ? 'ar' : 'en';
  }, [isRTL]);
  
  return (
    <div 
      className="page-shell bg-white dark:bg-[#0F1E2E]" 
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <Navbar />
      <main className="flex-1 bg-white dark:bg-[#0F1E2E]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

