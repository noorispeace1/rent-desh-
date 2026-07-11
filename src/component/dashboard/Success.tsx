"use client";

import React, { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { CheckCircle, ArrowRight, Home, Receipt, FileText } from 'lucide-react';

const Success = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const propertyTitle = searchParams.get('propertyTitle');
  const monthlyRent = searchParams.get('monthlyRent');
  const transactionId = searchParams.get('session_id') || 'TXN_SUCCESS_XXXX';
  
  const [isSaved, setIsSaved] = React.useState(false);
  const hasAttemptedSave = React.useRef(false);

  useEffect(() => {
    // Show toastify message immediately upon entering the page
    const success = searchParams.get('success');
    
    if (success === 'true' && !isSaved && !hasAttemptedSave.current) {
      hasAttemptedSave.current = true;
      const propertyId = searchParams.get('propertyId');
      const existingBookingId = searchParams.get('existingBookingId');
      
      // Prevent running if it's just a subscription success
      if (existingBookingId) {
        const updateBooking = async () => {
          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/bookings/${existingBookingId}/pay`, {
              method: "PATCH",
            });
            if (res.ok) {
              toast.success("Payment Successful! Booking updated to PAID.");
              setIsSaved(true);
            }
          } catch (err) {
            console.error("Error updating booking record:", err);
          }
        };
        updateBooking();
      } else if (propertyId && !propertyId.startsWith('sub_')) {
        const userName = searchParams.get('userName');
        const email = searchParams.get('email');
        const phone = searchParams.get('phone');
        const bookingDate = searchParams.get('bookingDate');
        const additionalNotes = searchParams.get('additionalNotes');

        const saveBooking = async () => {
          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/bookings`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                propertyId,
                propertyTitle,
                monthlyRent,
                userName,
                email,
                phone,
                bookingDate,
                additionalNotes,
                transactionId,
                paymentStatus: "PAID",
                status: "PENDING"
              }),
            });
            if (res.ok) {
              toast.success("Payment Successful! Booking saved to your history.");
              setIsSaved(true);
            }
          } catch (err) {
            console.error("Error saving booking record:", err);
          }
        };
        saveBooking();
      } else {
        toast.success("Payment Successful! Your transaction is confirmed.");
        setIsSaved(true);
      }
    } else if (!isSaved && !hasAttemptedSave.current) {
        hasAttemptedSave.current = true;
        toast.success("Payment Successful! Your transaction is confirmed.");
        setIsSaved(true);
    }
  }, [searchParams, isSaved, propertyTitle, monthlyRent, transactionId]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-500">
      <div className="bg-white max-w-2xl w-full rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-[#F3F4F6] overflow-hidden">
        
        {/* Top Banner */}
        <div className="bg-gradient-to-br from-[#009282] to-[#00b8a4] p-10 text-center relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-6">
              <CheckCircle className="w-12 h-12 text-[#009282]" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Payment Successful!</h1>
            <p className="text-[#E0F5F3] font-medium text-lg">Thank you for your transaction.</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 sm:p-10">
          <div className="bg-[#F9FAFB] rounded-2xl border border-[#E5E7EB] p-6 mb-8">
            <h3 className="text-[13px] font-bold text-[#6B7280] uppercase tracking-wider mb-5 flex items-center gap-2">
              <Receipt className="w-4 h-4" />
              Transaction Details
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-[#E5E7EB] gap-4">
                <span className="text-[#6B7280] font-medium shrink-0">Transaction ID</span>
                <span className="text-[#1C1C1E] font-bold font-mono text-sm truncate">{transactionId}</span>
              </div>
              
              <div className="flex justify-between items-center pb-4 border-b border-[#E5E7EB] gap-4">
                <span className="text-[#6B7280] font-medium shrink-0">Item / Property</span>
                <span className="text-[#1C1C1E] font-bold text-right truncate" title={propertyTitle || "Subscription/Booking"}>
                  {propertyTitle || "Subscription / Booking"}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-[#6B7280] font-medium">Amount Paid</span>
                <span className="text-[24px] font-black text-[#009282]">
                  {monthlyRent ? `৳${monthlyRent}` : "Paid in Full"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/dashboard/tenant/my-bookings" className="flex-1">
              <button className="w-full py-3.5 px-6 rounded-xl bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#374151] font-bold transition-all flex items-center justify-center gap-2">
                <FileText className="w-5 h-5" />
                View My Bookings
              </button>
            </Link>
            <button 
              onClick={() => router.push('/properties')}
              className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#009282] to-[#00a896] hover:-translate-y-0.5 text-white font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              Explore Properties
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Success;