"use client"; // এটি একটি ক্লায়েন্ট কম্পোনেন্ট

import Link from 'next/link';
import { useState } from 'react';
// ThemeSwitcher আর এখানে ইম্পোর্ট করার দরকার নেই, যেহেতু কোনো থিম নেই


// আপাতত, ইউজার লগইন স্ট্যাটাস এবং রোল এর জন্য ডামি স্টেট ব্যবহার করা হচ্ছে।
// পরে আপনি এটি একটি অথেন্টিকেশন কনটেক্সট বা গ্লোবাল স্টেট ম্যানেজমেন্ট থেকে নেবেন।
const isLoggedIn = false; // উদাহরণ: ব্যবহারকারী লগইন করা নেই
const userRole = 'user'; // উদাহরণ: ব্যবহারকারীর ভূমিকা (user, landlord, admin)


export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white text-gray-800 border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">

        <Link href="/" className="text-xl font-bold text-blue-600">
          RentNest
        </Link>

        {/*Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <Link href="/properties" className="hover:text-blue-600 transition-colors">
            Property
          </Link>
          {isLoggedIn && userRole === 'landlord' && (
            <Link href="/landlord/dashboard" className="hover:text-blue-600 transition-colors">
              My Properties
            </Link>
          )}
          {isLoggedIn && userRole === 'admin' && (
            <Link href="/admin/dashboard" className="hover:text-blue-600 transition-colors">
              Admin Dashboard
            </Link>
          )}
          {isLoggedIn && (userRole === 'user' || userRole === 'landlord' || userRole === 'admin') && (
            <Link href="/profile" className="hover:text-blue-600 transition-colors">
              Profile
            </Link>
          )}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {/* ThemeSwitcher */}
          {!isLoggedIn ? (
            <>
              <Link href="/auth/signin" className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                Login
              </Link>
              <Link href="/auth/signup" className="px-4 py-2 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors">
                Signup
              </Link>
            </>
          ) : (
            <button className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors">
              Logout
            </button>\
          )}
        </div>

        {/** Mobile menu */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMobileMenu} className="text-gray-800 focus:outline-none">
            {isMobileMenuOpen ? (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            ) : (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-100 border-t border-gray-200 py-4">
          <div className="flex flex-col items-center space-y-4">
            <Link href="/" className="block hover:text-blue-600 transition-colors" onClick={toggleMobileMenu}>
              Home
            </Link>
            <Link href="/properties" className="block hover:text-blue-600 transition-colors" onClick={toggleMobileMenu}>
              Property
            </Link>
            {isLoggedIn && userRole === 'landlord' && (
              <Link href="/landlord/dashboard" className="block hover:text-blue-600 transition-colors" onClick={toggleMobileMenu}>
                My Properties
              </Link>
            )}
            {isLoggedIn && userRole === 'admin' && (
              <Link href="/admin/dashboard" className="block hover:text-blue-600 transition-colors" onClick={toggleMobileMenu}>
                Admin Dashboard
              </Link>
            )}
            {isLoggedIn && (userRole === 'user' || userRole === 'landlord' || userRole === 'admin') && (
              <Link href="/profile" className="block hover:text-blue-600 transition-colors" onClick={toggleMobileMenu}>
                Profile
              </Link>
            )}

            {!isLoggedIn ? (
              <>
                <Link href="/auth/signin" className="w-full text-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors" onClick={toggleMobileMenu}>
                  Login
                </Link>
                <Link href="/auth/signup" className="w-full text-center px-4 py-2 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors" onClick={toggleMobileMenu}>
                  Signup
                </Link>
              </>
            ) : (
              <button className="w-full px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors" onClick={toggleMobileMenu}>
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}