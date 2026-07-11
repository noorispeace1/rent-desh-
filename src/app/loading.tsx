"use client";

import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center min-h-[65vh] bg-transparent">
      <div className="relative flex items-center justify-center mb-8 mt-10">
        {/* Outer decorative pulsing ring */}
        <div className="absolute w-28 h-28 bg-[#009282]/20 rounded-full animate-ping"></div>
        {/* Inner static ring */}
        <div className="absolute w-20 h-20 bg-[#009282]/10 rounded-full"></div>
        
        {/* Inner spinning icon container */}
        <div className="relative bg-white p-4 rounded-full shadow-lg border border-gray-100 flex items-center justify-center z-10">
          <Loader2 className="w-10 h-10 text-[#009282] animate-spin" />
        </div>
      </div>
      
      <div className="text-center z-10 relative">
        <h2 className="text-2xl font-black text-[#1C1C1E] tracking-tight mb-2">RentDesh</h2>
        <p className="text-[15px] font-semibold text-[#6B7280] animate-pulse">Loading amazing spaces for you...</p>
      </div>
    </div>
  );
}
