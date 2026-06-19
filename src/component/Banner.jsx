"use client"; 
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap'; // Corrected Import
import { MapPin, Home, DollarSign, Search, ChevronDown } from 'lucide-react';

const Banner = () => {
    const router = useRouter();
    const [location, setLocation] = useState('');
    const [propertyType, setPropertyType] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const bannerRef = useRef(null);
    const bgRef = useRef(null);
    const headlineRef = useRef(null);
    const subheadRef = useRef(null);
    const searchRef = useRef(null);

    useEffect(() => {
        // gsap.context helps prevent animation bugs in React 18+ Strict Mode
        let ctx = gsap.context(() => {
            const tl = gsap.timeline();

            tl.fromTo(bgRef.current,
                { scale: 1.15, filter: 'blur(10px)' },
                { scale: 1, filter: 'blur(0px)', duration: 1.5, ease: "power2.out" }
            )
            .fromTo(headlineRef.current,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
                "-=0.8"
            )
            .fromTo(subheadRef.current,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
                "-=0.4" 
            )
            .fromTo(searchRef.current,
                { y: 40, opacity: 0, scale: 0.95 },
                { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.2)" },
                "-=0.3"
            );
        }, bannerRef);

        // Cleanup function
        return () => ctx.revert(); 
    }, []);

    return (
        <div ref={bannerRef} className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden">
                
                {/* Background Image */}
                <div 
                    ref={bgRef}
                    className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat scale-110"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop')" }}
                ></div>

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"></div>

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-7xl px-4 md:px-8 flex flex-col items-center text-center mt-10">
                
                {/* Headline */}
                <h1 ref={headlineRef} className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight drop-shadow-lg font-serif">
                    Find Your Perfect Space
                </h1>
                
                {/* Subheadline */}
                <p ref={subheadRef} className="text-lg md:text-xl text-gray-200 mb-12 max-w-2xl drop-shadow-md">
                    Book premium apartments, modern villas, and trusted commercial spaces across RentDesh.
                </p>

                {/* Glassmorphism Search Bar */}
                <div 
                    ref={searchRef}
                    className="w-full bg-white/10 backdrop-blur-md border border-white/20 p-4 md:p-5 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center gap-3 md:gap-4"
                >
                    {/* Location Input */}
                    <div className="flex w-full md:w-1/4 items-center bg-white rounded-2xl px-4 py-3.5 transition-all focus-within:ring-2 focus-within:ring-[#009282] focus-within:border-transparent">
                        <MapPin className="text-[#009282] w-5 h-5 mr-3" />
                        <input 
                            type="text" 
                            placeholder="Location" 
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400 font-medium text-sm md:text-base" 
                        />
                    </div>

                    {/* Property Type Dropdown */}
                    <div className="flex w-full md:w-1/4 items-center bg-white rounded-2xl px-4 py-3.5 relative transition-all focus-within:ring-2 focus-within:ring-[#009282] focus-within:border-transparent">
                        <Home className="text-[#009282] w-5 h-5 mr-3" />
                        <select 
                            value={propertyType}
                            onChange={(e) => setPropertyType(e.target.value)}
                            className="w-full bg-transparent outline-none text-gray-800 cursor-pointer appearance-none font-medium text-sm md:text-base pr-8"
                        >
                            <option value="">Property Type</option>
                            <option value="apartment">Apartment</option>
                            <option value="house">House</option>
                            <option value="commercial">Commercial</option>
                            <option value="studio">Studio</option>
                        </select>
                        <ChevronDown className="absolute right-4 text-gray-400 w-4 h-4 pointer-events-none" />
                    </div>

                    {/* Min Price */}
                    <div className="flex w-full md:w-[15%] items-center bg-white rounded-2xl px-4 py-3.5 transition-all focus-within:ring-2 focus-within:ring-[#009282] focus-within:border-transparent">
                        <DollarSign className="text-[#009282] w-5 h-5 mr-1" />
                        <input 
                            type="number" 
                            placeholder="Min Price" 
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400 font-medium text-sm md:text-base" 
                        />
                    </div>

                    {/* Max Price */}
                    <div className="flex w-full md:w-[15%] items-center bg-white rounded-2xl px-4 py-3.5 transition-all focus-within:ring-2 focus-within:ring-[#009282] focus-within:border-transparent">
                        <DollarSign className="text-[#009282] w-5 h-5 mr-1" />
                        <input 
                            type="number" 
                            placeholder="Max Price" 
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400 font-medium text-sm md:text-base" 
                        />
                    </div>

                    {/* Search Button */}
                    <button 
                        onClick={() => {
                            const params = new URLSearchParams();
                            if (location) params.set('location', location);
                            if (propertyType) params.set('propertyType', propertyType);
                            if (minPrice) params.set('minPrice', minPrice);
                            if (maxPrice) params.set('maxPrice', maxPrice);
                            router.push(`/properties?${params.toString()}`);
                        }}
                        className="w-full md:w-auto flex-1 bg-gradient-to-r from-[#009282] to-[#00a896] text-white rounded-2xl px-6 py-3.5 flex items-center justify-center font-bold transition-all shadow-[0_4px_12px_rgba(0,146,130,0.3)] hover:shadow-[0_6px_16px_rgba(0,146,130,0.4)] active:scale-[0.98] text-sm md:text-base"
                    >
                        <Search className="w-5 h-5 mr-2" />
                        Search
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Banner;