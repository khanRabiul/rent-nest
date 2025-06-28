
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import Navbar from "@/ui/landingpage/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";
import ClientNavbarWrapper from "@/ui/auth/ClientNavbarWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RentNest",
  description: "RentNest - Your Ultimate Property Rental Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider enableSystem={true} defaultTheme="system">
          <AuthProvider>
            <ClientNavbarWrapper />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
