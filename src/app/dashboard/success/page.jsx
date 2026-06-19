"use client";

import React, { Suspense } from 'react';
import Success from '@/component/dashboard/Success';

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#009282] to-[#00b8a4] animate-pulse shadow-lg mb-4" />
        <p className="text-[#9CA3AF] text-sm font-medium">Verifying transaction details...</p>
      </div>
    }>
      <Success />
    </Suspense>
  );
}
