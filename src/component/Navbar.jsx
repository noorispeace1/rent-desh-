"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { toast } from "react-toastify";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { data: session, isPending } = useSession();
  const pathname = usePathname();
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Scroll shadow effect
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const rawRole = session?.user?.role || "";
  const userRole = rawRole ? (rawRole.charAt(0).toUpperCase() + rawRole.slice(1).toLowerCase()) : "";

  // Role-based dashboard path
  const dashboardHref =
    userRole === "Owner"
      ? "/dashboard/owner"
      : userRole === "Admin"
      ? "/dashboard/admin"
      : session
      ? "/dashboard/tenant"
      : "/dashboard";

  const propertiesHref = userRole === "Owner" ? "/dashboard/owner/properties" : "/dashboard/tenant/my-bookings";
  const propertiesLabel = userRole === "Owner" ? "My Properties" : "My Bookings";

  const menuItems = [
    { name: "Home", href: "/", icon: "🏠" },
    { name: "Properties", href: "/properties", icon: "🏢" },
    { name: "Services", href: "/services", icon: "⚡" },
    { name: "Blog", href: "/blog", icon: "📖" },
    { name: "Dashboard", href: dashboardHref, icon: "📊" },
  ];

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const handleSignOut = async () => {
    setIsProfileOpen(false);
    setIsMenuOpen(false);
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Logged out successfully!");
          window.location.href = "/";
        },
      },
    });
  };

  return (
    <>
      <nav
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-xl shadow-[0_2px_20px_rgba(0,0,0,0.08)] border-b border-[#F3F4F6]"
            : "bg-white/90 backdrop-blur-md border-b border-[#F9FAFB]"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between h-[68px]">

            {/* ── Brand ── */}
            <div className="flex items-center gap-4">
              {/* Mobile hamburger */}
              <button
                className="lg:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-xl hover:bg-[#F9FAFB] transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                <span className={`block w-5 h-0.5 bg-[#374151] rounded-full transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
                <span className={`block w-5 h-0.5 bg-[#374151] rounded-full transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`} />
                <span className={`block w-5 h-0.5 bg-[#374151] rounded-full transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
              </button>

              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#009282] to-[#00b8a4] flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="9 22 9 12 15 12 15 22" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="font-bold text-[1.35rem] text-[#1C1C1E] tracking-tight leading-none">
                  Rent<span className="text-[#009282]">Desh</span>
                </span>
              </Link>
            </div>

            {/* ── Desktop Nav Links ── */}
            <div className="hidden lg:flex items-center gap-1">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-4 py-2 rounded-xl text-[14px] font-semibold transition-all duration-200 group ${
                    isActive(item.href)
                      ? "text-[#009282] bg-[#F0FBF9]"
                      : "text-[#6B7280] hover:text-[#1C1C1E] hover:bg-[#F9FAFB]"
                  }`}
                >
                  {item.name}
                  {isActive(item.href) && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#009282] rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            {/* ── User Actions ── */}
            <div className="flex items-center gap-3">
              {isPending ? (
                <div className="w-9 h-9 rounded-full bg-[#F3F4F6] animate-pulse" />
              ) : session ? (
                /* ── Logged In ── */
                <div className="relative flex items-center gap-3" ref={dropdownRef}>

                  {/* Avatar Button */}
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2.5 py-1.5 pl-1.5 pr-3 rounded-2xl border border-[#E5E7EB] hover:border-[#D1D5DB] hover:bg-[#F9FAFB] transition-all group"
                  >
                    <img
                      src={session.user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user?.name || "U")}&background=009282&color=fff`}
                      alt="Avatar"
                      className="w-8 h-8 rounded-xl border border-[#E5E7EB] object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="hidden sm:block text-[13px] font-semibold text-[#374151] max-w-[90px] truncate">
                      {session.user?.name?.split(" ")[0] || "Account"}
                    </span>
                    <svg
                      width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      className={`transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`}
                    >
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileOpen && (
                    <div className="absolute top-[calc(100%+8px)] right-0 w-72 bg-white border border-[#E5E7EB] shadow-[0_8px_40px_rgba(0,0,0,0.12)] rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                      {/* User Info */}
                      <div className="p-4 bg-gradient-to-br from-[#F0FBF9] to-[#F9FAFB] border-b border-[#E5E7EB]">
                        <div className="flex items-center gap-3">
                          <img
                            src={session.user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user?.name || "U")}&background=009282&color=fff`}
                            alt="Avatar"
                            className="w-12 h-12 rounded-xl border-2 border-white shadow-sm object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-[#1C1C1E] text-[15px] truncate">{session.user?.name || "User"}</p>
                            <p className="text-[12px] text-[#6B7280] truncate">{session.user?.email}</p>
                            <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 bg-[#009282]/10 text-[#009282] rounded-full border border-[#009282]/20">
                              {session.user?.role || "Member"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-2">
                        {[
                          { href: dashboardHref, label: "Dashboard", icon: (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                          )},
                          { href: "/dashboard/profile", label: "My Profile", icon: (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                          )},
                          { href: propertiesHref, label: propertiesLabel, icon: (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                          )},
                          { href: "/settings", label: "Settings", icon: (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
                          )},
                        ].map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 text-[14px] font-medium text-[#374151] hover:text-[#1C1C1E] hover:bg-[#F9FAFB] rounded-xl transition-all"
                          >
                            <span className="text-[#9CA3AF]">{item.icon}</span>
                            {item.label}
                          </Link>
                        ))}
                      </div>

                      {/* Sign Out */}
                      <div className="p-2 pt-0 border-t border-[#F3F4F6] mt-1">
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-[14px] font-semibold text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* ── Logged Out ── */
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    href="/auth/signin"
                    className="px-5 py-2.5 text-[14px] font-semibold text-[#374151] hover:text-[#1C1C1E] hover:bg-[#F9FAFB] rounded-xl transition-all"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="px-5 py-2.5 text-[14px] font-bold text-white bg-gradient-to-r from-[#009282] to-[#00a896] rounded-xl shadow-[0_4px_12px_rgba(0,146,130,0.3)] hover:shadow-[0_6px_16px_rgba(0,146,130,0.4)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          }`}
          ref={mobileMenuRef}
        >
          <div className="border-t border-[#F3F4F6] bg-white px-5 py-4 flex flex-col gap-1">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-semibold transition-all ${
                  isActive(item.href)
                    ? "text-[#009282] bg-[#F0FBF9]"
                    : "text-[#374151] hover:bg-[#F9FAFB]"
                }`}
              >
                <span>{item.icon}</span>
                {item.name}
              </Link>
            ))}


            {/* Mobile Auth */}
            <div className="mt-3 pt-3 border-t border-[#F3F4F6]">  
              {session ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 px-4 py-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
                    <img
                      src={session.user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user?.name || "U")}&background=009282&color=fff`}
                      alt="Avatar"
                      className="w-11 h-11 rounded-xl object-cover border-2 border-[#E5E7EB]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-[#1C1C1E] truncate">{session.user?.name}</p>
                      <p className="text-[12px] text-[#6B7280] truncate">{session.user?.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={dashboardHref}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex-1 text-center py-3 rounded-xl text-[14px] font-bold text-[#009282] bg-[#F0FBF9] border border-[#B2DFDB] hover:bg-[#E0F5F3] transition-colors"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex-1 py-3 rounded-xl text-[14px] font-bold text-red-500 bg-red-50 border border-red-100 hover:bg-red-100 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/auth/signin"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-center py-3.5 rounded-xl text-[15px] font-semibold text-[#374151] border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-center py-3.5 rounded-xl text-[15px] font-bold text-white bg-gradient-to-r from-[#009282] to-[#00a896] shadow-[0_4px_12px_rgba(0,146,130,0.3)] hover:shadow-[0_6px_16px_rgba(0,146,130,0.4)] transition-all"
                  >
                    Get Started Free
                  </Link>
                </div>

)}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;