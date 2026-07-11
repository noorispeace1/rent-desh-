"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import { toast } from 'react-toastify';
import { fetchUserBookings } from '@/lib/actions/booking';

export default function ReviewPage() {
  const { data: session, isPending: sessionLoading } = useSession();
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

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
      const bookingsData = await fetchUserBookings(email);
      // Fetch reviews by tenant
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/reviews/tenant/${email}`);
      const reviewsData = await res.json();
      
      // Filter out duplicate properties so they only review a property once
      const uniqueProperties = [];
      const filteredBookings = [];
      bookingsData.forEach(booking => {
        if (!uniqueProperties.includes(booking.propertyId)) {
          uniqueProperties.push(booking.propertyId);
          filteredBookings.push(booking);
        }
      });

      setBookings(filteredBookings);
      setReviews(reviewsData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReviewModal = (booking) => {
    setSelectedBooking(booking);
    setRating(5);
    setReviewText('');
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!reviewText.trim()) {
      toast.error("Please enter a review.");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: selectedBooking.propertyId,
          propertyTitle: selectedBooking.propertyTitle,
          userName: session.user.name,
          email: session.user.email,
          rating,
          reviewText
        })
      });

      if (res.ok) {
        toast.success("Review submitted successfully!");
        setIsReviewModalOpen(false);
        fetchData(session.user.email); // Refresh reviews
      } else {
        toast.error("Failed to submit review.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Error submitting review.");
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
      <div className="w-full max-w-[1200px] mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <p className="text-gray-500">Please sign in to view your reviews.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1C1E] mb-2 tracking-tight">Property Reviews</h1>
        <p className="text-[#6B7280] text-sm">Leave feedback on properties you have rented or booked.</p>
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl shadow-[#009282]/5 border border-[#E5E7EB] overflow-hidden">
        {bookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14px]">
              <thead className="bg-[#F9FAFB] text-[#4B5563] font-bold text-[11px] uppercase tracking-widest border-b border-[#E5E7EB]">
                <tr>
                  <th className="py-5 px-6 whitespace-nowrap">Property</th>
                  <th className="py-5 px-6 whitespace-nowrap">Booking Date</th>
                  <th className="py-5 px-6 whitespace-nowrap">Status</th>
                  <th className="py-5 px-6 whitespace-nowrap">My Review</th>
                  <th className="py-5 px-6 whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6]">
                {bookings.map((booking) => {
                  const review = reviews.find(r => r.propertyId === booking.propertyId);
                  
                  return (
                    <tr key={booking._id} className="hover:bg-[#F0FBF9] transition-colors">
                      <td className="py-5 px-6">
                        <span className="font-bold text-[#1C1C1E] text-sm tracking-tight whitespace-nowrap">
                          {booking.propertyTitle || 'N/A'}
                        </span>
                      </td>
                      <td className="py-5 px-6">
                        <span className="text-[#4B5563] font-semibold text-sm whitespace-nowrap">
                          {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : 'N/A'}
                        </span>
                      </td>
                      <td className="py-5 px-6">
                        <span 
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border whitespace-nowrap ${
                            review 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                              : 'bg-orange-50 text-orange-700 border-orange-200'
                          }`}
                        >
                          {review ? 'Reviewed' : 'Pending Review'}
                        </span>
                      </td>
                      <td className="py-5 px-6">
                        {review ? (
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1 text-yellow-400 mb-1">
                              {[...Array(5)].map((_, i) => (
                                <svg key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-xs text-gray-500 truncate max-w-[150px]" title={review.reviewText}>{review.reviewText}</span>
                          </div>
                        ) : (
                          <span className="text-[#9CA3AF] text-sm italic">No review yet</span>
                        )}
                      </td>
                      <td className="py-5 px-6 text-right">
                        {!review ? (
                          <button 
                            onClick={() => handleOpenReviewModal(booking)}
                            className="bg-[#009282] hover:bg-[#007A6C] text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 whitespace-nowrap"
                          >
                            Write Review
                          </button>
                        ) : (
                          <button 
                            disabled
                            className="bg-gray-100 text-gray-400 px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap cursor-not-allowed border border-gray-200"
                          >
                            Completed
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 flex flex-col items-center justify-center text-center">
             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100 shadow-sm">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No bookings found</h3>
            <p className="text-gray-500 text-sm">You haven't booked any properties yet to review.</p>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {isReviewModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1C1E]/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-[#E5E7EB]">
            <div className="p-6 border-b border-[#F3F4F6] flex justify-between items-center bg-[#F9FAFB]">
              <h3 className="font-bold text-lg text-[#1C1C1E]">Write a Review</h3>
              <button 
                onClick={() => setIsReviewModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors border border-gray-200 shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="bg-[#F0FBF9] border border-[#009282]/20 p-4 rounded-2xl flex gap-4 items-center">
                <div className="w-12 h-12 bg-[#009282]/10 rounded-xl flex items-center justify-center shrink-0">
                   <svg className="w-6 h-6 text-[#009282]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#009282] uppercase tracking-wider mb-0.5">Property</p>
                  <p className="font-bold text-[#1C1C1E]">{selectedBooking.propertyTitle}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-bold text-[#4B5563] mb-3">Your Rating</p>
                <div className="flex gap-2 justify-center py-2 bg-gray-50 rounded-2xl border border-gray-100">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="focus:outline-none transition-all hover:scale-110 active:scale-95"
                    >
                      <svg 
                        className={`w-10 h-10 ${rating >= star ? 'text-yellow-400 fill-current drop-shadow-sm' : 'text-gray-200'} transition-colors`} 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-[#4B5563] mb-3 block">Your Review</label>
                <textarea 
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience with this property. What did you like? What could be improved?"
                  className="w-full border-2 border-[#E5E7EB] rounded-2xl p-4 text-sm focus:outline-none focus:ring-4 focus:ring-[#009282]/10 focus:border-[#009282] transition-all min-h-[140px] resize-none text-[#1C1C1E]"
                ></textarea>
              </div>
            </div>

            <div className="p-6 bg-[#F9FAFB] flex justify-end gap-3 border-t border-[#F3F4F6]">
              <button 
                onClick={() => setIsReviewModalOpen(false)}
                className="px-6 py-3 rounded-xl font-bold text-[#4B5563] hover:bg-gray-200 transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmitReview}
                className="px-6 py-3 bg-[#009282] hover:bg-[#007A6C] hover:-translate-y-0.5 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg text-sm flex items-center gap-2"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
