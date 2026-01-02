import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { logout } from '../store/authSlice';
import { logout as apiLogout } from '../api/authApi';
import { useTheme } from '../contexts/ThemeContext';
import { useI18n } from '../contexts/I18nContext';
import Button from './ui/Button';
import AdminAccessButton from './admin/AdminAccessButton';

// Cart Badge Component
const CartBadge = () => {
  const { items } = useAppSelector((state) => state.cart);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  if (totalItems === 0) return null;
  
  return (
    <span className="absolute top-0 right-0 w-5 h-5 bg-cta-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
      {totalItems > 99 ? '99+' : totalItems}
    </span>
  );
};

const Navbar = () => {
  const [logoError, setLogoError] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { accessToken, role } = useAppSelector((state) => state.auth);
  const { isDark, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useI18n();

  const handleLogout = async () => {
    try {
      // Call API logout first
      await apiLogout();
    } catch (error: any) {
      // Silently handle connection errors (backend might be down)
      // Only log if it's not a connection error
      if (error?.code !== 'ERR_NETWORK' && error?.message !== 'Network Error') {
        console.error('Logout API error:', error);
      }
      // Continue with logout even if API call fails
    }
    
    // Sign out from Firebase
    try {
      const { firebaseAuthService } = await import('../services/firebaseAuthService');
      await firebaseAuthService.signOut();
    } catch (error) {
      console.error('Firebase logout error:', error);
    }
    
    // Always clear local state and tokens
    dispatch(logout());
    // Navigate to home page
    navigate('/', { replace: true });
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'text-cta-500 dark:text-cta-400 bg-cta-50 dark:bg-cta-900/20'
        : 'text-[#2C3E50] dark:text-[#E6EEF6] hover:text-cta-500 dark:hover:text-cta-400 hover:bg-[#ECF0F3] dark:hover:bg-[#16283D]'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-[#B8C5D6]/50 dark:border-primary-700/30 bg-white/95 dark:bg-[#0F1E2E]/95 backdrop-blur-md shadow-soft">
      <div className="container-main">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 font-heading font-bold text-xl md:text-2xl group">
            {!logoError ? (
              <img 
                src="/logo.png" 
                alt="AL-MAWRID Logo" 
                className="h-10 w-auto transition-all group-hover:opacity-80 group-hover:scale-105"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">A</span>
              </div>
            )}
            <span className="text-primary-600 dark:text-primary-400 group-hover:text-cta-500 dark:group-hover:text-cta-400 transition-colors">
              AL-MAWRID
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" className={linkClass}>
              {t('nav.home')}
            </NavLink>
            <NavLink to="/products" className={linkClass}>
              {t('nav.products')}
            </NavLink>
            <NavLink to="/about" className={linkClass}>
              About Us
            </NavLink>
            {role === 'ADMIN' && (
              <NavLink to="/admin" className={linkClass}>
                {t('nav.admin')}
              </NavLink>
            )}
            <AdminAccessButton />
          </nav>
          
          <div className="flex items-center gap-3">
            {/* Search */}
                <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl bg-[#ECF0F3] dark:bg-[#16283D] border border-[#B8C5D6] dark:border-primary-700/50 focus-within:ring-2 focus-within:ring-cta-400 transition-all">
                  <svg className="w-4 h-4 text-secondary-500 dark:text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="bg-transparent border-none outline-none text-sm w-48 text-[#2C3E50] dark:text-[#E6EEF6] placeholder:text-secondary-400 dark:placeholder:text-secondary-500"
                  />
                </div>
            
            {/* Language Switcher */}
            <div className="relative group">
              <button
                onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                className="px-3 py-2 rounded-xl hover:bg-[#ECF0F3] dark:hover:bg-[#16283D] transition-all duration-300 active:scale-95 flex items-center gap-2 text-sm font-medium text-[#2C3E50] dark:text-[#E6EEF6]"
                aria-label={`Switch to ${language === 'en' ? 'Arabic' : 'English'}`}
                title={`Switch to ${language === 'en' ? 'Arabic' : 'English'}`}
                type="button"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <span className="font-semibold">{language.toUpperCase()}</span>
              </button>
            </div>
            
            {/* Theme Toggle Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleTheme();
              }}
                  className="p-2 rounded-xl hover:bg-[#ECF0F3] dark:hover:bg-[#16283D] transition-all duration-300 active:scale-95 group"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              type="button"
            >
              {isDark ? (
                // Sun icon - currently in dark mode, click to switch to light mode
                <svg 
                  className="w-5 h-5 text-yellow-500 dark:text-yellow-400 transition-all duration-300 group-hover:rotate-180" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                // Moon icon - currently in light mode, click to switch to dark mode
                <svg 
                  className="w-5 h-5 text-slate-700 dark:text-slate-300 transition-all duration-300 group-hover:-rotate-12" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            
            {accessToken ? (
              <>
                {/* Admin Dashboard Icon */}
                {role === 'ADMIN' && (
                    <NavLink 
                      to="/admin" 
                      className="p-2 rounded-xl hover:bg-[#ECF0F3] dark:hover:bg-[#16283D] transition-colors group relative"
                      title="Admin Dashboard"
                    >
                      <svg 
                        className="w-6 h-6 text-accent-500 dark:text-accent-400 group-hover:text-cta-500 dark:group-hover:text-cta-400 transition-colors" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </NavLink>
                )}
                <NavLink to="/cart" className="relative p-2 rounded-xl hover:bg-[#ECF0F3] dark:hover:bg-[#16283D] transition-colors">
                  <svg className="w-6 h-6 text-[#2C3E50] dark:text-[#E6EEF6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8m0 0L21 4H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <CartBadge />
                </NavLink>
                <div className="hidden md:flex items-center gap-2">
                  {role !== 'ADMIN' && (
                    <>
                      <NavLink to="/orders" className={linkClass}>
                        Orders
                      </NavLink>
                      <NavLink to="/profile" className={linkClass}>
                        Profile
                      </NavLink>
                    </>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleLogout}
                    type="button"
                  >
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <NavLink to="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </NavLink>
                <NavLink to="/register">
                  <Button variant="primary" size="sm">Sign Up</Button>
                </NavLink>
              </div>
            )}
            
                {/* Mobile Menu Button */}
                <button 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 rounded-xl hover:bg-[#ECF0F3] dark:hover:bg-[#16283D] transition-colors"
                  aria-label="Toggle mobile menu"
                >
                  {mobileMenuOpen ? (
                    <svg className="w-6 h-6 text-[#2C3E50] dark:text-[#E6EEF6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-[#2C3E50] dark:text-[#E6EEF6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#B8C5D6]/50 dark:border-primary-700/30 bg-white dark:bg-[#0F1E2E] animate-in slide-in-from-top">
            <nav className="py-4 space-y-2">
              <NavLink 
                to="/" 
                className={linkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.home')}
              </NavLink>
              <NavLink 
                to="/products" 
                className={linkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.products')}
              </NavLink>
              <NavLink 
                to="/about" 
                className={linkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </NavLink>
              {role === 'ADMIN' && (
                <NavLink 
                  to="/admin" 
                  className={linkClass}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.admin')}
                </NavLink>
              )}
              
              {/* Mobile Search */}
              <div className="px-4 py-2">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#ECF0F3] dark:bg-[#16283D] border border-[#B8C5D6] dark:border-primary-700/50">
                  <svg className="w-4 h-4 text-secondary-500 dark:text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="bg-transparent border-none outline-none text-sm flex-1 text-[#2C3E50] dark:text-[#E6EEF6] placeholder:text-secondary-400 dark:placeholder:text-secondary-500"
                  />
                </div>
              </div>
              
              {accessToken ? (
                <>
                  {role !== 'ADMIN' && (
                    <>
                      <NavLink 
                        to="/orders" 
                        className={linkClass}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Orders
                      </NavLink>
                      <NavLink 
                        to="/profile" 
                        className={linkClass}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Profile
                      </NavLink>
                    </>
                  )}
                  <NavLink 
                    to="/cart" 
                    className={`${linkClass} relative`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Cart
                    <CartBadge />
                  </NavLink>
                  <button 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-4 py-2 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="px-4 space-y-2">
                  <NavLink 
                    to="/login" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="block"
                  >
                    <Button variant="ghost" size="sm" className="w-full">Login</Button>
                  </NavLink>
                  <NavLink 
                    to="/register" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="block"
                  >
                    <Button variant="primary" size="sm" className="w-full">Sign Up</Button>
                  </NavLink>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

