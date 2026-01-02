import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-primary-700 dark:bg-[#0F1E2E] text-[#E6EEF6] border-t border-primary-600/30 dark:border-primary-600/20">
      <div className="container-main py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 font-heading font-bold text-xl mb-4 text-white">
              <span className="text-cta-400">AL-MAWRID</span>
            </Link>
            <p className="text-sm text-[#B8C5D6] mb-4 leading-relaxed">
              Trusted pharmaceutical supplier committed to Flow, Continuity, Purity, and Scientific Depth. From research to healing — The Eternal Flow.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-[#B8C5D6] hover:text-cta-400 transition-colors" aria-label="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="#" className="text-[#B8C5D6] hover:text-cta-400 transition-colors" aria-label="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.022a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a href="#" className="text-[#B8C5D6] hover:text-cta-400 transition-colors" aria-label="LinkedIn">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Products</h3>
            <ul className="space-y-2 text-sm text-[#B8C5D6]">
              <li>
                <Link to="/products" className="hover:text-cta-400 transition-colors">All Products</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-cta-400 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-cta-400 transition-colors">Contact</Link>
              </li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-[#B8C5D6]">
              <li>
                <a href="#" className="hover:text-cta-400 transition-colors">Shipping Info</a>
              </li>
              <li>
                <a href="#" className="hover:text-cta-400 transition-colors">Quality Assurance</a>
              </li>
              <li>
                <a href="#" className="hover:text-cta-400 transition-colors">FAQs</a>
              </li>
              <li>
                <Link to="/contact" className="hover:text-cta-400 transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>
          
          {/* Trust Badges */}
          <div>
            <h3 className="text-white font-semibold mb-4">Our Commitment</h3>
            <div className="space-y-3 text-sm text-[#B8C5D6]">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-cta-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>GMP Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-cta-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span>Scientific Excellence</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-cta-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Fast & Reliable</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-primary-600/30 dark:border-primary-600/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[#B8C5D6]">
            © {new Date().getFullYear()} AL-MAWRID PHARMACEUTICALS. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-[#B8C5D6]">
            <a href="#" className="hover:text-cta-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-cta-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-cta-400 transition-colors">Quality Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

