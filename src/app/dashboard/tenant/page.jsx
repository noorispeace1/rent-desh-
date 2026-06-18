"use client";

import React from "react";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";

const StatCard = ({ label, value, icon }) => (
  <div className="bg-white rounded-xl p-5 border border-[#F3F4F6] flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <p className="text-[12px] font-bold text-[#1C1C1E]">{label}</p>
      <span className="text-[#1C1C1E]">{icon}</span>
    </div>
    <p className="text-2xl font-bold text-[#1C1C1E]">{value}</p>
  </div>
);

const TenantDashboard = () => {
  const { data: session } = useSession();

  const stats = [
    { label: "Total Bookings", value: "12", icon: "🗓️" },
    { label: "Favorites", value: "8", icon: "❤️" },
    { label: "Active Rentals", value: "2", icon: "🏠" },
    { label: "Profile Status", value: "Completed", icon: "👤" },
  ];

  const recentActivity = [
    "Booked a 2-bedroom apartment in Dhaka.",
    "Added \"Luxury Family Flat\" to favorites.",
    "Updated profile information.",
    "Viewed 5 new rental properties.",
  ];

  return (
    <div className="flex flex-col gap-6 max-w-6xl w-full">
      {/* Welcome Banner */}
      <div className="bg-[#1C1C1E] rounded-2xl p-6 sm:p-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            Welcome Back <span className="text-2xl">👋</span>
          </h2>
          <p className="text-[13px] text-white/70">
            Manage your bookings, favorite properties, and profile from your dashboard.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border border-[#F3F4F6] p-6 shadow-sm">
        <h3 className="text-[13px] font-bold text-[#1C1C1E] mb-5">Recent Activity</h3>
        <div className="flex flex-col gap-3">
          {recentActivity.map((activity, i) => (
            <p key={i} className="text-[13px] text-[#6B7280]">
              <span className="text-[#D1D5DB] mr-2">•</span> {activity}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TenantDashboard;