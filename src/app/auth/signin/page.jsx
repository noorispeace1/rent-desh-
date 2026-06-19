"use client";

import React, { useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

const SignInPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!formData.email || !formData.password) {
      setError("Please fill in both email and password.");
      setLoading(false);
      return;
    }

    try {
      const { data, error: authError } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        setError(authError.message || "Invalid email or password.");
        toast.error(authError.message || "Invalid email or password.");
      } else {
        setSuccess("Signed in successfully! Redirecting...");
        toast.success("Signed in successfully!");
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1500);
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.");
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError("");
    try {
      const { data, error } = await authClient.signIn.social({ 
        provider: "google",
        callbackURL: "/dashboard"
      });
      if (error) {
        setError(error.message || "Google Sign-In failed.");
        toast.error(error.message || "Google Sign-In failed.");
        setGoogleLoading(false);
      }
    } catch (err) {
      setError("Something went wrong with Google Sign-In.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">

      {/* ── Left Form Panel ── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-20 xl:px-28 relative">

        {/* Top logo link */}
     

        <div className="w-full max-w-[420px] mx-auto">

          {/* Header */}
          <div className="mb-8">
        
            <h1 className="font-bold text-[2.1rem] text-[#1C1C1E] leading-tight mb-2">
              Sign in to your<br />
              <span className="text-[#009282]">account</span>
            </h1>
            <p className="text-[#6B7280] text-[15px] leading-relaxed">
              Enter your credentials to access your RentDesh account.
            </p>
          </div>

          {/* Error / Success Banners */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex items-center gap-2.5">
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}
          {success && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-medium flex items-center gap-2.5">
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSignIn} className="flex flex-col gap-5">

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#374151] uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full h-[52px] pl-11 pr-4 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-[#111827] text-[15px] font-medium outline-none transition-all focus:border-[#009282] focus:ring-2 focus:ring-[#009282]/20 focus:bg-white hover:border-[#D1D5DB] placeholder:text-[#9CA3AF]"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[13px] font-semibold text-[#374151] uppercase tracking-wider">
                  Password
                </label>
                <NextLink href="/forgot-password" className="text-[13px] text-[#009282] hover:text-[#007a6c] font-semibold transition-colors">
                  Forgot password?
                </NextLink>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                </span>
                <input
                  type={isVisible ? "text" : "password"}
                  name="password"
                  placeholder="••••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full h-[52px] pl-11 pr-12 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-[#111827] text-[15px] font-medium outline-none transition-all focus:border-[#009282] focus:ring-2 focus:ring-[#009282]/20 focus:bg-white hover:border-[#D1D5DB] placeholder:text-[#9CA3AF]"
                />
                <button
                  type="button"
                  onClick={toggleVisibility}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                  aria-label="toggle password visibility"
                >
                  {isVisible ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[52px] mt-1 bg-gradient-to-r from-[#009282] to-[#00a896] text-white font-bold text-[15px] rounded-xl shadow-[0_4px_15px_rgba(0,146,130,0.35)] hover:shadow-[0_6px_20px_rgba(0,146,130,0.45)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-[#F3F4F6]"></div>
            <span className="text-[12px] text-[#9CA3AF] uppercase tracking-widest font-semibold">or continue with</span>
            <div className="flex-1 h-px bg-[#F3F4F6]"></div>
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full h-[52px] bg-white border-2 border-[#E5E7EB] hover:border-[#D1D5DB] text-[#374151] font-semibold text-[15px] rounded-xl hover:bg-[#F9FAFB] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
          >
            {googleLoading ? (
              <svg className="animate-spin w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            ) : (
              <>
                <svg viewBox="0 0 48 48" className="w-5 h-5 shrink-0">
                  <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                  <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
                  <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
                  <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>

          {/* Footer */}
          <p className="text-center text-[14px] text-[#6B7280] mt-7">
            Don&apos;t have an account?{" "}
            <NextLink href="/auth/signup" className="text-[#009282] font-bold hover:underline underline-offset-4 transition-all">
              Create one for free
            </NextLink>
          </p>
        </div>
      </div>

      {/* ── Right Visual Panel ── */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop')" }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#004D40]/90 via-[#00695C]/75 to-[#009282]/60" />
        {/* Decorative blobs */}
        <div className="absolute top-[-80px] right-[-80px] w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-60px] left-[-60px] w-80 h-80 bg-[#009282]/20 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-full p-14 xl:p-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="9 22 9 12 15 12 15 22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-white font-bold text-2xl tracking-tight">
              Rent<span className="text-white/70">Desh</span>
            </span>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              🏠 Trusted by 50,000+ users across Bangladesh
            </div>
            <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
              Find your perfect<br />
              place to call <span className="text-[#80CBC4]">home.</span>
            </h2>
            <p className="text-white/70 text-lg leading-relaxed max-w-sm">
              Thousands of verified properties. Zero hassle. Find apartments, sublets, and more across Bangladesh.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-10">
              {[
                { num: "50K+", label: "Happy Tenants" },
                { num: "12K+", label: "Properties" },
                { num: "64", label: "Districts" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold text-white">{stat.num}</div>
                  <div className="text-white/60 text-xs mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <img src="https://i.pravatar.cc/40?img=5" alt="User" className="w-10 h-10 rounded-full border-2 border-white/30 object-cover" />
              <div>
                <p className="text-white font-semibold text-sm">Rafiq Ahmed</p>
                <p className="text-white/50 text-xs">Found his home in 3 days</p>
              </div>
              <div className="ml-auto flex gap-0.5">
                {[1,2,3,4,5].map(s => <span key={s} className="text-yellow-400 text-sm">★</span>)}
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              "RentDesh made it incredibly easy to find a verified apartment in Dhaka. Highly recommended!"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;