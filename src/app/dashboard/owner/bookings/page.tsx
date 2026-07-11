"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";

export default function OwnerBookingsPage() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!session?.user?.email) return;

      try {
        // Fetch all bookings for the owner's properties
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/bookings/owner/${session.user.email}`);
        if (res.ok) {
          const data = await res.json();
          // Filter out only the PAID bookings
          const paidBookings = data.filter((b) => b.paymentStatus === "PAID");
          setBookings(paidBookings);
        }
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [session?.user?.email]);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Paid Bookings</h1>
        <p className="text-gray-500">View all completed payments and confirmed bookings for your properties.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Tenant</th>
                <th className="px-6 py-4">Property Ref</th>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    <div className="flex justify-center items-center gap-2">
                      <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      Loading bookings...
                    </div>
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <div className="text-4xl mb-3">📄</div>
                    <p className="font-medium text-gray-900 mb-1">No paid bookings found</p>
                    <p className="text-sm">You do not have any completed bookings yet.</p>
                  </td>
                </tr>
              ) : (
                bookings.map((booking, index) => (
                  <tr key={booking._id || index} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
                          {booking.userName?.[0] || booking.email?.[0] || "?"}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{booking.userName || "Unknown Tenant"}</p>
                          <p className="text-xs text-gray-500">{booking.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 truncate max-w-[150px]">
                        {booking.propertyTitle || "Property"}
                      </p>
                      <p className="text-xs text-gray-500 font-mono" title={booking.propertyId}>
                        ID: {booking.propertyId?.slice(-6)}
                      </p>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">
                      {booking.transactionId || "N/A"}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      ৳{booking.monthlyRent || 0}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(booking.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                        {booking.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
