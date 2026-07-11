"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend,
} from "recharts";

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, icon, textColor, bg, badge, badgeColor, trend }) => (
  <div className="bg-white rounded-2xl p-5 border border-[#F3F4F6] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
    <div className="flex items-start justify-between mb-4">
      <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center text-xl`}>{icon}</div>
      <div className="flex flex-col items-end gap-1">
        {badge && <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${badgeColor}`}>{badge}</span>}
        {trend && (
          <span className={`text-[10px] font-bold ${trend > 0 ? "text-emerald-600" : "text-red-500"}`}>
            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </span>
        )}
      </div>
    </div>
    <p className={`text-2xl font-bold ${textColor} mb-0.5`}>{value}</p>
    <p className="text-[13px] font-semibold text-[#374151]">{label}</p>
    {sub && <p className="text-[11px] text-[#9CA3AF] mt-0.5">{sub}</p>}
  </div>
);

// ── Custom Tooltip ────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#F3F4F6] rounded-xl shadow-lg px-4 py-3 text-sm">
        <p className="font-bold text-[#374151] mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color }} className="font-semibold">
            {p.name}: ৳{(p.value / 1000).toFixed(0)}k
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ── Application Row ────────────────────────────────────────────────────────────
const AppRow = ({ name, property, date, status, statusColor }) => (
  <div className="flex items-center gap-3 py-3 border-b border-[#F9FAFB] last:border-0">
    <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm shrink-0">
      {name[0]}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[13px] font-bold text-[#374151] truncate">{name}</p>
      <p className="text-[11px] text-[#9CA3AF] truncate">{property}</p>
    </div>
    <div className="text-right shrink-0">
      <p className="text-[11px] text-[#9CA3AF] mb-0.5">{date}</p>
      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${statusColor}`}>{status}</span>
    </div>
  </div>
);

// ── Property Row ──────────────────────────────────────────────────────────────
const PropertyRow = ({ image, title, location, price, status, statusColor }) => (
  <div className="flex items-center gap-3 py-3 border-b border-[#F9FAFB] last:border-0">
    <img src={image} alt={title} className="w-12 h-12 rounded-xl object-cover shrink-0" />
    <div className="flex-1 min-w-0">
      <p className="text-[13px] font-bold text-[#1C1C1E] truncate">{title}</p>
      <p className="text-[11px] text-[#9CA3AF]">{location}</p>
    </div>
    <div className="text-right shrink-0">
      <p className="text-[13px] font-bold text-indigo-600">{price}</p>
      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${statusColor}`}>{status}</span>
    </div>
  </div>
);

// ── Main Page ─────────────────────────────────────────────────────────────────
const OwnerDashboard = () => {
  const { data: session } = useSession();

  const stats = [
    { label: "Total Properties", value: "8", sub: "6 occupied · 2 vacant", icon: "🏢", textColor: "text-indigo-600", bg: "bg-indigo-50", badge: "Portfolio", badgeColor: "bg-indigo-100 text-indigo-600", trend: 12 },
    { label: "Monthly Revenue", value: "৳1,24,000", sub: "vs ৳1,10,000 last month", icon: "💰", textColor: "text-emerald-600", bg: "bg-emerald-50", badge: "Record", badgeColor: "bg-emerald-100 text-emerald-700", trend: 13 },
    { label: "Active Tenants", value: "11", sub: "0 overdue payments", icon: "👥", textColor: "text-blue-600", bg: "bg-blue-50", badge: "All Paid", badgeColor: "bg-blue-100 text-blue-600", trend: 5 },
    { label: "New Applications", value: "4", sub: "Needs your review", icon: "📋", textColor: "text-amber-600", bg: "bg-amber-50", badge: "Review", badgeColor: "bg-amber-100 text-amber-700", trend: null },
  ];

  const revenueData = [
    { month: "Jan", revenue: 95000, target: 100000 },
    { month: "Feb", revenue: 108000, target: 100000 },
    { month: "Mar", revenue: 100000, target: 110000 },
    { month: "Apr", revenue: 115000, target: 110000 },
    { month: "May", revenue: 110000, target: 115000 },
    { month: "Jun", revenue: 124000, target: 115000 },
  ];

  const occupancyData = [
    { month: "Jan", occupied: 5, vacant: 3 },
    { month: "Feb", occupied: 6, vacant: 2 },
    { month: "Mar", occupied: 6, vacant: 2 },
    { month: "Apr", occupied: 7, vacant: 1 },
    { month: "May", occupied: 6, vacant: 2 },
    { month: "Jun", occupied: 6, vacant: 2 },
  ];

  const applications = [
    { name: "Rafiq Ahmed", property: "2 BHK – Gulshan", date: "Jun 17", status: "New", statusColor: "bg-blue-100 text-blue-600" },
    { name: "Sumaiya Islam", property: "Studio – Banani", date: "Jun 16", status: "Reviewing", statusColor: "bg-amber-100 text-amber-600" },
    { name: "Kamal Hossain", property: "3 BHK – Dhanmondi", date: "Jun 15", status: "Shortlisted", statusColor: "bg-indigo-100 text-indigo-600" },
    { name: "Priya Das", property: "Studio – Banani", date: "Jun 14", status: "Rejected", statusColor: "bg-red-100 text-red-600" },
  ];

  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/properties`);
        if (res.ok) {
          const data = await res.json();
          // Get the last 4 added properties
          const latest = data.reverse().slice(0, 4);
          const formatted = latest.map((p) => ({
            id: p._id,
            image: p.imageUrl || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=200&auto=format&fit=crop",
            title: p.title || "Untitled Property",
            location: p.location || "Location not provided",
            price: `৳${p.monthlyRent || 0}/mo`,
            status: "Available",
            statusColor: "bg-emerald-100 text-emerald-700",
          }));
          setProperties(formatted);
        }
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      }
    };
    fetchProperties();
  }, []);

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-7">

      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#3730A3] via-[#4338CA] to-[#6366F1] p-6 sm:p-8 text-white shadow-[0_8px_32px_rgba(55,48,163,0.25)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/4 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-5">
          <div>
            <p className="text-white/70 text-[13px] font-medium mb-1">🔑 Property Owner</p>
            <h2 className="text-2xl sm:text-3xl font-bold mb-1">{session?.user?.name || "Owner"}</h2>
            <p className="text-white/70 text-[14px]">
              <span className="text-white font-bold">4 new applications</span> and <span className="text-white font-bold">2 vacant units</span> to fill.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link href="/dashboard/owner/property/add" className="flex items-center gap-2 px-4 py-2.5 bg-white text-indigo-600 rounded-xl text-[13px] font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all">
              ➕ Add Property
            </Link>
            <Link href="/dashboard/owner/applications" className="flex items-center gap-2 px-4 py-2.5 bg-white/15 border border-white/30 text-white rounded-xl text-[13px] font-bold hover:bg-white/25 transition-all">
              📋 Applications
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div>
        <h3 className="text-[12px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-3">Overview</h3>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((s) => <StatCard key={s.label} {...s} />)}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-[3fr_2fr] gap-5">

        {/* Revenue Area Chart */}
        <div className="bg-white rounded-2xl border border-[#F3F4F6] shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-[15px] font-bold text-[#1C1C1E]">Revenue Trend</h3>
              <p className="text-[12px] text-[#9CA3AF]">Actual vs Target — Jan to Jun 2025</p>
            </div>
            <span className="text-[12px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              ↑ 13% this month
            </span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#009282" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#009282" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={(v) => `৳${v / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="target" name="Target" stroke="#009282" strokeWidth={2} strokeDasharray="4 4" fill="url(#colorTarget)" dot={false} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#6366F1" strokeWidth={2.5} fill="url(#colorRevenue)" dot={{ r: 4, fill: "#6366F1", strokeWidth: 0 }} activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Occupancy Bar Chart */}
        <div className="bg-white rounded-2xl border border-[#F3F4F6] shadow-sm p-6">
          <div className="mb-6">
            <h3 className="text-[15px] font-bold text-[#1C1C1E]">Occupancy Rate</h3>
            <p className="text-[12px] text-[#9CA3AF]">Occupied vs Vacant units</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={occupancyData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }} barCategoryGap="35%">
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #F3F4F6", fontSize: 12 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
              <Bar dataKey="occupied" name="Occupied" fill="#6366F1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="vacant" name="Vacant" fill="#F3F4F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-5">

        {/* Properties */}
        <div className="bg-white rounded-2xl border border-[#F3F4F6] shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[15px] font-bold text-[#1C1C1E]">My Properties</h3>
            <Link href="/dashboard/owner/property/add" className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 text-white text-[12px] font-bold rounded-xl hover:bg-indigo-700 transition-colors">
              ➕ Add New
            </Link>
          </div>
          {properties.map((p, i) => <PropertyRow key={i} {...p} />)}
          <Link href="/dashboard/owner/properties" className="block text-center text-[12px] text-indigo-600 font-semibold mt-4 hover:underline underline-offset-2">
            View all properties →
          </Link>
        </div>

        {/* Applications */}
        <div className="bg-white rounded-2xl border border-[#F3F4F6] shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-bold text-[#1C1C1E]">Applications</h3>
            <Link href="/dashboard/owner/applications" className="text-[12px] text-indigo-600 font-semibold hover:underline">View all</Link>
          </div>
          {applications.map((a, i) => <AppRow key={i} {...a} />)}

          {/* Summary */}
          <div className="mt-4 pt-4 border-t border-[#F9FAFB] grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-[#F9FAFB] rounded-xl">
              <p className="text-lg font-bold text-indigo-600">75%</p>
              <p className="text-[10px] text-[#9CA3AF]">Occupancy</p>
            </div>
            <div className="text-center p-3 bg-[#F9FAFB] rounded-xl">
              <p className="text-lg font-bold text-emerald-600">৳1.2L</p>
              <p className="text-[10px] text-[#9CA3AF]">This Month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-[12px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-3">Quick Actions</h3>
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {[
            { href: "/dashboard/owner/property/add", icon: "🏠", title: "List Property", desc: "Add a new unit", color: "bg-indigo-50" },
            { href: "/dashboard/owner/rent", icon: "💰", title: "Collect Rent", desc: "Track payments", color: "bg-emerald-50" },
            { href: "/dashboard/owner/tenants", icon: "👥", title: "Manage Tenants", desc: "View occupants", color: "bg-blue-50" },
            { href: "/dashboard/owner/analytics", icon: "📊", title: "Analytics", desc: "Revenue insights", color: "bg-purple-50" },
          ].map((a) => (
            <Link key={a.title} href={a.href} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-[#F3F4F6] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group duration-200">
              <div className={`w-10 h-10 rounded-xl ${a.color} flex items-center justify-center text-lg shrink-0 group-hover:scale-110 transition-transform`}>{a.icon}</div>
              <div className="min-w-0">
                <p className="text-[13px] font-bold text-[#1C1C1E]">{a.title}</p>
                <p className="text-[11px] text-[#9CA3AF]">{a.desc}</p>
              </div>
              <svg className="w-4 h-4 text-[#D1D5DB] ml-auto group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;