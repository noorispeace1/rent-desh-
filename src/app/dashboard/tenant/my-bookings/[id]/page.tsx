import React from 'react';
import Link from 'next/link';
import BookingModalButton from '@/component/dashboard/BookingModalButton';
import FavoriteButton from '@/component/dashboard/FavoriteButton';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

async function getProperty(id) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/property/${id}`, { cache: 'no-store' });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        console.error("Failed to fetch property:", error);
        return null;
    }
}

async function getFavoriteIds(userId) {
  if (!userId) return [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/favorites/ids/${userId}`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

export default async function PropertyDetailsPage({ params }) {
    const { id } = await params;
    const property = await getProperty(id);
    
    const session = await auth.api.getSession({
        headers: await headers()
    });
    const userId = session?.user?.id;
    const favoriteIds = await getFavoriteIds(userId);
    const initialIsFavorited = favoriteIds.includes(property?._id);

    if (!property) {
        return (
            <div className="min-h-[80vh] bg-[#F9FAFB] flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-3xl shadow-lg border border-[#E5E7EB] text-center max-w-md w-full">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                    </div>
                    <h1 className="text-2xl font-bold text-[#1C1C1E] mb-3">Property Not Found</h1>
                    <p className="text-[#6B7280] mb-8">The property you are looking for does not exist or has been removed from RentDesh.</p>
                    <Link href="/dashboard/tenant/my-bookings" className="block w-full bg-[#009282] text-white py-3.5 rounded-xl font-bold hover:bg-[#007A6C] transition-colors">
                        Go Back to Bookings
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F9FAFB] pb-20">
            {/* Property Hero Image */}
            <div className="w-full h-[40vh] sm:h-[50vh] lg:h-[60vh] bg-gray-200 relative rounded-2xl overflow-hidden shadow-sm">
                <img
                    src={property.imageUrl || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1200&auto=format&fit=crop"}
                    alt={property.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1E]/80 via-transparent to-[#1C1C1E]/40" />

                {/* Top Navigation Overlay */}
                <div className="absolute top-0 left-0 w-full p-4 sm:p-8 flex justify-between items-center z-10">
                    <Link href="/dashboard/tenant/my-bookings" className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white p-2.5 rounded-full transition-all border border-white/30">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    </Link>
                    <div className="relative w-12 h-12 flex items-center justify-center">
                        <FavoriteButton 
                            propertyId={property._id} 
                            initialIsFavorited={initialIsFavorited} 
                        />
                    </div>
                </div>

                {/* Hero Content */}
                <div className="absolute bottom-0 left-0 w-full p-6 sm:p-10 max-w-7xl mx-auto z-10">
                    <div className="inline-block px-4 py-1.5 mb-4 bg-[#009282] text-white text-[11px] font-extrabold rounded-full uppercase tracking-widest shadow-md">
                        {property.propertyType || "Property"}
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3 leading-tight tracking-tight">
                        {property.title || "Untitled Property"}
                    </h1>
                    <div className="flex items-center text-white/90 text-sm sm:text-base font-medium">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        {property.location || "Location not provided"}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto mt-8 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">

                    {/* Left Column: Details */}
                    <div className="space-y-6">

                        {/* Quick Stats */}
                        <div className="bg-white rounded-3xl shadow-sm border border-[#E5E7EB] p-8 flex flex-wrap gap-8 justify-between sm:justify-start">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500">
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                                </div>
                                <div>
                                    <p className="text-[12px] text-[#9CA3AF] font-bold uppercase tracking-wider">Bedrooms</p>
                                    <p className="text-2xl font-black text-[#1C1C1E]">{property.bedroom || 0}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500">
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                                </div>
                                <div>
                                    <p className="text-[12px] text-[#9CA3AF] font-bold uppercase tracking-wider">Bathrooms</p>
                                    <p className="text-2xl font-black text-[#1C1C1E]">{property.bathroom || 0}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500">
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
                                </div>
                                <div>
                                    <p className="text-[12px] text-[#9CA3AF] font-bold uppercase tracking-wider">Area</p>
                                    <p className="text-2xl font-black text-[#1C1C1E]">{property.propertySize || 0} <span className="text-sm font-semibold text-[#6B7280]">sqft</span></p>
                                </div>
                            </div>
                        </div>

                        {/* About Section */}
                        <div className="bg-white rounded-3xl shadow-sm border border-[#E5E7EB] p-8">
                            <h2 className="text-2xl font-extrabold text-[#1C1C1E] mb-5 tracking-tight">About This Property</h2>
                            <p className="text-[#4B5563] text-[15px] leading-loose whitespace-pre-wrap">
                                {property.description || "No detailed description provided by the owner. Please contact the owner for more information regarding this property."}
                            </p>
                        </div>

                        {/* Amenities Section */}
                        <div className="bg-white rounded-3xl shadow-sm border border-[#E5E7EB] p-8">
                            <h2 className="text-2xl font-extrabold text-[#1C1C1E] mb-8 tracking-tight">Amenities & Features</h2>

                            <div className="mb-8">
                                <h3 className="text-[12px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-5">Included Amenities</h3>
                                {property.amenities && property.amenities.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-5 gap-x-4">
                                        {property.amenities.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-3 text-[#1C1C1E] font-semibold text-[15px]">
                                                <div className="w-8 h-8 rounded-full bg-[#009282]/10 flex items-center justify-center shrink-0">
                                                    <svg className="w-4 h-4 text-[#009282]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                                                </div>
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-[#9CA3AF] italic">No standard amenities listed.</p>
                                )}
                            </div>

                            {property.extraFeatures && (
                                <div className="pt-8 border-t border-[#F3F4F6]">
                                    <h3 className="text-[12px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-5">Extra Features</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {property.extraFeatures.split(',').map((feature, idx) => (
                                            <span key={idx} className="px-4 py-2 bg-[#F3F4F6] border border-[#E5E7EB] text-[#374151] rounded-xl text-[14px] font-bold">
                                                {feature.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Right Column: Pricing & Apply */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl shadow-lg border border-[#E5E7EB] p-8 sticky top-28">
                            <div className="mb-8">
                                <p className="text-[13px] font-bold text-[#6B7280] uppercase tracking-widest mb-2">Rent Price</p>
                                <div className="flex items-end gap-2">
                                    <h2 className="text-4xl sm:text-5xl font-black text-[#1C1C1E] tracking-tight">৳{property.monthlyRent}</h2>
                                    <span className="text-[#6B7280] pb-1.5 font-medium">/ {property.rentType || "mo"}</span>
                                </div>
                            </div>

                            <div className="space-y-4 py-6 border-y border-[#F3F4F6] mb-8">
                                <div className="flex justify-between items-center text-[15px] text-[#4B5563]">
                                    <span>Security Deposit</span>
                                    <span className="font-bold text-[#1C1C1E]">Usually 1 Month</span>
                                </div>
                                <div className="flex justify-between items-center text-[15px] text-[#4B5563]">
                                    <span>Service Charge</span>
                                    <span className="font-bold text-[#1C1C1E]">Not Included</span>
                                </div>
                                <div className="flex justify-between items-center text-[15px] text-[#4B5563]">
                                    <span>Availability</span>
                                    <span className="font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Available Now</span>
                                </div>
                            </div>

                            <BookingModalButton 
                                propertyId={property._id} 
                                propertyTitle={property.title} 
                                monthlyRent={property.monthlyRent} 
                            />

                            <p className="text-center text-[13px] text-[#9CA3AF] mt-5 font-medium px-4">
                                You won't be charged yet. The owner will review your application before finalizing.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
