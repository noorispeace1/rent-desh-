"use client";

import React, { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Share2, Bookmark, Home, Map } from 'lucide-react';
import { exportedBlogPosts } from '../page';

export default function BlogPost({ params }) {
  // Extract id from params
  const unwrappedParams = use(params);
  const postId = parseInt(unwrappedParams.id);
  
  const post = exportedBlogPosts.find(p => p.id === postId);

  if (!post) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#F9FAFB]">
        <h1 className="text-4xl font-black text-[#1C1C1E] mb-4">Article Not Found</h1>
        <p className="text-gray-500 mb-8">The blog post you're looking for doesn't exist.</p>
        <Link href="/blog" className="bg-[#009282] text-white px-6 py-3 rounded-full font-bold hover:bg-[#007A6C] transition-all shadow-md">
          Return to Blog
        </Link>
      </div>
    );
  }

  const CategoryIcon = post.icon || (post.category === 'Home' ? Home : Map);

  return (
    <div className="bg-[#F9FAFB] min-h-screen pb-24">
      {/* Blog Post Header Image */}
      <div className="relative w-full h-[50vh] sm:h-[60vh] bg-gray-900">
        <img 
          src={post.image} 
          alt={post.title} 
          className="absolute inset-0 w-full h-full object-cover opacity-60 animate-in fade-in duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1E] via-[#1C1C1E]/40 to-transparent"></div>
        
        {/* Header Content */}
        <div className="absolute bottom-0 left-0 w-full p-6 sm:p-12 lg:p-16 max-w-[1000px] mx-auto right-0">
          <Link href="/blog" className="inline-flex items-center gap-2 text-white/80 hover:text-white font-semibold mb-6 transition-colors text-sm backdrop-blur-md bg-black/20 px-5 py-2.5 rounded-full border border-white/10 hover:bg-black/40">
            <ArrowLeft className="w-4 h-4" /> Back to all articles
          </Link>
          
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm font-bold text-white/90 mb-5 animate-in slide-in-from-bottom-4 fade-in duration-700">
            <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider backdrop-blur-md border border-white/20 shadow-lg ${
                post.category === 'Home' 
                  ? 'bg-[#009282]/90' 
                  : 'bg-orange-500/90'
              }`}>
              <CategoryIcon className="w-3.5 h-3.5" />
              {post.category}
            </span>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#A7F3EB]" />
              {post.date}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#A7F3EB]" />
              {post.readTime}
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight text-balance animate-in slide-in-from-bottom-8 fade-in duration-1000">
            {post.title}
          </h1>
        </div>
      </div>

      {/* Blog Post Body */}
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 mt-12 flex flex-col lg:flex-row gap-8 lg:gap-12 relative z-10">
        
        {/* Sidebar Actions (Desktop) */}
        <div className="hidden lg:flex flex-col gap-4 sticky top-32 h-fit">
          <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all text-gray-500 hover:text-[#009282] border border-gray-100">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all text-gray-500 hover:text-[#009282] border border-gray-100">
            <Bookmark className="w-5 h-5" />
          </button>
        </div>

        {/* Article Content */}
        <article className="flex-1 bg-white rounded-[2rem] shadow-xl p-6 sm:p-10 lg:p-14 border border-[#E5E7EB] prose prose-lg prose-emerald max-w-none animate-in slide-in-from-bottom-12 fade-in duration-1000">
          <p className="text-xl sm:text-2xl text-gray-700 font-medium leading-relaxed mb-10 border-l-4 border-[#009282] pl-6 py-2 bg-[#F0FBF9] rounded-r-2xl">
            {post.excerpt}
          </p>

          <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1C1E] mt-10 mb-6">Introduction to {post.category} Experiences</h2>
          <p className="text-[#4B5563] leading-loose mb-6">
            Whether you are looking for the perfect long-term rental or planning an extended stay in a beautiful location, finding the right property requires research, patience, and a bit of insider knowledge. Our RentDesh guides are crafted to ensure that your next move is as seamless and stress-free as possible.
          </p>
          <p className="text-[#4B5563] leading-loose mb-10">
            This article explores the specific nuances of {post.title.toLowerCase()}, highlighting the critical factors you need to consider before making a commitment. From local neighborhood vibes to standard lease terms, we cover everything you need to feel confident in your choice.
          </p>

          <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1C1E] mt-10 mb-6">Key Things to Consider</h2>
          <ul className="space-y-6 mb-10">
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#009282]/10 flex items-center justify-center mt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#009282]"></span>
              </span>
              <span className="text-[#4B5563] leading-relaxed text-lg"><strong>Location & Accessibility:</strong> Ensure your rental is close to essential services like hospitals, supermarkets, and public transport hubs. Being in the right neighborhood drastically changes your living experience.</span>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#009282]/10 flex items-center justify-center mt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#009282]"></span>
              </span>
              <span className="text-[#4B5563] leading-relaxed text-lg"><strong>Budget & Hidden Costs:</strong> Look beyond the monthly rent. Factor in utility bills, maintenance charges, and standard deposit requirements to avoid any financial surprises.</span>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#009282]/10 flex items-center justify-center mt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#009282]"></span>
              </span>
              <span className="text-[#4B5563] leading-relaxed text-lg"><strong>Property Condition:</strong> Always inspect the property thoroughly or rely on verified "Trusted Owners" with high review ratings. Always ask questions before signing the lease!</span>
            </li>
          </ul>

          <div className="my-14 relative group overflow-hidden rounded-[2rem] shadow-lg">
            <img 
              src={post.image} 
              alt="Decorative blog image" 
              className="w-full h-[400px] sm:h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 border border-black/5 rounded-[2rem] pointer-events-none"></div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1C1E] mt-10 mb-6">Final Thoughts</h2>
          <p className="text-[#4B5563] leading-loose mb-10">
            Making the right choice comes down to knowing what you value most in a home or a tour stay. With RentDesh, you have access to thousands of verified properties and owner reviews, making your decision much safer. Always read through the tenant reviews before finalizing!
          </p>

          {/* Call to action */}
          <div className="mt-16 bg-[#009282] rounded-[2rem] p-8 sm:p-12 text-center relative overflow-hidden shadow-[0_20px_50px_rgba(0,146,130,0.3)]">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white opacity-10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white opacity-10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/3"></div>
            
            <h3 className="relative z-10 text-2xl sm:text-3xl font-black text-white mb-4 tracking-tight">Ready to find your perfect place?</h3>
            <p className="relative z-10 text-[#E0F5F3] mb-8 sm:text-lg max-w-xl mx-auto">Browse thousands of trusted properties across the country and book securely through RentDesh.</p>
            <Link href="/properties" className="relative z-10 inline-flex items-center gap-2 bg-white text-[#009282] font-black px-8 py-4 rounded-full hover:bg-[#E0F5F3] hover:scale-105 transition-all shadow-xl">
              Explore Properties <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </article>

      </div>
    </div>
  );
}
