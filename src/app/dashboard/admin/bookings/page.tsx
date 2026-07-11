"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL"); // ALL, PAID, PENDING, CANCELLED

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/bookings`);
        if (res.ok) {
          const data = await res.json();
          // Sort by newest first
          data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setBookings(data);
        }
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((b) => {
    if (filter === "ALL") return true;
    if (filter === "PAID") return b.paymentStatus === "PAID";
    if (filter === "PENDING") return b.paymentStatus === "PENDING" || !b.paymentStatus;
    return true;
  });

  const totalRevenue = bookings
    .filter(b => b.paymentStatus === "PAID")
    .reduce((sum, b) => sum + Number(b.monthlyRent || 0), 0);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 mb-2">Platform Bookings</h1>
          <p className="text-gray-500 font-medium">Monitor and manage all booking activities across the platform.</p>
        </div>
        
        {/* Stats Summary */}
        <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Total Revenue</p>
            <p className="text-lg font-black text-indigo-600">৳{totalRevenue.toLocaleString()}</p>
          </div>
          <div className="w-px h-8 bg-gray-200"></div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Total Bookings</p>
            <p className="text-lg font-black text-gray-900">{bookings.length}</p>
          </div>
        </div>
      </div>

      {/* Filters & Table Container */}
      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden flex flex-col">
        
        {/* Filters Header */}
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50">
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
            {["ALL", "PAID", "PENDING"].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === f ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >
                {f}
              </button>
            ))}
          </div>
          
          <div className="relative">
            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search tenant or property..." 
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-full sm:w-64 transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-wider">Tenant Details</th>
                <th className="px-6 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-wider">Property</th>
                <th className="px-6 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-extrabold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                      <span className="text-gray-400 font-medium text-sm">Loading bookings...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center">
                    <div className="text-5xl mb-4">📭</div>
                    <p className="font-bold text-gray-900 text-lg mb-1">No bookings found</p>
                    <p className="text-gray-500 text-sm">No bookings match the current filter.</p>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 flex items-center justify-center font-bold shrink-0 shadow-inner">
                          {booking.userName?.[0] || booking.email?.[0] || "?"}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{booking.userName || "Unknown User"}</p>
                          <p className="text-xs text-gray-500">{booking.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900 truncate max-w-[200px]" title={booking.propertyTitle}>
                        {booking.propertyTitle || "Untitled Property"}
                      </p>
                      <p className="text-xs text-gray-400 font-mono">
                        Ref: {booking.propertyId?.slice(-6) || "N/A"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-black text-gray-900">৳{booking.monthlyRent || 0}</p>
                      {booking.transactionId && (
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">Txn: {booking.transactionId}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">
                      {new Date(booking.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric", month: "short", year: "numeric"
                      })}
                    </td>
                    <td className="px-6 py-4">
                      {booking.paymentStatus === "PAID" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          PAID
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          PENDING
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        {!loading && filteredBookings.length > 0 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500 bg-gray-50/50">
            <p>Showing <span className="font-bold text-gray-900">{filteredBookings.length}</span> bookings</p>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 font-medium transition-colors" disabled>Previous</button>
              <button className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 font-medium transition-colors" disabled>Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
