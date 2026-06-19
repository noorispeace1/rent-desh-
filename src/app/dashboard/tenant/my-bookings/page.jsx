"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSession } from '@/lib/auth-client';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import PropertiseFilter from '@/component/dashboard/owner/PropertiseFilter';
import PaymentHistory from '@/component/dashboard/tenant/PaymentHistory';
import MyBookingTable from '@/component/dashboard/tenant/MyBookingTable';
import { Chip } from "@heroui/react";
import { fetchUserBookings, processPaymentAction, fetchPaymentHistory } from '@/lib/actions/booking';

function MyBookingsPage() {
  const { data: session, isPending: sessionLoading } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Booking creation is now handled centrally by the Success page.

  // 2. Load Bookings
  useEffect(() => {
    if (!sessionLoading && session?.user?.email) {
      fetchData(session.user.email);
    } else if (!sessionLoading && !session) {
      setLoading(false);
    }
  }, [session, sessionLoading]);

  const fetchData = async (email) => {
    try {
      setLoading(true);
      const [bookingsData, paymentsData] = await Promise.all([
        fetchUserBookings(email),
        fetchPaymentHistory(email)
      ]);
      setBookings(bookingsData);
      setFilteredBookings(bookingsData);
      setPayments(paymentsData);
    } catch (error) {
      console.error("Failed to fetch bookings page data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (filters) => {
    const filtered = bookings.filter((booking) => {
      const matchesLocation = !filters.location || 
        booking.propertyTitle?.toLowerCase().includes(filters.location.toLowerCase());
      
      const matchesType = !filters.propertyType; // booking does not store type directly by default
      
      const matchesMinPrice = !filters.minPrice || 
        Number(booking.monthlyRent) >= Number(filters.minPrice);
      
      const matchesMaxPrice = !filters.maxPrice || 
        Number(booking.monthlyRent) <= Number(filters.maxPrice);

      return matchesLocation && matchesType && matchesMinPrice && matchesMaxPrice;
    });
    setFilteredBookings(filtered);
  };

  const handleClear = () => {
    setFilteredBookings(bookings);
  };

  const handlePayment = async (booking) => {
    try {
      toast.info("Preparing Stripe Checkout...");
      const res = await fetch('/api/checkout-sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId: booking.propertyId,
          propertyTitle: booking.propertyTitle,
          monthlyRent: booking.monthlyRent,
          userName: booking.userName,
          email: booking.email,
          phone: booking.phone,
          bookingDate: booking.bookingDate,
          additionalNotes: booking.additionalNotes,
          existingBookingId: booking._id,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Failed to generate checkout session.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error processing payment.");
    }
  };

  if (sessionLoading || loading) {
    return (
      <div className="w-full max-w-[1200px] mx-auto p-4 sm:p-6 lg:p-8 min-h-[400px] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#009282] to-[#00b8a4] animate-pulse shadow-lg mb-4" />
        <p className="text-[#9CA3AF] text-sm font-medium">Loading your bookings...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="w-full max-w-[1200px] mx-auto p-4 sm:p-6 lg:p-8 min-h-[400px] flex items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#009282] to-[#00b8a4] flex items-center justify-center mx-auto mb-5 shadow-lg">
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[#1C1C1E] mb-2">Access Restricted</h2>
          <p className="text-[#6B7280] text-sm mb-6">Please sign in to view your bookings.</p>
          <Link href="/auth/signin" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#009282] to-[#00a896] text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
            Sign In to Continue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1C1E] mb-2 tracking-tight">My Bookings</h1>
          <p className="text-[#6B7280] text-sm">Manage and view all your booked properties.</p>
        </div>
      </div>

      {/* Filter component */}
      <PropertiseFilter onFilter={handleFilter} onClear={handleClear} />

      <div className="mt-8">
        <MyBookingTable 
          bookings={filteredBookings} 
          session={session} 
          onPayment={handlePayment} 
        />
      </div>

      {/* Payment History Section */}
      <PaymentHistory payments={payments} />
    </div>
  );
}

export default function MyBookingsPageWrapper() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-[1200px] mx-auto p-4 sm:p-6 lg:p-8 min-h-[400px] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#009282] to-[#00b8a4] animate-pulse shadow-lg mb-4" />
        <p className="text-[#9CA3AF] text-sm font-medium">Loading your bookings...</p>
      </div>
    }>
      <MyBookingsPage />
    </Suspense>
  );
}