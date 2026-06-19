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
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-[550px] rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all p-6 sm:p-8 animate-in zoom-in-95 duration-200">
            
            {/* Close button */}
            <div className="flex justify-end mb-2">
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Header */}
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-[#1C1C1E] mb-2">Booking Properties</h3>
              <p className="text-xs text-[#6B7280]">
                Make changes to your profile here. Click save when you're done
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleBooking} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* User Name */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">User Name</label>
                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                    <User className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      required
                      className="w-full bg-transparent outline-none text-[#1C1C1E] font-medium text-sm"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Email</label>
                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                    <Mail className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-transparent outline-none text-[#1C1C1E] font-medium text-sm"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Phone</label>
                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-[#009282] transition-colors">
                    <Phone className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                    <input
                      type="text"
                      placeholder="017XXXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full bg-transparent outline-none text-[#1C1C1E] font-medium text-sm"
                    />
                  </div>
                </div>

                {/* Date */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Date</label>
                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-[#009282] transition-colors">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      required
                      className="w-full bg-transparent outline-none text-[#1C1C1E] font-medium text-sm cursor-pointer"
                    />
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Additional Notes</label>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-[#009282] transition-colors">
                    <textarea
                      placeholder="Enter any additional requests or notes..."
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      rows={2}
                      className="w-full bg-transparent outline-none text-[#1C1C1E] font-medium text-sm resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all shadow active:scale-95 cursor-pointer disabled:opacity-50"
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
