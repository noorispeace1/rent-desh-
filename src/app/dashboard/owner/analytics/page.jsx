"use client";

import React, { useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell, ComposedChart
} from "recharts";

// ── Mock Data ─────────────────────────────────────────────────────────────────
const financialData = [
  { month: "Jan", revenue: 125000, expenses: 35000, profit: 90000 },
  { month: "Feb", revenue: 130000, expenses: 38000, profit: 92000 },
  { month: "Mar", revenue: 128000, expenses: 32000, profit: 96000 },
  { month: "Apr", revenue: 140000, expenses: 45000, profit: 95000 },
  { month: "May", revenue: 155000, expenses: 40000, profit: 115000 },
  { month: "Jun", revenue: 165000, expenses: 42000, profit: 123000 },
  { month: "Jul", revenue: 160000, expenses: 39000, profit: 121000 },
];

const expenseBreakdown = [
  { name: "Maintenance", value: 45000 },
  { name: "Property Tax", value: 30000 },
  { name: "Insurance", value: 15000 },
  { name: "Management", value: 20000 },
];
const COLORS = ["#6366F1", "#EC4899", "#14B8A6", "#F59E0B"];

const propertyPerformance = [
  { name: "Gulshan Villa", revenue: 85000, occupancy: 100 },
  { name: "Banani Studio", revenue: 45000, occupancy: 85 },
  { name: "Dhanmondi Apt", revenue: 60000, occupancy: 90 },
  { name: "Bashundhara", revenue: 35000, occupancy: 60 },
];

// ── Components ────────────────────────────────────────────────────────────────

const MetricCard = ({ title, amount, trend, isPositive, icon }) => (
  <div className="relative overflow-hidden bg-white/60 backdrop-blur-xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 rounded-3xl hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group">
    <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-inner text-xl">
        {icon}
      </div>
      <div className={`px-3 py-1 rounded-full text-xs font-bold ${isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
        {isPositive ? '+' : ''}{trend}%
      </div>
    </div>
    <h3 className="text-gray-500 font-medium text-sm mb-1">{title}</h3>
    <p className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
      {amount}
    </p>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/95 backdrop-blur-md border border-gray-800 rounded-2xl shadow-2xl p-4 text-sm text-white">
        <p className="font-bold text-gray-300 mb-2 border-b border-gray-700 pb-2">{label}</p>
        {payload.map((p) => (
          <div key={p.name} className="flex items-center gap-3 justify-between my-1">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
              <span className="text-gray-300">{p.name}</span>
            </span>
            <span className="font-bold">৳{(p.value / 1000).toFixed(1)}k</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function OwnerAnalyticsUnique() {
  const [timeRange, setTimeRange] = useState("6m");

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 mb-2">
            Analytics Overview
          </h1>
          <p className="text-gray-500 font-medium">Deep dive into your portfolio's financial health and performance.</p>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-2xl">
          {["1m", "3m", "6m", "1y"].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${timeRange === range ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard title="Total Revenue" amount="৳8.4L" trend={12.5} isPositive={true} icon="💎" />
        <MetricCard title="Net Profit" amount="৳6.1L" trend={15.2} isPositive={true} icon="📈" />
        <MetricCard title="Total Expenses" amount="৳2.3L" trend={-4.1} isPositive={false} icon="📉" />
        <MetricCard title="Avg. ROI" amount="8.4%" trend={1.2} isPositive={true} icon="🎯" />
      </div>

      {/* Main Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Financial Overview (Takes up 2 columns) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">Cash Flow Analysis</h2>
              <p className="text-sm text-gray-500 mt-1">Revenue vs Expenses over time</p>
            </div>
            <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
            </div>
          </div>
          
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={financialData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} tickFormatter={(v) => `৳${v/1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                <Bar dataKey="revenue" name="Revenue" fill="#6366F1" radius={[6, 6, 0, 0]} barSize={20} />
                <Bar dataKey="expenses" name="Expenses" fill="#F43F5E" radius={[6, 6, 0, 0]} barSize={20} />
                <Area type="monotone" dataKey="profit" name="Net Profit" fill="url(#profitGrad)" stroke="#10B981" strokeWidth={3} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Breakdown Pie Chart */}
        <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-700 shadow-2xl relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 flex-shrink-0">
            <h2 className="text-xl font-extrabold text-white mb-1">Expense Breakdown</h2>
            <p className="text-sm text-gray-400 mb-6">Where your money goes</p>
          </div>
          
          <div className="flex-1 min-h-[200px] relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {expenseBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.9)', border: '1px solid #374151', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value) => `৳${(value/1000).toFixed(1)}k`}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Label for Pie */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-[-10px]">
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total</span>
              <span className="text-white text-xl font-black">৳1.1L</span>
            </div>
          </div>
          
          <div className="mt-6 space-y-3 relative z-10 flex-shrink-0">
            {expenseBreakdown.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between bg-white/5 rounded-xl p-3 border border-white/5">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full shadow-[0_0_10px_currentColor]" style={{ backgroundColor: COLORS[i], color: COLORS[i] }} />
                  <span className="text-sm font-medium text-gray-300">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-white">৳{(item.value/1000).toFixed(1)}k</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Property Performance */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <h2 className="text-xl font-extrabold text-gray-900 mb-1">Property Performance</h2>
          <p className="text-sm text-gray-500 mb-8">Revenue generation by individual properties</p>
          
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={propertyPerformance} layout="vertical" margin={{ top: 0, right: 30, left: 30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E7EB" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} tickFormatter={(v) => `৳${v/1000}k`} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#4B5563', fontSize: 13, fontWeight: 600}} width={120} />
                <Tooltip cursor={{fill: '#F3F4F6'}} content={<CustomTooltip />} />
                <Bar dataKey="revenue" name="Revenue" fill="#8B5CF6" radius={[0, 6, 6, 0]} barSize={24}>
                  {propertyPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#6366F1' : '#8B5CF6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Actionable Insights */}
        <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col justify-between group hover:shadow-2xl transition-all duration-500">
          <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none mix-blend-overlay" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
              ✨ AI Insights
            </div>
            <h2 className="text-3xl font-black mb-4 leading-tight tracking-tight">
              Your portfolio is performing <span className="text-emerald-300">12% better</span> than the market average.
            </h2>
            
            <ul className="space-y-4 mt-6">
              {[
                "Gulshan Villa is generating 40% of your total revenue.",
                "Maintenance costs spiked in April due to AC repairs.",
                "Dhanmondi Apt has a lease expiring in 45 days. Consider renewing.",
                "Overall occupancy is stable at 92%."
              ].map((insight, i) => (
                <li key={i} className="flex items-start gap-3 bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all hover:translate-x-1 cursor-default">
                  <span className="text-xl shrink-0 drop-shadow-md">💡</span>
                  <span className="text-sm font-medium leading-relaxed text-indigo-50">{insight}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <button className="w-full mt-8 py-4 bg-white text-indigo-700 font-bold text-sm rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0 active:shadow-md transition-all relative z-10">
            Download Full Report
          </button>
        </div>

      </div>
    </div>
  );
}
