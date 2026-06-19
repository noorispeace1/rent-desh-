"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSession } from '@/lib/auth-client';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { CreditCard, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

function SubscriptionPage() {
  const { data: session, isPending: sessionLoading } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [selectedPlan, setSelectedPlan] = useState('premium'); // 'basic' or 'premium'
  const [phone, setPhone] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  const plans = {
    basic: {
      name: 'Basic Owner Plan',
      price: 500,
      description: 'Perfect for listing up to 5 properties with basic analytics.',
      features: ['List up to 5 properties', 'Basic Analytics Overview', 'Email Support', 'Booking management']
    },
    premium: {
      name: 'Premium Partner Plan',
      price: 1500,
      description: 'Unlimited listings, advanced charts, custom reports, and priority support.',
      features: ['Unlimited properties listing', 'Full Interactive Recharts Analytics', 'PDF Earnings Reports Download', 'Priority 24/7 Support', 'Verified Badge on Listings']
    }
  };

  // Handle successful subscription callback from Stripe
  useEffect(() => {
    const success = searchParams.get('success');
    if (success === 'true') {
      setIsSubscribed(true);
      setTransactionId(searchParams.get('session_id') || 'TXN_SUB_SUCCESS');
      toast.success("Subscription activated successfully!");
      // Clean query params
      router.replace('/dashboard/subscription');
    }
  }, [searchParams]);

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!session?.user) {
      toast.error("Please sign in to subscribe!");
      return;
    }

    if (!phone) {
      toast.error("Please enter your contact number!");
      return;
    }

    try {
      setLoading(true);

      const planDetails = plans[selectedPlan];

      // Request Stripe session
      const res = await fetch("/api/checkout-sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId: `sub_${selectedPlan}`,
          propertyTitle: `RentDesh - ${planDetails.name}`,
          monthlyRent: planDetails.price,
          userName: session.user.name || 'Subscriber',
          email: session.user.email,
          phone: phone,
          bookingDate: new Date().toISOString().split('T')[0],
          additionalNotes: `Billing Address: ${billingAddress}`,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create Stripe checkout session");
      }

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Stripe session URL is missing");
      }
    } catch (error) {
      console.error("Subscription Error:", error);
      toast.error(error.message || "Redirect to payment gateway failed.");
    } finally {
      setLoading(false);
    }
  };

  if (sessionLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#009282] to-[#00b8a4] animate-pulse shadow-lg mb-4" />
        <p className="text-[#9CA3AF] text-sm font-medium">Loading subscription details...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="text-center max-w-sm bg-white p-8 rounded-3xl border border-[#E5E7EB] shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#009282] to-[#00b8a4] flex items-center justify-center mx-auto mb-5 shadow-lg">
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[#1C1C1E] mb-2">Sign In Required</h2>
          <p className="text-[#6B7280] text-sm mb-6">You need to sign in to subscribe to a host/owner membership plan.</p>
          <button 
            onClick={() => router.push('/auth/signin')} 
            className="w-full py-3 bg-[#009282] hover:bg-[#007A6C] text-white font-bold rounded-xl transition-all shadow-md cursor-pointer"
          >
            Sign In to Continue
          </button>
        </div>
      </div>
    );
  }

  if (isSubscribed) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="text-center max-w-md bg-white p-8 rounded-3xl border border-[#E5E7EB] shadow-xl">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold text-[#1C1C1E] mb-2">Subscription Activated!</h2>
          <p className="text-[#6B7280] text-sm mb-6">
            Thank you for subscribing! Your account now has active owner list publishing features.
          </p>
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-left mb-6 space-y-2">
            <p className="text-xs text-gray-500 font-bold uppercase">Transaction ID</p>
            <p className="text-sm font-mono text-gray-800 break-all">{transactionId}</p>
          </div>
          <button 
            onClick={() => router.push('/dashboard')} 
            className="w-full py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition-all shadow cursor-pointer"
          >
            Go to Dashboard Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1100px] mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1C1E] mb-2 tracking-tight">Billing & Subscriptions</h1>
        <p className="text-[#6B7280] text-sm">Select your owner tier plan and complete payment securely via Stripe.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">
        {/* Left Column: Form and Plan choice */}
        <div className="space-y-8">
          
          {/* Plan selection grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Basic Plan card */}
            <div 
              onClick={() => setSelectedPlan('basic')}
              className={`p-6 rounded-3xl border transition-all cursor-pointer relative ${
                selectedPlan === 'basic' 
                  ? 'border-[#009282] bg-[#009282]/5 shadow-md' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{plans.basic.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{plans.basic.description}</p>
                </div>
                {selectedPlan === 'basic' && (
                  <span className="w-3 h-3 bg-[#009282] rounded-full" />
                )}
              </div>
              <div className="flex items-baseline gap-1 mt-6">
                <span className="text-3xl font-black text-gray-900">৳{plans.basic.price}</span>
                <span className="text-gray-500 text-xs font-semibold">/ month</span>
              </div>
            </div>

            {/* Premium Plan card */}
            <div 
              onClick={() => setSelectedPlan('premium')}
              className={`p-6 rounded-3xl border transition-all cursor-pointer relative ${
                selectedPlan === 'premium' 
                  ? 'border-[#009282] bg-[#009282]/5 shadow-md' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="absolute -top-3 right-6 bg-[#009282] text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm flex items-center gap-1">
                <Zap className="w-3 h-3 fill-white" /> Best Value
              </div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{plans.premium.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{plans.premium.description}</p>
                </div>
                {selectedPlan === 'premium' && (
                  <span className="w-3 h-3 bg-[#009282] rounded-full" />
                )}
              </div>
              <div className="flex items-baseline gap-1 mt-6">
                <span className="text-3xl font-black text-gray-900">৳{plans.premium.price}</span>
                <span className="text-gray-500 text-xs font-semibold">/ month</span>
              </div>
            </div>

          </div>

          {/* Form parameters */}
          <form onSubmit={handleSubscribe} className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <h3 className="font-bold text-lg text-[#1C1C1E] border-b border-gray-100 pb-4">Checkout Details</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Subscriber Name</label>
                <input
                  type="text"
                  value={session.user.name || ''}
                  disabled
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none text-gray-500 font-medium text-sm cursor-not-allowed"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  value={session.user.email || ''}
                  disabled
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none text-gray-500 font-medium text-sm cursor-not-allowed"
                />
              </div>

              {/* Contact Number */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Contact Number</label>
                <input
                  type="text"
                  placeholder="01XXXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full bg-white border border-gray-200 focus:border-[#009282] rounded-xl px-3.5 py-2.5 outline-none text-gray-800 font-medium text-sm transition-colors"
                />
              </div>

              {/* Billing Address */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Billing / Post Address</label>
                <textarea
                  placeholder="Enter your billing street address..."
                  value={billingAddress}
                  onChange={(e) => setBillingAddress(e.target.value)}
                  rows={2}
                  required
                  className="w-full bg-white border border-gray-200 focus:border-[#009282] rounded-xl px-3.5 py-2.5 outline-none text-gray-800 font-medium text-sm transition-colors resize-none"
                />
              </div>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#009282] hover:bg-[#007A6C] disabled:opacity-50 text-white py-3.5 rounded-2xl text-[15px] font-bold transition-all shadow-[0_8px_20px_rgba(0,146,130,0.2)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <CreditCard className="w-5 h-5" />
              {loading ? "Initializing Secure Gateway..." : `Pay ৳${plans[selectedPlan].price} & Subscribe`}
            </button>

          </form>

        </div>

        {/* Right Column: Plan details summary */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm sticky top-28 space-y-6">
          <div>
            <h3 className="font-bold text-[#1C1C1E] text-base mb-1">Plan Summary</h3>
            <p className="text-xs text-gray-500">Here is what is included in the selected plan.</p>
          </div>

          <div className="py-4 border-y border-gray-100 flex justify-between items-center">
            <span className="font-semibold text-gray-700 text-sm">{plans[selectedPlan].name}</span>
            <span className="font-black text-gray-900 text-lg">৳{plans[selectedPlan].price} <span className="text-xs text-gray-400 font-normal">/mo</span></span>
          </div>

          <ul className="space-y-3">
            {plans[selectedPlan].features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-600 font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#009282] shrink-0 mt-0.5" />
                {feature}
              </li>
            ))}
          </ul>

          <div className="pt-4 border-t border-gray-100 space-y-3">
            <div className="flex gap-2 text-gray-400">
              <ShieldCheck className="w-5 h-5 text-gray-400 shrink-0" />
              <p className="text-[10px] leading-relaxed">
                Secured by Stripe Payment Gateway. Payments are processed immediately and are subject to the terms of service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SubscriptionPageWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#009282] to-[#00b8a4] animate-pulse shadow-lg mb-4" />
        <p className="text-[#9CA3AF] text-sm font-medium">Loading checkout...</p>
      </div>
    }>
      <SubscriptionPage />
    </Suspense>
  );
}