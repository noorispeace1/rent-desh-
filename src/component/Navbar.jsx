"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import { toast } from "react-toastify";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Real auth session
  const { data: session, isPending } = useSession();
  
  const dropdownRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "All Properties", href: "/properties" },
    { name: "Services", href: "/services" },
    { name: "Blog", href: "/blog" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-[#EFEBE9] sticky top-0 z-50 w-full py-3 px-6 shadow-[0_4px_20px_rgb(0,0,0,0.05)]">
      <div className="max-w-[1536px] mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-4">
          <button 
            className="lg:hidden text-[#5D4037] p-2 hover:bg-[#F5F1EE] rounded-full transition-colors" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
          <Link href="/" className="font-bold font-serif text-2xl sm:text-3xl text-[#4E342E]">
            RentDesh
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8">
          {menuItems.map((item) => (
            <Link key={item.name} href={item.href} className="text-[#795548] font-medium hover:text-[#4E342E] transition-colors">
              {item.name}
            </Link>
          ))}
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          {session ? (
            <div className="relative flex items-center gap-2" ref={dropdownRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="focus:outline-none transition-transform hover:scale-105 active:scale-95"
              >
                <img 
                  src={session.user?.image || "https://i.pravatar.cc/150?u=default"} 
                  alt="User Avatar" 
                  className="w-10 h-10 rounded-full border-2 border-[#6D4C41] object-cover shadow-sm" 
                  referrerPolicy="no-referrer"
                />
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute top-14 right-0 w-64 bg-white border border-[#EFEBE9] shadow-xl rounded-2xl py-2 px-1 flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-3 py-3 border-b border-[#EFEBE9] mb-1 bg-[#F5F1EE]/50 rounded-t-xl mx-1">
                    <p className="text-xs text-[#795548] mb-0.5 font-medium">Signed in as</p>
                    <p className="font-bold text-[#4E342E] truncate w-full text-base">{session.user?.name || "User"}</p>
                    <p className="text-sm text-[#795548] truncate w-full">{session.user?.email}</p>
                  </div>
                  
                  <Link 
                    href="/dashboard" 
                    className="text-[#5D4037] font-semibold px-4 py-2.5 hover:bg-[#F5F1EE] rounded-xl transition-colors mx-1"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Dashboard
                  </Link>
                  
                  <button 
                    className="text-left text-red-600 font-bold px-4 py-2.5 hover:bg-red-50 rounded-xl transition-colors mt-1 mx-1"
                    onClick={async () => {
                      setIsProfileOpen(false);
                      await signOut({
                        fetchOptions: {
                          onSuccess: () => {
                            toast.success("Successfully logged out!");
                            window.location.href = "/";
                          },
                        },
                      });
                    }}
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex gap-3">
              <Link href="/auth/signin" className="text-[#795548] font-medium px-5 py-2 hover:bg-[#F5F1EE] rounded-full transition-colors">
                Login
              </Link>
              <Link href="/auth/signup" className="bg-[#4E342E] text-white px-6 py-2 rounded-full font-medium hover:bg-[#3E2723] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-[#EFEBE9] shadow-xl py-6 px-6 flex flex-col gap-4 animate-in slide-in-from-top-4">
          {menuItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href} 
              className="text-[#5D4037] text-lg font-semibold py-3 px-4 hover:bg-[#F5F1EE] rounded-xl block transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          
          {session ? (
            <div className="flex flex-col gap-3 pt-6 mt-2 border-t border-[#EFEBE9]">
              <div className="flex items-center gap-4 px-4 py-3 bg-[#F5F1EE]/80 rounded-2xl border border-[#EFEBE9]">
                <img 
                  src={session.user?.image || "https://i.pravatar.cc/150?u=default"} 
                  alt="User" 
                  className="w-12 h-12 rounded-full border-2 border-[#6D4C41] object-cover" 
                  referrerPolicy="no-referrer"
                />
                <div className="flex flex-col overflow-hidden">
                  <span className="font-bold text-[#4E342E] text-lg truncate">{session.user?.name || "User"}</span>
                  <span className="text-sm text-[#795548] font-medium truncate">{session.user?.email}</span>
                </div>
              </div>
              <div className="flex gap-3 w-full mt-2">
                <Link 
                  href="/dashboard" 
                  className="flex-1 text-center bg-[#EFEBE9] text-[#4E342E] py-3.5 rounded-xl font-bold hover:bg-[#D7CCC8] transition-colors shadow-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button 
                  onClick={async () => {
                    setIsMenuOpen(false);
                    await signOut({
                      fetchOptions: {
                        onSuccess: () => {
                          toast.success("Successfully logged out!");
                          window.location.href = "/";
                        },
                      },
                    });
                  }}
                  className="flex-1 text-center text-red-600 border border-red-200 bg-red-50 py-3.5 rounded-xl font-bold hover:bg-red-100 transition-colors shadow-sm"
                >
                  Log Out
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3 pt-6 mt-2 border-t border-[#EFEBE9]">
              <Link 
                href="/auth/signin" 
                className="text-center font-semibold text-[#5D4037] py-3.5 border border-[#EFEBE9] rounded-xl hover:bg-[#F5F1EE] transition-colors" 
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                href="/auth/signup" 
                className="text-center bg-[#4E342E] text-white py-3.5 rounded-xl font-semibold hover:bg-[#3E2723] transition-colors shadow-md" 
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;