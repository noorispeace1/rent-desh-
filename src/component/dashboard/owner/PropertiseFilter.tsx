"use client";

import React, { useState, useEffect } from 'react';
import { MapPin, Home, DollarSign, Search, X } from 'lucide-react';

export default function PropertiseFilter({ onFilter, onClear, initialFilters = {} }) {
  const [location, setLocation] = useState(initialFilters.location || '');
  const [propertyType, setPropertyType] = useState(initialFilters.propertyType || '');
  const [minPrice, setMinPrice] = useState(initialFilters.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice || '');

  // Update filter values if initialFilters change (e.g. from URL params)
  useEffect(() => {
    if (initialFilters.location !== undefined) setLocation(initialFilters.location);
    if (initialFilters.propertyType !== undefined) setPropertyType(initialFilters.propertyType);
    if (initialFilters.minPrice !== undefined) setMinPrice(initialFilters.minPrice);
    if (initialFilters.maxPrice !== undefined) setMaxPrice(initialFilters.maxPrice);
  }, [initialFilters]);

  const handleSearch = (e) => {
    e.preventDefault();
    onFilter({ location, propertyType, minPrice, maxPrice });
  };

  const handleClear = () => {
    setLocation('');
    setPropertyType('');
    setMinPrice('');
    maxPrice && setMaxPrice('');
    if (onClear) onClear();
  };

  const hasActiveFilters = location || propertyType || minPrice || maxPrice;

  return (
    <form 
      onSubmit={handleSearch}
      className="w-full bg-white border border-[#E5E7EB] p-4 rounded-2xl shadow-sm flex flex-col lg:flex-row items-center gap-3 mb-8"
    >
      {/* Location Input */}
      <div className="flex w-full lg:flex-1 items-center bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-[#009282]/30 focus-within:border-[#009282] transition-all">
        <MapPin className="text-gray-400 w-4 h-4 mr-2 shrink-0" />
        <input 
          type="text" 
          placeholder="Search Location..." 
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full bg-transparent outline-none text-[#1C1C1E] placeholder-gray-400 font-medium text-[13.5px]" 
        />
      </div>

      {/* Property Type Dropdown */}
      <div className="flex w-full lg:w-1/4 items-center bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-[#009282]/30 focus-within:border-[#009282] transition-all relative">
        <Home className="text-gray-400 w-4 h-4 mr-2 shrink-0" />
        <select 
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
          className="w-full bg-transparent outline-none text-[#1C1C1E] cursor-pointer appearance-none font-medium text-[13.5px] pr-6"
        >
          <option value="">Property Type (All)</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="commercial">Commercial</option>
          <option value="studio">Studio</option>
        </select>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▼</span>
      </div>

      {/* Min Price */}
      <div className="flex w-full lg:w-[15%] items-center bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-[#009282]/30 focus-within:border-[#009282] transition-all">
        <DollarSign className="text-gray-400 w-4 h-4 mr-0.5 shrink-0" />
        <input 
          type="number" 
          placeholder="Min Price" 
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="w-full bg-transparent outline-none text-[#1C1C1E] placeholder-gray-400 font-medium text-[13.5px]" 
        />
      </div>

      {/* Max Price */}
      <div className="flex w-full lg:w-[15%] items-center bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-[#009282]/30 focus-within:border-[#009282] transition-all">
        <DollarSign className="text-gray-400 w-4 h-4 mr-0.5 shrink-0" />
        <input 
          type="number" 
          placeholder="Max Price" 
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-full bg-transparent outline-none text-[#1C1C1E] placeholder-gray-400 font-medium text-[13.5px]" 
        />
      </div>

      {/* Action Buttons */}
      <div className="flex w-full lg:w-auto items-center gap-2">
        <button 
          type="submit" 
          className="flex-1 lg:flex-none bg-[#009282] hover:bg-[#007A6C] text-white rounded-xl px-5 py-2.5 flex items-center justify-center font-bold transition-all shadow-sm hover:shadow-md active:scale-95 text-[13.5px]"
        >
          <Search className="w-4 h-4 mr-1.5" />
          Search
        </button>
        {hasActiveFilters && (
          <button 
            type="button"
            onClick={handleClear}
            className="bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl p-2.5 flex items-center justify-center transition-all active:scale-95"
            title="Clear filters"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </form>
  );
}
