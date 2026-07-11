"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function PaymentButton({ bookingId, propertyTitle, monthlyRent }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handlePayment = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/bookings/${bookingId}/pay`, {
                method: 'PATCH'
            });
            if (res.ok) {
                const data = await res.json();
                const txnId = data.result?.transactionId || `TXN${Math.floor(Math.random() * 10000000)}`;
                // Redirect to success page without propertyId to prevent duplicate booking creation in Success.jsx
                router.push(`/dashboard/tenant/success?success=true&propertyTitle=${encodeURIComponent(propertyTitle || 'Property')}&monthlyRent=${monthlyRent || 0}&session_id=${txnId}`);
            } else {
                toast.error("Failed to process payment");
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred during payment");
            setLoading(false);
        }
    };

    return (
        <button 
            onClick={handlePayment} 
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#009282] to-[#00a896] text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
        >
            {loading ? 'Processing...' : 'Pay Rent Now'}
            {!loading && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>}
        </button>
    );
}
