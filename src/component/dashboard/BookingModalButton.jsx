"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { Calendar, User, Mail, Phone, X } from "lucide-react";

export default function BookingModalButton({ propertyId, propertyTitle, monthlyRent }) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [loading, setLoading] = useState(false);

  // Set default values when session or modal loads
  useEffect(() => {
    if (session?.user) {
      setUserName(session.user.name || "");
      setEmail(session.user.email || "");
    }
    // Set default date to a few days from now
    const today = new Date();
    today.setDate(today.getDate() + 4); 
    const formattedDate = today.toISOString().split("T")[0];
    setBookingDate(formattedDate);
  }, [session, isOpen]);

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!session?.user) {
      toast.error("Please sign in to book a property!");
      return;
    }

    if (!phone) {
      toast.error("Please enter a phone number!");
      return;
    }

    try {
      setLoading(true);
      // Redirect to Stripe checkout
      const res = await fetch("/api/checkout-sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId,
          propertyTitle,
          monthlyRent,
          userName,
          email,
          phone,
          bookingDate,
          additionalNotes,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create Stripe checkout session");
      }

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Stripe session URL is missing");
      }
    } catch (error) {
      console.error("Error creating Stripe session:", error);
      toast.error(error.message || "Redirect to Stripe failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => {
          if (!session?.user) {
            toast.error("Please sign in to apply for rent!");
            return;
          }
          setIsOpen(true);
        }}
        className="w-full bg-[#009282] hover:bg-[#007A6C] text-white py-4 rounded-2xl text-[16px] font-bold transition-all shadow-[0_8px_20px_rgba(0,146,130,0.3)] hover:shadow-[0_10px_25px_rgba(0,146,130,0.4)] hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
      >
        Apply for rent
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>

      {/* Modal Backdrop & Container */}
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-white dark:bg-[#1C1C1E] w-full max-w-[550px] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-white/10 overflow-hidden transform transition-all p-6 sm:p-8 animate-in zoom-in-95 duration-200">
            
            {/* Close button */}
            <div className="flex justify-end mb-2">
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Header */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Booking Properties</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Please confirm your details to proceed with the booking.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleBooking} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* User Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">User Name</label>
                  <div className="flex items-center border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus-within:border-[#009282] dark:focus-within:border-[#009282] transition-colors">
                    <User className="w-4 h-4 text-gray-400 mr-3 shrink-0" />
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      required
                      className="w-full bg-transparent outline-none text-gray-900 dark:text-white font-medium text-sm"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</label>
                  <div className="flex items-center border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus-within:border-[#009282] dark:focus-within:border-[#009282] transition-colors">
                    <Mail className="w-4 h-4 text-gray-400 mr-3 shrink-0" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-transparent outline-none text-gray-900 dark:text-white font-medium text-sm"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phone</label>
                  <div className="flex items-center border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus-within:border-[#009282] dark:focus-within:border-[#009282] transition-colors">
                    <Phone className="w-4 h-4 text-gray-400 mr-3 shrink-0" />
                    <input
                      type="text"
                      placeholder="017XXXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full bg-transparent outline-none text-gray-900 dark:text-white font-medium text-sm placeholder-gray-400 dark:placeholder-gray-600"
                    />
                  </div>
                </div>

                {/* Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</label>
                  <div className="flex items-center border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus-within:border-[#009282] dark:focus-within:border-[#009282] transition-colors">
                    <Calendar className="w-4 h-4 text-gray-400 mr-3 shrink-0" />
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      required
                      className="w-full bg-transparent outline-none text-gray-900 dark:text-white font-medium text-sm cursor-pointer"
                    />
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Additional Notes</label>
                  <div className="border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 focus-within:border-[#009282] dark:focus-within:border-[#009282] transition-colors">
                    <textarea
                      placeholder="Enter any additional requests or notes..."
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      rows={3}
                      className="w-full bg-transparent outline-none text-gray-900 dark:text-white font-medium text-sm resize-none placeholder-gray-400 dark:placeholder-gray-600"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 mt-8 pt-5 border-t border-gray-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-2.5 bg-transparent border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300 rounded-xl text-sm font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#009282] to-[#00a896] hover:from-[#007a6c] hover:to-[#009282] text-white rounded-xl text-sm font-bold transition-all shadow-[0_4px_12px_rgba(0,146,130,0.3)] hover:shadow-[0_6px_16px_rgba(0,146,130,0.4)] active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Confirm Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
