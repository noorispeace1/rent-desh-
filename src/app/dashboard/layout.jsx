"use client";

import React, { useState, useEffect } from "react";
import DashboardSidebar from "@/component/dashboard/DashboardSidebar";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";


const DashboardLayout = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { data: session, isPending } = useSession();
  const router = useRouter();

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/auth/signin");
    }
  }, [session, isPending, router]);

  // Loading / Redirecting state
  if (isPending || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#009282] to-[#00b8a4] animate-pulse shadow-lg" />
          <p className="text-[#9CA3AF] text-sm font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  // if (!session) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
  //       <div className="text-center max-w-sm">
  //         <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#009282] to-[#00b8a4] flex items-center justify-center mx-auto mb-5 shadow-lg">
  //           <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  //             <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
  //           </svg>
  //         </div>
  //         <h2 className="text-xl font-bold text-[#1C1C1E] mb-2">Access Restricted</h2>
  //         <p className="text-[#6B7280] text-sm mb-6">Please sign in to view your dashboard.</p>
  //         <Link href="/auth/signin" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#009282] to-[#00a896] text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
  //           Sign In to Continue
  //         </Link>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      {/* Sidebar */}
      <DashboardSidebar
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* ── Top Bar ── */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#F3F4F6] h-[72px] flex items-center px-6 sm:px-10 gap-4">
          {/* Mobile hamburger */}
          <button
            className="lg:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded-xl hover:bg-[#F3F4F6] transition-colors"
            onClick={() => setIsMobileOpen(true)}
            aria-label="Open menu"
          >
            <span className="block w-5 h-0.5 bg-[#374151] rounded-full" />
            <span className="block w-5 h-0.5 bg-[#374151] rounded-full" />
            <span className="block w-3 h-0.5 bg-[#374151] rounded-full self-start" />
          </button>

          {/* Breadcrumb / Title */}
          <div className="flex-1 min-w-0 flex items-center gap-4">
            <h1 className="text-[16px] font-bold text-[#1C1C1E] truncate">
              {session?.user?.name ? `Welcome back, ${session.user.name.split(" ")[0]} 👋` : "Dashboard"}
            </h1>
            <span className="hidden sm:block text-[#D1D5DB]">|</span>
            <p className="text-[13px] font-medium text-[#9CA3AF] hidden sm:block">
              {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          {/* Right side actions */}
         
        </header>

        {/* ── Main Content ── */}
        <main className="flex-1 p-6 sm:p-10 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;