"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import PropertiseFilter from '@/component/dashboard/owner/PropertiseFilter';
import FavoriteButton from '@/component/dashboard/FavoriteButton';
import Link from 'next/link';

function PropertiesContent() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [properties, setProperties] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Initial filters from URL query
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    propertyType: searchParams.get('propertyType') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    // Sync filters with URL updates if needed
    setFilters({
      location: searchParams.get('location') || '',
      propertyType: searchParams.get('propertyType') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
    });
    // Reset to page 1 when filters change
    setCurrentPage(1);
  }, [searchParams]);

  useEffect(() => {
    fetchData();
  }, [session]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch properties
      const propsRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/properties/public`);
      if (propsRes.ok) {
        const propsData = await propsRes.json();
        setProperties(propsData);
      }

      // Fetch user's favorite IDs if logged in
      if (session?.user?.id) {
        const favsRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/favorites/ids/${session.user.id}`);
        if (favsRes.ok) {
          const favsData = await favsRes.json();
          setFavoriteIds(favsData);
        }
      }
    } catch (error) {
      console.error("Failed to fetch data on properties page:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      location: '',
      propertyType: '',
      minPrice: '',
      maxPrice: '',
    });
    setCurrentPage(1);
  };

  // Filter properties logic
  const filteredProperties = properties.filter((property) => {
    const matchesLocation = !filters.location || 
      property.location?.toLowerCase().includes(filters.location.toLowerCase());
    
    const matchesType = !filters.propertyType || 
      property.propertyType?.toLowerCase() === filters.propertyType.toLowerCase();
    
    const matchesMinPrice = !filters.minPrice || 
      Number(property.monthlyRent) >= Number(filters.minPrice);
    
    const matchesMaxPrice = !filters.maxPrice || 
      Number(property.monthlyRent) <= Number(filters.maxPrice);

    return matchesLocation && matchesType && matchesMinPrice && matchesMaxPrice;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProperties.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handlePrevious = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };
  const handleNext = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#009282] to-[#00b8a4] animate-pulse shadow-lg mb-4" />
        <p className="text-[#9CA3AF] text-sm font-medium">Loading properties...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto p-4 sm:p-6 lg:p-8 flex-1">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1C1E] mb-2 tracking-tight">Available Properties</h1>
        <p className="text-[#6B7280] text-sm">Find and book your next dream space instantly.</p>
      </div>

      {/* Filter component */}
      <PropertiseFilter 
        onFilter={handleFilterChange} 
        onClear={handleClearFilters}
        initialFilters={filters}
      />

      {filteredProperties.length === 0 ? (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[#1C1C1E] mb-2">No matching properties</h3>
          <p className="text-[#6B7280] text-sm max-w-sm mb-4">Try refining or clearing your filters to see more listings.</p>
          <button 
            onClick={handleClearFilters}
            className="text-[#009282] font-semibold text-sm hover:underline"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {currentItems.map((property) => (
            <div key={property._id} className="group bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative">
              <div className="relative h-[240px] w-full bg-gray-100 overflow-hidden">
                {property.imageUrl ? (
                  <img 
                    src={property.imageUrl} 
                    alt={property.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-[#009282] px-3 py-1 rounded-full text-xs font-extrabold text-white shadow-sm uppercase tracking-wide">
                  {property.propertyType || "Property"}
                </div>
                
                {/* Favorite Toggle Button */}
                <FavoriteButton 
                  propertyId={property._id} 
                  initialIsFavorited={favoriteIds.includes(property._id)} 
                />
              </div>
              
              <div className="p-5">
                <div className="flex justify-between items-start mb-1.5">
                  <h3 className="text-lg font-bold text-[#1C1C1E] line-clamp-1 flex-1">{property.title || "Untitled Property"}</h3>
                  <span className="text-[#009282] font-bold shrink-0 ml-3">৳{property.monthlyRent}/mo</span>
                </div>
                <div className="flex items-center text-[#6B7280] text-sm mb-4">
                  <svg className="w-4 h-4 mr-1.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="line-clamp-1">{property.location || "Location not provided"}</span>
                </div>
                
                <div className="flex items-center gap-4 py-4 border-t border-[#F3F4F6]">
                  <div className="flex items-center gap-1.5 text-sm text-[#4B5563]">
                    <svg className="w-4 h-4 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="font-semibold">{property.bedroom || 0}</span> Beds
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-[#4B5563]">
                    <svg className="w-4 h-4 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span className="font-semibold">{property.bathroom || 0}</span> Baths
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-[#4B5563]">
                    <svg className="w-4 h-4 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
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

          {/* Pagination */}
          {totalPages > 0 && (
            <div className="flex items-center justify-center gap-1.5 py-6 mt-8 border-t border-[#E5E7EB]">
              <button 
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className="text-[14px] font-medium text-[#6B7280] hover:text-[#1C1C1E] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 mr-2 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7" /></svg>
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`min-w-[32px] h-[32px] px-2 flex items-center justify-center rounded-lg text-[14px] transition-all ${
                      currentPage === i + 1 
                        ? 'bg-[#009282] text-white font-bold shadow-sm' 
                        : 'text-[#6B7280] hover:bg-gray-100 font-medium'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button 
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="text-[14px] font-medium text-[#6B7280] hover:text-[#1C1C1E] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 ml-2 transition-colors"
              >
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#009282] to-[#00b8a4] animate-pulse shadow-lg mb-4" />
        <p className="text-[#9CA3AF] text-sm font-medium">Loading properties...</p>
      </div>
    }>
      <PropertiesContent />
    </Suspense>
  );
}
