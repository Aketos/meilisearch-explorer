'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import { useI18n } from '@/components/I18nProvider';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useI18n();
  
  // Close mobile menu when navigating to a new page
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Helper function to determine if a link is active
  const isActive = (path: string) => {
    if (path === '/' && pathname !== '/') return false;
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <nav className="glass sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200/50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 relative group flex items-center">
                <span className="mr-2 text-2xl">🔍</span>
                Meilisearch Explorer
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <NavLink href="/" isActive={pathname === '/'}>{t('nav.home')}</NavLink>
                <NavLink href="/indexes" isActive={isActive('/indexes')}>{t('nav.indexes')}</NavLink>
                <NavLink href="/search" isActive={isActive('/search')}>{t('nav.search')}</NavLink>
                <NavLink href="/configuration" isActive={isActive('/configuration')}>{t('nav.configuration')}</NavLink>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <LocaleSwitcher />
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded={isOpen}
              aria-label="Toggle navigation menu"
            >
              <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
              <svg
                className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div 
        className={`${isOpen ? 'block' : 'hidden'} md:hidden`}
        id="mobile-menu"
        aria-label="Mobile navigation"
      >
        <div className="px-3 py-3 border-t border-gray-200 flex justify-end">
          <LocaleSwitcher />
        </div>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <MobileNavLink href="/" isActive={pathname === '/'}>{t('nav.home')}</MobileNavLink>
          <MobileNavLink href="/indexes" isActive={isActive('/indexes')}>{t('nav.indexes')}</MobileNavLink>
          <MobileNavLink href="/search" isActive={isActive('/search')}>{t('nav.search')}</MobileNavLink>
          <MobileNavLink href="/configuration" isActive={isActive('/configuration')}>{t('nav.configuration')}</MobileNavLink>
        </div>
      </div>
    </nav>
  );
}

// Desktop navigation link component
function NavLink({ href, children, isActive }: { href: string; children: React.ReactNode; isActive: boolean }) {
  return (
    <Link 
      href={href} 
      className={`px-3 py-2 rounded-md text-base font-medium relative transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isActive 
        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm' 
        : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 hover:text-blue-700 hover:shadow-sm hover:-translate-y-0.5'}`}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </Link>
  );
}

// Mobile navigation link component
function MobileNavLink({ href, children, isActive }: { href: string; children: React.ReactNode; isActive: boolean }) {
  return (
    <Link 
      href={href} 
      className={`block px-3 py-2 rounded-md text-base font-medium relative transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isActive 
        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm border-l-4 border-blue-500' 
        : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 hover:text-blue-700 hover:pl-4 hover:border-l-4 hover:border-l-blue-400'}`}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </Link>
  );
}
