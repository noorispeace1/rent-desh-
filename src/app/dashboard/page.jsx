"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

const DashboardRedirectPage = () => {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (isPending) return; // wait for session to load

    if (!session) {
      router.replace("/auth/signin");
      return;
    }

    const rawRole = session.user?.role || "Tenant";
    const role = rawRole.charAt(0).toUpperCase() + rawRole.slice(1).toLowerCase();

    if (role === "Owner") {
      router.replace("/dashboard/owner");
    } else if (role === "Admin") {
      router.replace("/dashboard/admin");
    } else {
      // Default → Tenant
      router.replace("/dashboard/tenant");
    }
  }, [session, isPending, router]);

  // Loading spinner while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#009282] to-[#00b8a4] flex items-center justify-center shadow-lg animate-pulse">
          <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </div>
        <div className="flex flex-col items-center gap-1">
          <p className="text-[15px] font-bold text-[#1C1C1E]">Redirecting to your dashboard...</p>
          <p className="text-[13px] text-[#9CA3AF]">Please wait a moment</p>
        </div>
        <div className="flex gap-1.5 mt-2">
          <span className="w-2 h-2 bg-[#009282] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 bg-[#009282] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 bg-[#009282] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
};

export default DashboardRedirectPage;
