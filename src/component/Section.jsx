"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, MapPin, ShieldCheck, Star, ArrowRight, Award } from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const stats = [
  { id: 1, name: 'Active Properties', value: '2,500+', icon: Building2 },
  { id: 2, name: 'Happy Tenants', value: '10,000+', icon: Users },
  { id: 3, name: 'Cities Covered', value: '15+', icon: MapPin },
  { id: 4, name: 'Trusted Owners', value: '500+', icon: ShieldCheck },
];

const locations = [
  {
    id: 1,
    name: 'Dhaka',
    properties: '1,240 Properties',
    image: '/locations/dhaka.png',
  },
  {
    id: 2,
    name: 'Chittagong',
    properties: '850 Properties',
    image: '/locations/chittagong.png',
  },
  {
    id: 3,
    name: 'Sylhet',
    properties: '420 Properties',
    image: '/locations/sylhet.png',
  },
  {
    id: 4,
    name: "Cox's Bazar",
    properties: '310 Properties',
    image: '/locations/coxs_bazar.png',
  },
];

const trustedOwners = [
  {
    id: 1,
    name: 'Abdur Rahman',
    role: 'Premium Owner',
    rating: 4.9,
    reviews: 124,
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: 2,
    name: 'Farhana Islam',
    role: 'Verified Owner',
    rating: 4.8,
    reviews: 98,
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: 3,
    name: 'Kamrul Hasan',
    role: 'Premium Owner',
    rating: 5.0,
    reviews: 156,
    image: 'https://randomuser.me/api/portraits/men/86.jpg',
  },
];

export default function ExtraSections() {
  const [dynamicReviews, setDynamicReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/reviews`);
        if (res.ok) {
          const data = await res.json();
          setDynamicReviews(data);
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div className="w-full flex flex-col gap-24 py-16">
      
      {/* 1. Rental Statistics Section */}
      <motion.section 
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mt-12"
      >
        <div className="bg-[#0B1A18] rounded-[32px] overflow-hidden shadow-2xl relative">
          {/* Subtle glowing orb backgrounds */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#009282] opacity-20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#009282] opacity-15 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>
          
          <div className="relative z-10 py-20 px-8 sm:px-16">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 mb-5 bg-white/10 text-[#A7F3EB] text-[11px] font-bold uppercase tracking-widest rounded-full backdrop-blur-md border border-white/10">Why Choose RentDesh</span>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-5 tracking-tight">Trust by the Numbers</h2>
              <p className="text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">Connecting thousands of verified tenants with trusted property owners across Bangladesh. Your reliable partner in modern living.</p>
            </div>
            
            <motion.div variants={staggerContainer} className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 text-center">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <motion.div variants={fadeIn} key={stat.id} className="flex flex-col items-center group bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] p-8 rounded-[24px] transition-all duration-300">
                    <div className="w-14 h-14 bg-[#009282]/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md group-hover:scale-110 group-hover:bg-[#009282]/40 transition-all duration-500">
                      <Icon className="w-7 h-7 text-[#A7F3EB]" />
                    </div>
                    <div className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">{stat.value}</div>
                    <div className="text-gray-400 font-semibold tracking-wider uppercase text-xs">{stat.name}</div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* 2. Top Locations Section */}
      <motion.section 
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mt-10"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="inline-block text-[#009282] font-bold uppercase tracking-widest text-xs mb-3">Popular Destinations</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#1C1C1E] mb-3 tracking-tight">Explore Top Locations</h2>
            <p className="text-[#6B7280] text-[15px] max-w-2xl leading-relaxed">Find your perfect home in Bangladesh's most vibrant cities. Handpicked neighborhoods curated just for you.</p>
          </div>
          <button className="flex items-center gap-2 text-[#009282] font-bold hover:text-[#007A6C] transition-colors group whitespace-nowrap bg-emerald-50 px-6 py-3 rounded-xl hover:bg-emerald-100">
            View All Locations
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {locations.map((location) => (
            <motion.div variants={fadeIn}
              key={location.id} 
              className="group relative h-[420px] rounded-[24px] overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500"
            >
              <img 
                src={location.image} 
                alt={location.name} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1500ms] ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A18]/90 via-[#0A1A18]/20 to-transparent"></div>
              
              <div className="absolute top-6 left-6">
                <div className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-sm">
                  {location.properties}
                </div>
              </div>

              <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col justify-end">
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:-translate-y-1 transition-transform duration-500">{location.name}</h3>
                
                <div className="opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100 flex items-center gap-2 text-[#A7F3EB] font-bold text-sm">
                  Explore City <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* 3. Trusted Owners Section */}
      <motion.section 
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mt-10"
      >
        <div className="text-center mb-16">
          <span className="inline-block text-[#009282] font-bold uppercase tracking-widest text-xs mb-3">Community First</span>
          <h2 className="text-3xl md:text-4xl font-black text-[#1C1C1E] mb-4 tracking-tight">Meet Our Trusted Owners</h2>
          <p className="text-[#6B7280] text-[15px] max-w-2xl mx-auto leading-relaxed">Rent with absolute confidence. Our top-rated property owners provide exceptional service and seamless living experiences.</p>
        </div>

        <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trustedOwners.map((owner) => (
            <motion.div variants={fadeIn}
              key={owner.id} 
              className="bg-white rounded-[32px] p-8 border border-gray-100 hover:border-[#009282]/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 text-center group"
            >
              <div className="relative mb-6">
                <div className="w-28 h-28 mx-auto rounded-full p-1.5 bg-gradient-to-b from-[#009282]/20 to-transparent group-hover:from-[#009282]/40 transition-colors duration-500">
                  <img 
                    src={owner.image} 
                    alt={owner.name} 
                    className="w-full h-full rounded-full object-cover border-2 border-white shadow-sm"
                  />
                </div>
                <div className="absolute bottom-1 right-[calc(50%-2.5rem)] w-8 h-8 bg-white rounded-full p-1 shadow-md">
                  <div className="w-full h-full bg-[#009282] rounded-full flex items-center justify-center">
                    <ShieldCheck className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
              </div>
              
              <h3 className="text-xl font-black text-[#1C1C1E] mb-2">{owner.name}</h3>
              <div className="flex justify-center items-center gap-1.5 mb-6">
                <Award className="w-4 h-4 text-[#009282]" />
                <span className="text-xs font-bold text-[#009282] uppercase tracking-widest">{owner.role}</span>
              </div>
              
              <div className="flex items-center justify-center gap-4 bg-gray-50/80 py-3.5 px-6 rounded-2xl mx-auto border border-gray-100 w-max">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-bold text-[#1C1C1E]">{owner.rating}</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                <div className="text-sm text-[#6B7280]">
                  <span className="font-bold text-[#1C1C1E]">{owner.reviews}</span> Reviews
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* 4. Customer Reviews Section (Dynamic) */}
      {dynamicReviews.length > 0 && (
        <motion.section 
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mt-10 mb-10"
        >
          <div className="text-center mb-16">
            <span className="inline-block text-[#009282] font-bold uppercase tracking-widest text-xs mb-3">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#1C1C1E] mb-4 tracking-tight">What Our Tenants Say</h2>
            <p className="text-[#6B7280] text-[15px] max-w-2xl mx-auto leading-relaxed">Real experiences from verified tenants. Discover why thousands choose RentDesh for their home search.</p>
          </div>

          <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dynamicReviews.map((review) => (
              <motion.div variants={fadeIn}
                key={review._id} 
                className="bg-white rounded-[32px] p-8 sm:p-10 border border-gray-100 shadow-[0_2px_15px_rgb(0,0,0,0.02)] hover:shadow-[0_15px_40px_rgb(0,0,0,0.06)] transition-all duration-300 relative flex flex-col h-full group"
              >
                {/* Minimalist Quote Mark */}
                <div className="absolute top-8 right-8 text-gray-100 group-hover:text-emerald-50 transition-colors duration-300">
                  <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>

                <div className="flex items-center gap-1 mb-8 relative z-10">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} 
                    />
                  ))}
                </div>

                <p className="text-[#4B5563] text-[15px] leading-loose flex-grow mb-10 relative z-10">
                  "{review.reviewText}"
                </p>

                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 rounded-full bg-[#009282]/10 flex items-center justify-center text-[#009282] font-black text-lg flex-shrink-0">
                    {review.userName ? review.userName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1C1C1E] text-sm">{review.userName || 'Anonymous'}</h4>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-1">{review.propertyTitle}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      )}

    </div>
  );
}
