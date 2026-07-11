"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import FavoriteButton from "@/component/dashboard/FavoriteButton";

export default function FavoritesPage() {
  const { data: session, isPending: sessionLoading } = useSession();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionLoading && session?.user?.id) {
      fetchFavorites(session.user.id);
    } else if (!sessionLoading && !session) {
      setLoading(false);
    }
  }, [session, sessionLoading]);

  const fetchFavorites = async (userId) => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/favorites/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setFavorites(data);
      }
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = (propertyId, isFavorited) => {
    // If it was unfavorited, remove it from the page list
    if (!isFavorited) {
      setFavorites((prev) => prev.filter((p) => p._id !== propertyId));
    }
  };

  if (sessionLoading || loading) {
    return (
      <div className="w-full max-w-[1200px] mx-auto p-4 sm:p-6 lg:p-8 min-h-[60vh] flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#009282] to-[#00b8a4] animate-pulse shadow-lg" />
          <p className="text-[#9CA3AF] text-sm font-medium">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="w-full max-w-[1200px] mx-auto p-4 sm:p-6 lg:p-8 min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#009282] to-[#00b8a4] flex items-center justify-center mx-auto mb-5 shadow-lg">
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[#1C1C1E] mb-2">Access Restricted</h2>
          <p className="text-[#6B7280] text-sm mb-6">Please sign in to view your favorite properties.</p>
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
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1C1E] mb-2 tracking-tight">My Favorites</h1>
          <p className="text-[#6B7280] text-sm">View and manage all your saved rental properties.</p>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[#1C1C1E] mb-2">No favorite properties</h3>
          <p className="text-[#6B7280] text-sm max-w-sm mb-6">You haven't saved any properties to favorites yet. Explore our listings to find something you love.</p>
          <Link 
            href="/dashboard/tenant/my-bookings"
            className="text-[#009282] font-semibold text-sm hover:underline"
          >
            Explore Properties
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {favorites.map((property) => (
            <div key={property._id} className="group bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="relative h-[240px] w-full bg-gray-100 overflow-hidden">
                {property.imageUrl ? (
                  <img 
                    src={property.imageUrl} 
                    alt={property.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-[#009282] px-3 py-1 rounded-full text-xs font-extrabold text-white shadow-sm uppercase tracking-wide">
                  {property.propertyType || "Property"}
                </div>
                <FavoriteButton 
                  propertyId={property._id} 
                  initialIsFavorited={true}
                  onToggle={handleToggleFavorite}
                />
              </div>
              
              <div className="p-5">
                <div className="flex justify-between items-start mb-1.5">
                  <h3 className="text-lg font-bold text-[#1C1C1E] line-clamp-1 flex-1">{property.title || "Untitled Property"}</h3>
                  <span className="text-[#009282] font-bold shrink-0 ml-3">৳{property.monthlyRent}/mo</span>
                </div>
                <div className="flex items-center text-[#6B7280] text-sm mb-4">
                  <svg className="w-4 h-4 mr-1.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  <span className="line-clamp-1">{property.location || "Location not provided"}</span>
                </div>
                
                <div className="flex items-center gap-4 py-4 border-t border-[#F3F4F6]">
                  <div className="flex items-center gap-1.5 text-sm text-[#4B5563]">
                    <svg className="w-4 h-4 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                    <span className="font-semibold">{property.bedroom || 0}</span> Beds
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-[#4B5563]">
                    <svg className="w-4 h-4 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                    <span className="font-semibold">{property.bathroom || 0}</span> Baths
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-[#4B5563]">
                    <svg className="w-4 h-4 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
                    <span className="font-semibold">{property.propertySize || 0}</span> sqft
                  </div>
                </div>

                <div className="mt-2">
                  <Link 
                    href={`/dashboard/tenant/my-bookings/${property._id}`}
                    className="w-full block text-center bg-[#009282] hover:bg-[#007A6C] text-white py-2.5 rounded-xl text-[14px] font-bold transition-all shadow-sm hover:shadow-md"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
