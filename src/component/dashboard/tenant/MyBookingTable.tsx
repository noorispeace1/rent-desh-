"use client";

import React from 'react';
import Link from 'next/link';

export default function MyBookingTable({ bookings, session, onPayment }) {
  const hasBookings = bookings && bookings.length > 0;

  if (!hasBookings) {
    return (
      <div className="bg-[#2A2B36] border border-[#3A3B46] rounded-3xl py-20 flex flex-col items-center justify-center shadow-lg">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-md">
          <svg className="w-10 h-10 text-[#9CA3AF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2 tracking-tight">No bookings found</h3>
        <p className="text-[#9CA3AF] font-medium text-sm">You haven't booked any properties yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2rem] shadow-xl shadow-[#009282]/5 border border-[#E5E7EB] overflow-hidden">
      <div className="overflow-x-auto max-h-[600px]">
        <table className="w-full text-left text-[14px]">
          <thead className="bg-[#F9FAFB] text-[#4B5563] font-bold text-[11px] uppercase tracking-widest sticky top-0 z-10 border-b border-[#E5E7EB]">
            <tr>
              <th className="py-5 px-6 whitespace-nowrap">Property Name</th>
              <th className="py-5 px-6 whitespace-nowrap">Tenant Details</th>
              <th className="py-5 px-6 whitespace-nowrap">Price</th>
              <th className="py-5 px-6 whitespace-nowrap">Transaction ID</th>
              <th className="py-5 px-6 whitespace-nowrap">Booking Date</th>
              <th className="py-5 px-6 whitespace-nowrap">Payment</th>
              <th className="py-5 px-6 whitespace-nowrap">Status</th>
              <th className="py-5 px-6 whitespace-nowrap text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F3F4F6]">
            {bookings.map((booking, index) => (
              <tr key={booking._id || index} className="hover:bg-[#F0FBF9] transition-colors group">
                
                {/* Property Name */}
                <td className="py-5 px-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-[#1C1C1E] font-bold text-sm tracking-tight whitespace-nowrap">{booking.propertyTitle || 'N/A'}</span>
                    <span className="text-[#9CA3AF] text-xs flex items-center gap-1 whitespace-nowrap">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {booking.location || 'Location Not Provided'}
                    </span>
                  </div>
                </td>

                {/* Tenant Details */}
                <td className="py-5 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#009282] to-[#00E5CC] text-white font-bold flex items-center justify-center shadow-md shrink-0">
                      {(booking.userName || session?.user?.name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[#1C1C1E] font-bold text-sm whitespace-nowrap">
                        {booking.userName || session?.user?.name || 'User'}
                      </span>
                      <span className="text-[#6B7280] text-xs whitespace-nowrap">
                        {booking.email || session?.user?.email || 'N/A'}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Price */}
                <td className="py-5 px-6">
                  <div className="flex flex-col">
                    <span className="text-[#009282] font-black text-[15px] whitespace-nowrap">${booking.monthlyRent || 'N/A'}</span>
                    <span className="text-[#9CA3AF] text-[10px] uppercase font-bold tracking-wider">Monthly</span>
                  </div>
                </td>

                {/* Transaction ID */}
                <td className="py-5 px-6">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#F0FBF9] flex items-center justify-center border border-[#009282]/10 shrink-0">
                      <svg className="w-3.5 h-3.5 text-[#009282]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <span className="text-[#4B5563] font-mono text-xs font-semibold bg-gray-50 px-2 py-1 rounded-md border border-gray-100 whitespace-nowrap">
                      {booking.transactionId ? `${booking.transactionId.substring(0, 15)}...` : 'N/A'}
                    </span>
                  </div>
                </td>

                {/* Booking Date */}
                <td className="py-5 px-6">
                  <span className="text-[#4B5563] font-semibold text-sm whitespace-nowrap">{booking.bookingDate || 'N/A'}</span>
                </td>

                {/* Payment Status */}
                <td className="py-5 px-6">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border whitespace-nowrap ${
                    booking.paymentStatus === 'PAID' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : 'bg-orange-50 text-orange-700 border-orange-200'
                  }`}>
                    {booking.paymentStatus || 'PENDING'}
                  </span>
                </td>

                {/* Status */}
                <td className="py-5 px-6">
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest whitespace-nowrap ${
                    booking.status === 'APPROVED' ? 'text-emerald-500' : 
                    booking.status === 'REJECTED' ? 'text-red-500' : 'text-orange-500'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      booking.status === 'APPROVED' ? 'bg-emerald-500' : 
                      booking.status === 'REJECTED' ? 'bg-red-500' : 'bg-orange-500'
                    }`}></span>
                    {booking.status || 'PENDING'}
                  </span>
                </td>

                {/* Actions */}
                <td className="py-5 px-6">
                  <div className="flex items-center justify-center gap-2">
                    {booking.paymentStatus !== 'PAID' ? (
                      <button 
                        onClick={() => onPayment(booking)}
                        className="bg-[#009282] hover:bg-[#007A6C] text-white px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm whitespace-nowrap"
                      >
                        Pay Rent
                      </button>
                    ) : (
                      <button disabled className="bg-gray-100 text-[#9CA3AF] px-4 py-1.5 rounded-full text-xs font-bold cursor-not-allowed whitespace-nowrap">
                        Paid
                      </button>
                    )}
                    <Link href={`/dashboard/tenant/my-bookings/info/${booking._id || booking.key || index}`}>
                      <button className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-[#009282]/10 text-[#6B7280] hover:text-[#009282] transition-colors shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
