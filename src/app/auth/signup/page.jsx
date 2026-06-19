"use client";

import React, { useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

const SignUpPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    imageUri: "",
    role: "Tenant",
  });
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

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    try {
      const { data, error: authError } = await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        image: formData.imageUri || undefined,
        role: formData.role,
      });

      if (authError) {
        setError(authError.message || "Failed to create account. Please try again.");
        toast.error(authError.message || "Failed to create account.");
      } else {
        setSuccess("Account created successfully! Redirecting...");
        toast.success("Account created successfully!");
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
      toast.error("Something went wrong with Google Sign-In.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">

      {/* ── Right Visual Panel (shown on left for signup) ── */}
      <div className="hidden lg:block w-[45%] relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560448204-603b3fc33ddc?q=80&w=2070&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A237E]/90 via-[#283593]/75 to-[#3949AB]/60" />
        <div className="absolute top-[-80px] left-[-80px] w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-60px] right-[-60px] w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />

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
              ✨ Join 50,000+ happy users today
            </div>
            <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
              Start your<br />
              journey to a<br />
              <span className="text-[#9FA8DA]">better home.</span>
            </h2>
            <p className="text-white/70 text-lg leading-relaxed max-w-sm">
              Create a free account and browse thousands of verified rental listings across Bangladesh.
            </p>

            {/* Feature list */}
            <div className="flex flex-col gap-3 mt-8">
              {[
                "✓  Verified landlords & properties",
                "✓  Direct chat with owners",
                "✓  Zero brokerage fees",
                "✓  Listings in 64 districts",
              ].map((feat) => (
                <div key={feat} className="flex items-center gap-2 text-white/80 text-sm font-medium">
                  {feat}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <img src="https://i.pravatar.cc/40?img=12" alt="User" className="w-10 h-10 rounded-full border-2 border-white/30 object-cover" />
              <div>
                <p className="text-white font-semibold text-sm">Nadia Islam</p>
                <p className="text-white/50 text-xs">Property Owner, Chittagong</p>
              </div>
              <div className="ml-auto flex gap-0.5">
                {[1,2,3,4,5].map(s => <span key={s} className="text-yellow-400 text-sm">★</span>)}
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              "I listed my property on RentDesh and found a tenant within a week. The platform is so easy to use!"
            </p>
          </div>
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center px-8 sm:px-14 md:px-16 xl:px-24 relative overflow-y-auto py-12">

        {/* Top logo link */}
        <div className="absolute top-8 right-8 sm:right-14">
          <NextLink href="/auth/signin" className="text-[14px] text-[#6B7280] hover:text-[#111827] font-medium transition-colors">
            Already have an account?{" "}
            <span className="text-[#009282] font-bold">Sign In</span>
          </NextLink>
        </div>

        <div className="w-full max-w-[460px] mx-auto">

          {/* Header */}
          <div className="mb-7">
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 text-xs font-bold px-3 py-1.5 rounded-full mb-5 border border-indigo-100">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
              Free to join
            </div>
            <h1 className="font-bold text-[2rem] text-[#1C1C1E] leading-tight mb-2">
              Create your <span className="text-[#009282]">RentDesh</span><br />account
            </h1>
            <p className="text-[#6B7280] text-[14px] leading-relaxed">
              Fill in the details below to get started.
            </p>
          </div>

          {/* Error / Success */}
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
          <form onSubmit={handleSignUp} className="flex flex-col gap-4">

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-[#374151] uppercase tracking-wider">Full Name <span className="text-red-400">*</span></label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                </span>
                <input
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full h-[50px] pl-11 pr-4 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-[#111827] text-[14px] font-medium outline-none transition-all focus:border-[#009282] focus:ring-2 focus:ring-[#009282]/20 focus:bg-white hover:border-[#D1D5DB] placeholder:text-[#9CA3AF]"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-[#374151] uppercase tracking-wider">Email Address <span className="text-red-400">*</span></label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full h-[50px] pl-11 pr-4 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-[#111827] text-[14px] font-medium outline-none transition-all focus:border-[#009282] focus:ring-2 focus:ring-[#009282]/20 focus:bg-white hover:border-[#D1D5DB] placeholder:text-[#9CA3AF]"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-[#374151] uppercase tracking-wider">Password <span className="text-red-400">*</span></label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                </span>
                <input
                  type={isVisible ? "text" : "password"}
                  name="password"
                  placeholder="Min. 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full h-[50px] pl-11 pr-12 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-[#111827] text-[14px] font-medium outline-none transition-all focus:border-[#009282] focus:ring-2 focus:ring-[#009282]/20 focus:bg-white hover:border-[#D1D5DB] placeholder:text-[#9CA3AF]"
                />
                <button
                  type="button"
                  onClick={toggleVisibility}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                >
                  {isVisible ? (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Profile Image URL + Role — side by side */}
            <div className="grid grid-cols-2 gap-3">
              {/* Image URL */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-[#374151] uppercase tracking-wider">Photo URL <span className="text-[#9CA3AF] normal-case font-normal">(optional)</span></label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                    </svg>
                  </span>
                  <input
                    type="url"
                    name="imageUri"
                    placeholder="https://..."
                    value={formData.imageUri}
                    onChange={handleChange}
                    className="w-full h-[50px] pl-10 pr-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-[#111827] text-[13px] font-medium outline-none transition-all focus:border-[#009282] focus:ring-2 focus:ring-[#009282]/20 focus:bg-white hover:border-[#D1D5DB] placeholder:text-[#9CA3AF]"
                  />
                </div>
              </div>

              {/* Role */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-[#374151] uppercase tracking-wider">Account Type</label>
                <div className="relative">
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full h-[50px] pl-4 pr-9 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-[#111827] text-[14px] font-medium outline-none transition-all focus:border-[#009282] focus:ring-2 focus:ring-[#009282]/20 focus:bg-white hover:border-[#D1D5DB] appearance-none cursor-pointer"
                  >
                    <option value="Tenant">🏠 Tenant</option>
                    <option value="Owner">🔑 Owner</option>
                  </select>
                  <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </span>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[52px] mt-2 bg-gradient-to-r from-[#009282] to-[#00a896] text-white font-bold text-[15px] rounded-xl shadow-[0_4px_15px_rgba(0,146,130,0.35)] hover:shadow-[0_6px_20px_rgba(0,146,130,0.45)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Creating Account...
                </>
              ) : (
                "Create Free Account →"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-5">
            <div className="flex-1 h-px bg-[#F3F4F6]"></div>
            <span className="text-[11px] text-[#9CA3AF] uppercase tracking-widest font-semibold">or sign up with</span>
            <div className="flex-1 h-px bg-[#F3F4F6]"></div>
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full h-[50px] bg-white border-2 border-[#E5E7EB] hover:border-[#D1D5DB] text-[#374151] font-semibold text-[14px] rounded-xl hover:bg-[#F9FAFB] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
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
          <p className="text-center text-[13px] text-[#9CA3AF] mt-6">
            By creating an account, you agree to our{" "}
            <NextLink href="/terms" className="text-[#009282] hover:underline font-medium">Terms</NextLink>{" "}
            &amp;{" "}
            <NextLink href="/privacy" className="text-[#009282] hover:underline font-medium">Privacy Policy</NextLink>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;