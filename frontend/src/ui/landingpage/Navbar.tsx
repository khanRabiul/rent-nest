'use client';

import { useEffect, useState } from "react";
import ThemeSwitcher from "../ThemeSwitcher";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import RentNestLogo from "../additionals/RentNestLogo";

const Navbar = () => {

  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname()
  const isLoggedIn = true;
  const userRole: 'user' | 'landlord' | 'admin' = 'user';
  const [isMobileMenuOpen, setisMobileMenuOpen] = useState(false)

  const handleScroll = () => {
    if (window.scrollY > 0) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  },
    []);

  const toggleMobileMenu = () => {
    setisMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${isScrolled ? 'bg-white/80 backdrop-filter backdrop-blur-lg shadow-lg' : 'bg-transparent'} text-[var(--foreground)]`}
    >
      <div className="container flex items-center justify-between gap-6 text-sm xl:text-base py-4 lg:py-6 px-4 lg:px-8">
        {/* Logo on the left */}
        <div>
          <RentNestLogo />
        </div>

        {/* Desktop Menu and ThemeSwitcher on the right */}
        <div className="flex-1 flex items-center justify-end">
          <div className="hidden lg:flex items-center gap-4 lg:gap-6 xl:gap-8">
            <Link href='/' className={`font-semibold hover:text-[var(--secondary)] ${pathname === '/' ? 'text-[var(--secondary)] underline underline-offset-5 decoration-2' : ''}`}>Home</Link>
            <Link href='/contact-us' className={`font-medium hover:text-[var(--secondary)] ${pathname === '/contact-us' ? 'text-[var(--secondary)]  underline underline-offset-5 decoration-2' : ''}`}>Contact us</Link>
            
            {isLoggedIn && (
              <Link href='/saved-properties'className={`font-semibold hover:text-[var(--secondary)] ${pathname === '/saved-properties' ? 'text-[var(--secondary)] underline underline-offset-5 decoration-2' : ''}`}>Saved Properties</Link>
            )}

            {isLoggedIn && userRole === 'user' && (
              <Link href='/landlord/dashboard' className={`font-semibold hover:text-[var(--secondary)] ${pathname === '/landlord/dashboard' ? 'text-[var(--secondary)] underline underline-offset-5 decoration-2' : ''}`}>My Properties</Link>
            )}

            {isLoggedIn && userRole === 'user' && (
              <Link href='/admin/dashboard' className={`font-semibold hover:text-[var(--secondary)] ${pathname === '/admin/dashboard' ? 'text-[var(--secondary)] underline underline-offset-5 decoration-2' : ''}`}>Admin Dashboard</Link>
            )}

            <Link href='/signin' className="text-sm xl:text-base font-medium hover:text-[var(--secondary)] px-4 py-1.5 bg-[var(--primary)] text-white rounded-md">
              Sign In
            </Link>
            <Link href='/signup' className="text-sm xl:text-base font-medium hover:text-[var(--secondary)] px-4 py-1.5 border rounded-md">
              Sign Up
            </Link>
            <ThemeSwitcher />
          </div>
          {/* Mobile menu button and ThemeSwitcher for mobile */}
          <div className="flex items-center lg:hidden">
            <ThemeSwitcher />
            <button
              onClick={toggleMobileMenu}
              className="ml-4 text-[--foreground] focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              ) : (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/40 flex">
            <div className="w-64 bg-[var(--card-bg)] h-full shadow-lg flex flex-col py-8 px-6 gap-6 animate-slideIn">
              <button
                onClick={toggleMobileMenu}
                className="self-end mb-4 text-2xl text-[var(--secondary)] hover:text-[var(--primary)] transition-colors"
                aria-label="Close menu"
              >
                <X />
              </button>
              <nav className="flex flex-col gap-4">
                <Link href="/" className="block px-3 py-2 rounded hover:bg-[var(--primary)] hover:text-white font-medium transition-colors" onClick={toggleMobileMenu}>
                  Home
                </Link>
                <Link href="/contact-us" className="block px-3 py-2 rounded hover:bg-[var(--primary)] hover:text-white font-medium transition-colors" onClick={toggleMobileMenu}>
                  Contact Us
                </Link>
                {isLoggedIn && (
                  <Link href="/saved-properties" className="block px-3 py-2 rounded hover:bg-[var(--primary)] hover:text-white font-medium transition-colors" onClick={toggleMobileMenu}>
                    Saved Properties
                  </Link>
                )}
                {isLoggedIn && userRole === 'user' && (
                  <Link href="/landlord/dashboard" className="block px-3 py-2 rounded hover:bg-[var(--primary)] hover:text-white font-medium transition-colors" onClick={toggleMobileMenu}>
                    My Properties
                  </Link>
                )}
                {isLoggedIn && userRole === 'user' && (
                  <Link href="/admin/dashboard" className="block px-3 py-2 rounded hover:bg-[var(--primary)] hover:text-white font-medium transition-colors" onClick={toggleMobileMenu}>
                    Admin Dashboard
                  </Link>
                )}
                {isLoggedIn && (
                  <Link href="/profile" className="block px-3 py-2 rounded hover:bg-[var(--primary)] hover:text-white font-medium transition-colors" onClick={toggleMobileMenu}>
                    Profile
                  </Link>
                )}
              </nav>
              <div className="mt-auto flex flex-col gap-2">
                {!isLoggedIn ? (
                  <>
                    <Link href="/signin" className="w-full text-center px-4 py-2 rounded-md bg-[var(--primary)] text-white hover:opacity-90 transition-opacity font-medium" onClick={toggleMobileMenu}>
                      Sign In
                    </Link>
                    <Link href="/signup" className="w-full text-center px-4 py-2 rounded-md border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-colors font-medium" onClick={toggleMobileMenu}>
                      Sign Up
                    </Link>
                  </>
                ) : (
                  <button className="w-full px-4 py-2 rounded-md bg-[var(--secondary)] text-white hover:opacity-90 transition-opacity font-medium" onClick={toggleMobileMenu}>
                    Log Out
                  </button>
                )}
              </div>
            </div>
            <div className="flex-1" onClick={toggleMobileMenu} />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;