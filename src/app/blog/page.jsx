"use client";

import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, Home, Map } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: "Top 10 Tips for Finding the Perfect Rental Home in Dhaka",
    excerpt: "Navigate the bustling real estate market of Dhaka with our comprehensive guide to finding a secure and comfortable home.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop",
    category: "Home",
    date: "June 15, 2026",
    readTime: "5 min read",
    icon: Home
  },
  {
    id: 2,
    title: "A Guide to Exploring Sylhet's Tea Gardens",
    excerpt: "Planning a long-term stay in Sylhet? Discover the most serene neighborhoods and the best tea gardens to visit on weekends.",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800&auto=format&fit=crop",
    category: "Tour",
    date: "June 12, 2026",
    readTime: "7 min read",
    icon: Map
  },
  {
    id: 3,
    title: "How to Decorate Your Rental Apartment on a Budget",
    excerpt: "Transform your rented space into a personal sanctuary without breaking the bank or violating your lease agreement.",
    image: "https://images.unsplash.com/photo-1502672260266-1c1c24240f38?q=80&w=800&auto=format&fit=crop",
    category: "Home",
    date: "June 08, 2026",
    readTime: "4 min read",
    icon: Home
  },
  {
    id: 4,
    title: "Cox's Bazar: Best Neighborhoods for Long-term Stays",
    excerpt: "Looking for a beachside rental? Here are the most convenient and beautiful areas to rent a property in Cox's Bazar.",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop",
    category: "Tour",
    date: "June 05, 2026",
    readTime: "6 min read",
    icon: Map
  },
  {
    id: 5,
    title: "Understanding Rental Agreements in Bangladesh",
    excerpt: "A must-read guide for every tenant. Learn about your rights, security deposits, and what to look for before signing a lease.",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop",
    category: "Home",
    date: "June 01, 2026",
    readTime: "8 min read",
    icon: Home
  },
  {
    id: 6,
    title: "Chittagong City Guide: Where to Live and What to See",
    excerpt: "From the bustling port area to the peaceful hills of Khagrachari nearby, find out where you should rent your next home.",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop",
    category: "Tour",
    date: "May 28, 2026",
    readTime: "5 min read",
    icon: Map
  }
];

export const exportedBlogPosts = blogPosts;

export default function BlogPage() {
  return (
    <div className="bg-[#F9FAFB] min-h-screen pb-24">
      {/* Hero Section */}
      <section className="relative bg-[#009282] py-24 sm:py-32 overflow-hidden shadow-inner">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white opacity-5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white opacity-5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3 animate-pulse"></div>
        
        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center animate-in slide-in-from-bottom-8 fade-in duration-1000">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight drop-shadow-md">
            RentDesh <span className="text-[#A7F3EB]">Blog & Guides</span>
          </h1>
          <p className="text-lg sm:text-xl text-[#E0F5F3] max-w-2xl mx-auto font-medium">
            Discover expert tips for renting, moving guides, and explore the beautiful cities of Bangladesh before your next stay.
          </p>
        </div>
      </section>

      {/* Main Blog Grid Section */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => {
            const CategoryIcon = post.icon;
            
            return (
              <div 
                key={post.id} 
                className={`bg-white rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col group border border-[#E5E7EB] animate-in slide-in-from-bottom-12 fade-in fill-mode-both`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Image Wrapper */}
                <div className="relative h-60 overflow-hidden cursor-pointer">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider backdrop-blur-md shadow-sm border border-white/20 ${
                      post.category === 'Home' 
                        ? 'bg-[#009282]/90 text-white' 
                        : 'bg-orange-500/90 text-white'
                    }`}>
                      <CategoryIcon className="w-3.5 h-3.5" />
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-xs font-semibold text-[#6B7280] mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[#009282]" />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#009282]" />
                      {post.readTime}
                    </div>
                  </div>

                  <Link href={`/blog/${post.id}`}>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#1C1C1E] mb-3 leading-snug group-hover:text-[#009282] transition-colors cursor-pointer">
                      {post.title}
                    </h3>
                  </Link>
                  
                  <p className="text-[#4B5563] text-sm mb-6 flex-grow leading-relaxed">
                    {post.excerpt}
                  </p>

                  <Link 
                    href={`/blog/${post.id}`}
                    className="inline-flex items-center gap-2 text-[#009282] font-black text-sm hover:text-[#007A6C] transition-colors group/btn mt-auto w-fit"
                  >
                    Read Full Article
                    <div className="bg-[#E0F5F3] p-1.5 rounded-full group-hover/btn:bg-[#009282] group-hover/btn:text-white transition-colors">
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Load More Button */}
        <div className="mt-16 text-center animate-in fade-in duration-1000 delay-1000 fill-mode-both">
          <button className="bg-white border-2 border-[#009282] text-[#009282] hover:bg-[#009282] hover:text-white px-8 py-3.5 rounded-full font-bold transition-all shadow-sm hover:shadow-lg hover:-translate-y-1">
            Load More Articles
          </button>
        </div>
      </section>
    </div>
  );
}
