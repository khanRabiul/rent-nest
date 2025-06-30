'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import RentNestLogo from '@/ui/components/RentNestLogo';
import { useAuth } from '@/contexts/AuthContext';
import ThemeSwitcher from "../ThemeSwitcher";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { user, isLoggedIn, isLoading: authLoading, logout } = useAuth();
  const userRole = user ? user.role : null;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleScroll = () => {
    if (typeof window !== 'undefined' && window.scrollY > 0) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  if (authLoading) {
    return (
      <nav className="fixed top-0 left-0 w-full z-50 py-4 bg-[--card-bg] shadow-sm text-[--foreground]">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="animate-pulse h-6 w-24 bg-gray-300 rounded"></div>
          <div className="flex space-x-6">
            <div className="animate-pulse h-6 w-20 bg-gray-300 rounded"></div>
            <div className="animate-pulse h-6 w-20 bg-gray-300 rounded"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 text-[var(--foreground)] transition-all duration-300 ease-in-out`}>
      <div className={`w-full ${isScrolled ? 'lg:bg-[--card-bg]/80 lg:backdrop-blur-lg lg:shadow-lg' : 'lg:bg-transparent'} transition-all duration-300`}>
        <div className="container flex items-center justify-between text-sm xl:text-base py-2 lg:py-4 px-4 lg:px-8">
          {/* Logo */}
          <div className="flex-shrink-0">
            <RentNestLogo />
          </div>

          {/* Desktop Menu */}
          <div className="flex-1 flex items-center justify-end">
            <div className="hidden lg:flex items-center gap-4 lg:gap-6 xl:gap-8">
              <Link href='/' className={`font-semibold hover:text-[var(--secondary)] ${pathname === '/' ? 'text-[var(--secondary)] underline underline-offset-5 decoration-2' : ''}`}>Home</Link>
              <Link href='/properties' className={`font-semibold hover:text-[var(--secondary)] ${pathname === '/properties' ? 'text-[var(--secondary)] underline underline-offset-5 decoration-2' : ''}`}>Properties</Link>
              <Link href='/contact-us' className={`font-semibold hover:text-[var(--secondary)] ${pathname === '/contact-us' ? 'text-[var(--secondary)] underline underline-offset-5 decoration-2' : ''}`}>Contact us</Link>

              {isLoggedIn && (
                <Link href='/profile/saved-properties' className={`font-semibold hover:text-[var(--secondary)] ${pathname === '/profile/saved-properties' ? 'text-[var(--secondary)] underline underline-offset-5 decoration-2' : ''}`}>Saved Properties</Link>
              )}

              {isLoggedIn && userRole === 'landlord' && (
                <Link href='/landlord/dashboard' className={`font-semibold hover:text-[var(--secondary)] ${pathname === '/landlord/dashboard' ? 'text-[var(--secondary)] underline underline-offset-5 decoration-2' : ''}`}>My Properties</Link>
              )}
              {isLoggedIn && userRole === 'admin' && (
                <Link href='/admin/dashboard' className={`font-semibold hover:text-[var(--secondary)] ${pathname === '/admin/dashboard' ? 'text-[var(--secondary)] underline underline-offset-5 decoration-2' : ''}`}>Admin Dashboard</Link>
              )}
              {isLoggedIn && (
                <Link href="/profile" className={`font-semibold hover:text-[var(--secondary)] ${pathname === '/profile' ? 'text-[var(--secondary)] underline underline-offset-5 decoration-2' : ''}`}>Profile</Link>
              )}

              {!isLoggedIn ? (
                <>
                  <Link href="/signin" className={`px-4 py-1.5 rounded-md bg-[var(--primary)] text-white font-semibold hover:bg-[var(--primary)] hover:opacity-90 transition-opacity ${pathname === '/signin' ? 'bg-[var(--secondary)]' : ''}`}>
                    Sign In
                  </Link>
                  <Link href="/signup" className={`px-4 py-1.5 rounded-md border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-colors ${pathname === '/signup' ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : ''}`}>
                    Sign Up
                  </Link>
                </>
              ) : (
                <button onClick={handleLogout} className="px-4 py-1.5 rounded-md bg-[var(--secondary)] text-white hover:opacity-90 transition-opacity font-semibold">
                  লগআউট
                </button>
              )}
              <ThemeSwitcher />
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex items-center lg:hidden">
              <ThemeSwitcher />
              <button
                onClick={toggleMobileMenu}
                className="ml-4 text-[--foreground] focus:outline-none"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/40 flex">
          <div className="w-64 bg-[var(--card-bg)] h-full shadow-lg flex flex-col relative px-6 pt-8 pb-24 animate-slideIn">
            <button
              onClick={toggleMobileMenu}
              className="self-end mb-4 text-2xl text-[--secondary] hover:text-[var(--primary)] transition-colors"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
            <nav className="flex flex-col gap-4">
              <Link href="/" className={`block px-3 py-2 rounded hover:bg-[var(--primary)] hover:text-white font-medium transition-colors ${pathname === '/' ? 'bg-[var(--primary)] text-white' : ''}`} onClick={toggleMobileMenu}>
                Home
              </Link>
              <Link href="/properties" className={`block px-3 py-2 rounded hover:bg-[var(--primary)] hover:text-white font-medium transition-colors ${pathname === '/properties' ? 'bg-[var(--primary)] text-white' : ''}`} onClick={toggleMobileMenu}>
                Properties
              </Link>
              <Link href="/contact-us" className={`block px-3 py-2 rounded hover:bg-[var(--primary)] hover:text-white font-medium transition-colors ${pathname === '/contact-us' ? 'bg-[var(--primary)] text-white' : ''}`} onClick={toggleMobileMenu}>
                Contact Us
              </Link>

              {isLoggedIn && (
                <Link href="/profile/saved-properties" className={`block px-3 py-2 rounded hover:bg-[var(--primary)] hover:text-white font-medium transition-colors ${pathname === '/profile/saved-properties' ? 'bg-[var(--primary)] text-white' : ''}`} onClick={toggleMobileMenu}>
                  Saved Properties
                </Link>
              )}
              {isLoggedIn && userRole === 'landlord' && (
                <Link href="/landlord/dashboard" className={`block px-3 py-2 rounded hover:bg-[var(--primary)] hover:text-white font-medium transition-colors ${pathname === '/landlord/dashboard' ? 'bg-[var(--primary)] text-white' : ''}`} onClick={toggleMobileMenu}>
                  My Properties
                </Link>
              )}
              {isLoggedIn && userRole === 'admin' && (
                <Link href="/admin/dashboard" className={`block px-3 py-2 rounded hover:bg-[var(--primary)] hover:text-white font-medium transition-colors ${pathname === '/admin/dashboard' ? 'bg-[var(--primary)] text-white' : ''}`} onClick={toggleMobileMenu}>
                  Admin Dashboard
                </Link>
              )}
              {isLoggedIn && (
                <Link href="/profile" className={`block px-3 py-2 rounded hover:bg-[var(--primary)] hover:text-white font-medium transition-colors ${pathname === '/profile' ? 'bg-[var(--primary)] text-white' : ''}`} onClick={toggleMobileMenu}>
                  Profile
                </Link>
              )}
            </nav>

            {/* Mobile buttons fixed at bottom */}
            <div className="absolute bottom-6 left-0 right-0 px-6 flex flex-col gap-2">
              {!isLoggedIn ? (
                <>
                  <Link href="/signin" className={`w-full text-center px-4 py-2 rounded-md bg-[var(--primary)] text-white hover:opacity-90 transition-opacity font-medium ${pathname === '/signin' ? 'bg-[var(--secondary)]' : ''}`} onClick={toggleMobileMenu}>
                    Sign In
                  </Link>
                  <Link href="/signup" className={`w-full text-center px-4 py-2 rounded-md border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-colors font-medium ${pathname === '/signup' ? 'text-white bg-[var(--primary)] border-[var(--primary)]' : ''}`} onClick={toggleMobileMenu}>
                    Sign Up
                  </Link>
                </>
              ) : (
                <button onClick={handleLogout} className="w-full px-4 py-2 rounded-md bg-[var(--secondary)] text-white hover:opacity-90 transition-opacity font-medium">
                  Log Out
                </button>
              )}
            </div>
          </div>
          <div className="flex-1" onClick={toggleMobileMenu} />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
