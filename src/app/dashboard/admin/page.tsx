"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Cell 
} from "recharts";
import { Users, Building, Calendar, DollarSign, TrendingUp, ArrowUpRight } from "lucide-react";

const COLORS = ["#009282", "#3b82f6", "#6366f1", "#f59e0b", "#ec4899"];

const StatCard = ({ title, value, change, icon: Icon, colorClass }) => (
  <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
    <div className="space-y-2">
      <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">{title}</p>
      <h3 className="text-3xl font-extrabold text-[#1C1C1E]">{value}</h3>
      <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
        <TrendingUp className="w-3.5 h-3.5" />
        {change} <span className="text-[#9CA3AF] font-medium">this month</span>
      </p>
    </div>
    <div className={`p-4 rounded-2xl ${colorClass}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
  </div>
);

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/admin/stats`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching admin stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !mounted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#009282] to-[#00b8a4] animate-pulse shadow-lg mb-4" />
        <p className="text-[#9CA3AF] text-sm font-medium">Loading admin dashboard statistics...</p>
      </div>
    );
  }

  // Fallbacks if backend doesn't have distribution yet
  const chartData = stats?.monthlyStats || [];
  const barData = stats?.propertyDistribution?.length > 0 ? stats.propertyDistribution : [
    { name: "Apartment", value: stats?.totalProperties || 0 },
    { name: "House", value: Math.max(0, (stats?.totalProperties || 0) - 2) },
    { name: "Commercial", value: Math.min(2, stats?.totalProperties || 0) }
  ];

  return (
    <div className="flex flex-col gap-8 max-w-6xl w-full mx-auto">
      {/* Welcome Header */}
      <div className="bg-[#1C1C1E] rounded-3xl p-6 sm:p-8 flex items-center justify-between shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight">
            Admin Overview 👋
          </h2>
          <p className="text-[13px] text-white/70">
            Monitor users, manage property listings, and track platform booking analytics.
          </p>
        </div>
        <div className="hidden sm:block">
          <span className="text-[12px] bg-white/10 text-white border border-white/20 px-3 py-1.5 rounded-full font-bold">
            Platform Moderation Mode
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard 
          title="Total Users" 
          value={stats?.totalUsers || 0} 
          change="+12.3%" 
          icon={Users} 
          colorClass="bg-[#3b82f6]" 
        />
        <StatCard 
          title="Properties Listed" 
          value={stats?.totalProperties || 0} 
          change="+8.5%" 
          icon={Building} 
          colorClass="bg-[#009282]" 
        />
        <StatCard 
          title="Total Bookings" 
          value={stats?.totalBookings || 0} 
          change="+15.2%" 
          icon={Calendar} 
          colorClass="bg-[#6366f1]" 
        />
        <StatCard 
          title="Total Transactions" 
          value={`৳${stats?.totalTransactions || 0}`} 
          change="+10.8%" 
          icon={DollarSign} 
          colorClass="bg-[#f59e0b]" 
        />
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
        {/* Revenue Area Chart */}
        <div className="bg-white p-6 rounded-3xl border border-[#E5E7EB] shadow-sm flex flex-col gap-4">
          <div>
            <h3 className="text-base font-extrabold text-[#1C1C1E]">Platform Growth & Activity</h3>
            <p className="text-xs text-[#9CA3AF]">Estimated transaction value index per month (BDT)</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#009282" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#009282" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1C1C1E", border: "none", borderRadius: "16px", color: "#fff" }}
                  labelStyle={{ fontWeight: "bold", marginBottom: "4px" }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#009282" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Property Type Bar Chart */}
        <div className="bg-white p-6 rounded-3xl border border-[#E5E7EB] shadow-sm flex flex-col gap-4">
          <div>
            <h3 className="text-base font-extrabold text-[#1C1C1E]">Property Distribution</h3>
            <p className="text-xs text-[#9CA3AF]">Split by type of listing currently active</p>
          </div>
          <div className="h-[300px] w-full flex items-center justify-center">
            {barData.length === 0 ? (
              <p className="text-sm text-[#9CA3AF] italic">No distribution data</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="name" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                  <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1C1C1E", border: "none", borderRadius: "16px", color: "#fff" }}
                    cursor={{ fill: "#F9FAFB" }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={36}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity / Platform Table */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-extrabold text-[#1C1C1E]">Quick Moderation Center</h3>
            <p className="text-xs text-[#9CA3AF]">Manage pending verification requests and alerts</p>
          </div>
          <Link href="/dashboard/admin/properties" className="text-xs font-bold text-[#009282] hover:underline flex items-center gap-1">
            View all properties
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#4B5563]">
            <thead>
              <tr className="border-b border-[#F3F4F6] text-[#9CA3AF] text-[11px] font-bold uppercase tracking-wider">
                <th className="pb-3 pl-4">Platform Area</th>
                <th className="pb-3">Database Target</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right pr-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6] font-semibold text-[13.5px] text-[#1C1C1E]">
              <tr>
                <td className="py-4 pl-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-xs">👥</div>
                  User Accounts
                </td>
                <td className="py-4 text-[#6B7280]">Collection "user"</td>
                <td className="py-4">
                  <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-bold">Synchronized</span>
                </td>
                <td className="py-4 text-right pr-4">
                  <Link href="/dashboard/admin/users" className="text-gray-400 hover:text-[#009282] transition-colors">Manage</Link>
                </td>
              </tr>
              <tr>
                <td className="py-4 pl-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center text-xs">🏢</div>
                  Property Directory
                </td>
                <td className="py-4 text-[#6B7280]">Collection "property"</td>
                <td className="py-4">
                  <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-bold">Synchronized</span>
                </td>
                <td className="py-4 text-right pr-4">
                  <Link href="/dashboard/admin/properties" className="text-gray-400 hover:text-[#009282] transition-colors">Moderation</Link>
                </td>
              </tr>
              <tr>
                <td className="py-4 pl-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center text-xs">🗓️</div>
                  Lease & Bookings
                </td>
                <td className="py-4 text-[#6B7280]">Collection "favorites"</td>
                <td className="py-4">
                  <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-bold">Active</span>
                </td>
                <td className="py-4 text-right pr-4">
                  <Link href="/dashboard/admin/bookings" className="text-gray-400 hover:text-[#009282] transition-colors">Inspect</Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
