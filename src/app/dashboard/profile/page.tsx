"use client";

import React, { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    bio: "",
  });

  // Since we might not have these fields in session initially, we can initialize them when session loads
  React.useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        phone: session.user.phone || "",
        address: session.user.address || "",
        bio: session.user.bio || "",
      });
    }
  }, [session]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#009282] to-[#00b8a4] animate-pulse shadow-lg" />
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const user = session.user;
  const role = user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase() : "Tenant";

  // Role based styling
  const getRoleBadgeStyle = (r) => {
    switch (r) {
      case "Admin":
        return "bg-red-100 text-red-600 border-red-200";
      case "Owner":
        return "bg-indigo-100 text-indigo-700 border-indigo-200";
      default:
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
    }
  };

  const getGradientStyle = (r) => {
    switch (r) {
      case "Admin":
        return "from-red-500 to-red-600";
      case "Owner":
        return "from-indigo-500 to-indigo-600";
      default:
        return "from-[#009282] to-[#00b8a4]";
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Simulate API call
    toast.success("Profile updated successfully!");
    setIsEditing(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Banner */}
      <div className={`w-full h-48 rounded-3xl bg-gradient-to-r ${getGradientStyle(role)} relative overflow-hidden shadow-lg`}>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
      </div>

      {/* Profile Info Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-[#F3F4F6] p-6 sm:p-10 relative -mt-20 mx-4 sm:mx-8 backdrop-blur-xl bg-white/95">
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-20 sm:-mt-24 mb-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-3xl p-1 bg-white shadow-xl shadow-black/5 rotate-[-3deg] group-hover:rotate-0 transition-transform duration-300">
              <img
                src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "U")}&background=f3f4f6&color=1C1C1E&size=256`}
                alt={user.name}
                className="w-full h-full rounded-2xl object-cover"
              />
            </div>
            {isEditing && (
              <button className="absolute bottom-2 right-2 p-2 bg-white rounded-xl shadow-md text-[#374151] hover:text-[#009282] transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 16a1 1 0 011-1h16a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14v-8m0 0l-3 3m3-3l3 3"/></svg>
              </button>
            )}
          </div>
          
          <div className="flex-1 pb-2 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-[#1C1C1E] tracking-tight">{user.name}</h1>
                <p className="text-[#6B7280] font-medium mt-1">{user.email}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${getRoleBadgeStyle(role)} shadow-sm`}>
                  {role} Account
                </span>
                {!isEditing ? (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="px-5 py-2 rounded-xl bg-[#F3F4F6] text-[#374151] font-semibold hover:bg-[#E5E7EB] transition-colors shadow-sm flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Edit Profile
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="px-5 py-2 rounded-xl bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-colors shadow-sm flex items-center gap-2"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Form Area */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-xl font-bold text-[#1C1C1E] mb-5 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#9CA3AF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Personal Information
              </h2>
              {isEditing ? (
                <form id="profile-form" onSubmit={handleSave} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-[#374151]">Full Name</label>
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] focus:bg-white focus:ring-2 focus:ring-[#009282]/20 focus:border-[#009282] outline-none transition-all text-[#1C1C1E] font-medium"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-[#374151]">Phone Number</label>
                      <input 
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="+880 1XXX-XXXXXX"
                        className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] focus:bg-white focus:ring-2 focus:ring-[#009282]/20 focus:border-[#009282] outline-none transition-all text-[#1C1C1E] font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-[#374151]">Address</label>
                    <input 
                      type="text" 
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      placeholder="e.g. Dhaka, Bangladesh"
                      className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] focus:bg-white focus:ring-2 focus:ring-[#009282]/20 focus:border-[#009282] outline-none transition-all text-[#1C1C1E] font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-[#374151]">Bio / About</label>
                    <textarea 
                      rows="4"
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      placeholder="Tell us a little about yourself..."
                      className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] focus:bg-white focus:ring-2 focus:ring-[#009282]/20 focus:border-[#009282] outline-none transition-all text-[#1C1C1E] font-medium resize-none"
                    ></textarea>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <button 
                      type="submit"
                      className={`px-8 py-3 rounded-xl text-white font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 bg-gradient-to-r ${getGradientStyle(role)}`}
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="bg-[#F9FAFB] rounded-2xl p-6 border border-[#F3F4F6] space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-[#9CA3AF] font-medium mb-1">Email Address</p>
                      <p className="text-[#1C1C1E] font-semibold truncate">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#9CA3AF] font-medium mb-1">Phone Number</p>
                      <p className="text-[#1C1C1E] font-semibold">{formData.phone || "Not provided"}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-[#9CA3AF] font-medium mb-1">Address</p>
                    <p className="text-[#1C1C1E] font-semibold">{formData.address || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#9CA3AF] font-medium mb-1">Bio</p>
                    <p className="text-[#1C1C1E] font-semibold leading-relaxed">{formData.bio || "No bio added yet."}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar / Stats */}
          <div className="space-y-6">
            <div className="bg-[#F9FAFB] rounded-2xl p-6 border border-[#F3F4F6]">
              <h3 className="text-sm font-bold text-[#9CA3AF] uppercase tracking-wider mb-5">Account Status</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <div>
                  <p className="text-[#1C1C1E] font-bold">Active</p>
                  <p className="text-[#6B7280] text-sm font-medium">Verified Account</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-[#E5E7EB]">
                  <span className="text-[#6B7280] font-medium">Member Since</span>
                  <span className="text-[#1C1C1E] font-semibold">{new Date(user.createdAt || Date.now()).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#E5E7EB]">
                  <span className="text-[#6B7280] font-medium">Account Type</span>
                  <span className="text-[#1C1C1E] font-semibold">{role}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-[#6B7280] font-medium">Profile Completion</span>
                  <span className="text-emerald-600 font-bold">85%</span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-[#E5E7EB] rounded-full h-2 mt-1">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1C1C1E] to-[#2D2D30] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <svg className="w-24 h-24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
              <h3 className="text-lg font-bold mb-2 relative z-10">Need Help?</h3>
              <p className="text-[#9CA3AF] text-sm mb-5 relative z-10">Contact support for any issues regarding your account.</p>
              <button className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors backdrop-blur-sm relative z-10">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
