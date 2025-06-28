'use client'

import { usePathname } from "next/navigation";
import Navbar from "../landingpage/Navbar";

const ClientNavbarWrapper = () => {

  const pathname = usePathname();
  const hideNavbar = pathname.startsWith('/signin') || pathname.startsWith('/signup');

  if (hideNavbar) return null;

  return (
    <Navbar />
  );
};

export default ClientNavbarWrapper;