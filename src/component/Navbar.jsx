"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Navbar as HeroNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import Link from "next/link";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "All Properties", href: "/properties" },
    { name: "Services", href: "/services" },
    { name: "Blog", href: "/blog" },
  ];

  return (
    <HeroNavbar
      onMenuOpenChange={setIsMenuOpen}
      maxWidth="2xl"
     
      className="bg-[#FCF9F6] border-b border-[#EFEBE9] py-3 shadow-sm shadow-[#5D4037]/5 transition-all duration-500" 
      position="sticky"
    >
      {/* Brand Logo */}
      <NavbarContent justify="start" className="flex-1">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="lg:hidden text-[#5D4037]"
        />
        <NavbarBrand>
          <Link href="/" className="group">
            <p className="font-bold font-serif text-3xl text-[#4E342E] tracking-wide transition-transform duration-300 group-hover:scale-105">
              RentDesh
            </p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {/* Center Nav Items */}
      <NavbarContent className="hidden lg:flex gap-3" justify="center">
        {menuItems.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <NavbarItem key={`${item.name}-${index}`} isActive={isActive}>
              <Link
                href={item.href}
                className={`relative font-medium text-[15px] px-5 py-2.5 rounded-full transition-all duration-400 ease-in-out flex items-center justify-center overflow-hidden group ${
                  isActive
                    ? "text-[#4E342E] font-bold bg-[#EFEBE9] shadow-inner" // Active state with light brown bg
                    : "text-[#795548] hover:text-[#3E2723] hover:bg-[#F5F1EE]"
                }`}
              >
                {/* টেক্সট অ্যানিমেশন */}
                <span className="relative z-10 transition-transform duration-300 group-hover:-translate-y-0.5">
                  {item.name}
                </span>
              </Link>
            </NavbarItem>
          );
        })}
      </NavbarContent>

      {/* Right Side Buttons */}
      <NavbarContent justify="end" className="flex-1 gap-2 sm:gap-4">
        {/* Login Button */}
        <NavbarItem className="hidden sm:flex">
          <Button
            as={Link}
            href="/login"
            className={`font-medium px-5 py-2.5 transition-all duration-300 bg-transparent hover:-translate-y-0.5 ${
              pathname === "/login"
                ? "text-[#4E342E] font-bold"
                : "text-[#795548] hover:text-[#4E342E] hover:bg-[#EFEBE9]/60"
            }`}
            variant="light"
            disableRipple
          >
            Login
          </Button>
        </NavbarItem>

        {/* Register Button */}
        <NavbarItem className="hidden sm:flex">
          <Button
            as={Link}
            href="/register"
            className={`font-medium px-6 py-2.5 rounded-full transition-all duration-300 border hover:-translate-y-0.5 ${
              pathname === "/register"
                ? "border-[#6D4C41] text-white bg-[#6D4C41]"
                : "border-[#8D6E63] text-[#5D4037] bg-transparent hover:bg-[#8D6E63] hover:text-white hover:shadow-md"
            }`}
            variant="bordered"
          >
            Register
          </Button>
        </NavbarItem>
        
        {/* NEW: Get Started Button (Rich Chocolate Gradient) */}
        <NavbarItem className="hidden sm:flex">
          <Button
            as={Link}
            href="/signup"
            className="bg-gradient-to-r from-[#6D4C41] to-[#3E2723] text-white font-semibold px-7 py-2.5 rounded-full shadow-[0_4px_15px_rgba(78,52,46,0.3)] hover:shadow-[0_6px_20px_rgba(78,52,46,0.4)] hover:-translate-y-1 hover:scale-105 transition-all duration-300 ease-out"
          >
            Get Started
          </Button>
        </NavbarItem>
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu className="pt-6 pb-4 bg-[#FCF9F6]">
        {menuItems.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <NavbarMenuItem key={`${item.name}-${index}`} isActive={isActive}>
              <Link
                className={`w-full font-medium text-lg py-3 px-4 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-[#EFEBE9] text-[#4E342E] font-bold pl-6 border-l-4 border-[#6D4C41]"
                    : "text-[#795548] hover:bg-[#F5F1EE] hover:text-[#3E2723] hover:pl-6"
                }`}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            </NavbarMenuItem>
          );
        })}

        <div className="flex flex-col gap-3 mt-8 px-4">
          <Button
            as={Link}
            href="/login"
            className={`w-full font-medium py-3 rounded-xl transition-all duration-300 bg-transparent border ${
              pathname === "/login"
                ? "border-[#6D4C41] text-[#4E342E] bg-[#EFEBE9]"
                : "border-[#D7CCC8] text-[#5D4037] hover:border-[#8D6E63] hover:bg-[#F5F1EE]"
            }`}
            variant="bordered"
            onClick={() => setIsMenuOpen(false)}
          >
            Login
          </Button>
          <Button
            as={Link}
            href="/register"
            className={`w-full font-medium py-3 rounded-xl transition-all duration-300 ${
              pathname === "/register"
                ? "bg-[#4E342E] text-white"
                : "bg-[#8D6E63] text-white hover:bg-[#6D4C41]"
            }`}
            variant="solid"
            onClick={() => setIsMenuOpen(false)}
          >
            Register
          </Button>
          
          {/* NEW: Mobile Get Started Button */}
          <Button
            as={Link}
            href="/signup"
            className="w-full font-bold py-3.5 rounded-xl bg-gradient-to-r from-[#6D4C41] to-[#3E2723] text-white shadow-lg shadow-[#4E342E]/30 hover:shadow-xl active:scale-95 transition-all mt-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Get Started
          </Button>
        </div>
      </NavbarMenu>
    </HeroNavbar>
  );
};

export default Navbar;