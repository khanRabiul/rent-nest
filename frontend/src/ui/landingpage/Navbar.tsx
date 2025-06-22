'use client';

import { useEffect, useState } from "react";
import ThemeSwitcher from "../ThemeSwitcher";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {

  const [isScrolled, setIsScrolled] = useState(false);

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


  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${isScrolled ? 'bg-white/80 backdrop-filter backdrop-blur-lg shadow-lg' : 'bg-transparent'} text-[var(--foreground)]`}
    >

      <div className="container flex items-center justify-between gap-8">
        {/* Logo */}
        <Link href='/' className="">
          <Image src='/images/logo/rent-nest-tranparent.png' alt="RentNest Logo" width={100} height={40} />
        </Link>

        {/* Desktop Menu */}
        <div className="flex items-center justify-between gap-12">
          <div className="hidden md:flex items-center md:gap-4 lg:gap-12">
            <Link href='/' className="font-semibold hover:text-[var(--secondary)]">Home</Link>
            <Link href='/contact-us' className="font-semibold hover:text-[var(--secondary)]">Contact us</Link>
            <Link href='/signin' className="font-semibold hover:text-[var(--secondary)]">Signin</Link>
            <Link href='/signup' className="font-semibold hover:text-[var(--secondary)]">Sign up</Link>
          </div>

          <div className="hidden md:block">
            <ThemeSwitcher />
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;