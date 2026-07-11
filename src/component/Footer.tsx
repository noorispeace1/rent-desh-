"use client";

import React from 'react';
import Link from 'next/link';
import { Input, Button } from "@heroui/react";

// --- Custom SVG Icons (No external library needed) ---
const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

const Footer = () => {
  return (
    <footer className="bg-[#0B1A18] text-white pt-24 pb-8 relative overflow-hidden mt-10 w-full">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#009282] opacity-5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Top Section: Logo, Description & Links */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          
          {/* Brand & Newsletter Section */}
          <div className="lg:col-span-4 flex flex-col pr-0 lg:pr-8">
            {/* Text Logo: RentDesh */}
            <Link href="/" className="inline-block mb-6 group">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#009282] to-[#00b8a4] flex items-center justify-center shadow-lg shadow-[#009282]/20 group-hover:scale-105 transition-transform duration-300">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="9 22 9 12 15 12 15 22" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="font-bold text-3xl tracking-tight leading-none text-white">
                  Rent<span className="text-[#009282]">Desh</span>
                </span>
              </div>
            </Link>
            
            <p className="text-gray-400 text-[15px] leading-relaxed mb-8">
              Find your perfect home with RentDesh. We connect tenants with the best rental properties across the country, ensuring a seamless, secure, and premium experience.
            </p>

            {/* Newsletter Subscription using Hero UI Input */}
            <div className="mb-8 relative">
              <Input
                type="email"
                placeholder="Enter your email"
                variant="bordered"
                radius="lg"
                size="lg"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 pr-12 transition-all hover:bg-white/10"
              />
              <Button 
                isIconOnly 
                size="md" 
                radius="md"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#009282] hover:bg-[#007A6C] text-white transition-colors z-10 shadow-sm"
                aria-label="Subscribe"
              >
                <SendIcon />
              </Button>
            </div>

            {/* Social Icons using Hero UI Button + SVG Icons */}
            <div className="flex items-center gap-4">
              <Button as={Link} href="#" isIconOnly radius="full" aria-label="Facebook" className="bg-white/5 text-gray-300 border border-white/10 hover:bg-[#009282] hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-sm">
                <FacebookIcon />
              </Button>
              <Button as={Link} href="#" isIconOnly radius="full" aria-label="Twitter" className="bg-white/5 text-gray-300 border border-white/10 hover:bg-[#009282] hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-sm">
                <TwitterIcon />
              </Button>
              <Button as={Link} href="#" isIconOnly radius="full" aria-label="Instagram" className="bg-white/5 text-gray-300 border border-white/10 hover:bg-[#009282] hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-sm">
                <InstagramIcon />
              </Button>
              <Button as={Link} href="#" isIconOnly radius="full" aria-label="LinkedIn" className="bg-white/5 text-gray-300 border border-white/10 hover:bg-[#009282] hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-sm">
                <LinkedinIcon />
              </Button>
            </div>
          </div>

          {/* Links Section */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Column 1: Services */}
            <div>
              <h3 className="text-white font-bold text-lg mb-6">Services</h3>
              <ul className="flex flex-col gap-4">
                <li><Link href="#" className="text-gray-400 text-[15px] hover:text-[#A7F3EB] transition-colors duration-300 block">Property Management</Link></li>
                <li><Link href="#" className="text-gray-400 text-[15px] hover:text-[#A7F3EB] transition-colors duration-300 block">Tenant Screening</Link></li>
                <li><Link href="#" className="text-gray-400 text-[15px] hover:text-[#A7F3EB] transition-colors duration-300 block">Home Valuation</Link></li>
                <li><Link href="#" className="text-gray-400 text-[15px] hover:text-[#A7F3EB] transition-colors duration-300 block">Rent Collection</Link></li>
              </ul>
            </div>

            {/* Column 2: Company */}
            <div>
              <h3 className="text-white font-bold text-lg mb-6">Company</h3>
              <ul className="flex flex-col gap-4">
                <li><Link href="#" className="text-gray-400 text-[15px] hover:text-[#A7F3EB] transition-colors duration-300 block">About RentDesh</Link></li>
                <li><Link href="#" className="text-gray-400 text-[15px] hover:text-[#A7F3EB] transition-colors duration-300 block">Meet the Team</Link></li>
                <li><Link href="#" className="text-gray-400 text-[15px] hover:text-[#A7F3EB] transition-colors duration-300 block">Customer Reviews</Link></li>
                <li><Link href="#" className="text-gray-400 text-[15px] hover:text-[#A7F3EB] transition-colors duration-300 block">Careers</Link></li>
              </ul>
            </div>

            {/* Column 3: Helpful Links */}
            <div>
              <h3 className="text-white font-bold text-lg mb-6">Support</h3>
              <ul className="flex flex-col gap-4">
                <li><Link href="#" className="text-gray-400 text-[15px] hover:text-[#A7F3EB] transition-colors duration-300 block">Contact Us</Link></li>
                <li><Link href="#" className="text-gray-400 text-[15px] hover:text-[#A7F3EB] transition-colors duration-300 block">Help Center & FAQs</Link></li>
                <li><Link href="#" className="text-gray-400 text-[15px] hover:text-[#A7F3EB] transition-colors duration-300 block">Live Chat</Link></li>
                <li><Link href="#" className="text-gray-400 text-[15px] hover:text-[#A7F3EB] transition-colors duration-300 block">Property Guide</Link></li>
              </ul>
            </div>

            {/* Column 4: Legal */}
            <div>
              <h3 className="text-white font-bold text-lg mb-6">Legal</h3>
              <ul className="flex flex-col gap-4">
                <li><Link href="#" className="text-gray-400 text-[15px] hover:text-[#A7F3EB] transition-colors duration-300 block">Privacy Policy</Link></li>
                <li><Link href="#" className="text-gray-400 text-[15px] hover:text-[#A7F3EB] transition-colors duration-300 block">Terms of Service</Link></li>
                <li><Link href="#" className="text-gray-400 text-[15px] hover:text-[#A7F3EB] transition-colors duration-300 block">Refund Policy</Link></li>
                <li><Link href="#" className="text-gray-400 text-[15px] hover:text-[#A7F3EB] transition-colors duration-300 block">Accessibility</Link></li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} RentDesh. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;