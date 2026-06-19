"use client";

import React from 'react';

export default function PaymentHistory({ payments }) {
  const hasPayments = payments && payments.length > 0;

  return (
    <div className="mt-12">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-[#1C1C1E] tracking-tight">Payment History</h2>
        <p className="text-[#6B7280] text-sm mt-1">Review your recent transactions and payment details.</p>
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl shadow-[#009282]/5 border border-[#E5E7EB] overflow-hidden">
        {hasPayments ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14px]">
              <thead className="bg-[#F9FAFB] text-[#4B5563] font-bold text-[11px] uppercase tracking-widest border-b border-[#E5E7EB]">
                <tr>
                  <th className="py-5 px-6 whitespace-nowrap">Transaction ID</th>
                  <th className="py-5 px-6 whitespace-nowrap">Property</th>
                  <th className="py-5 px-6 whitespace-nowrap">Tenant Details</th>
                  <th className="py-5 px-6 whitespace-nowrap">Phone</th>
                  <th className="py-5 px-6 whitespace-nowrap">Date</th>
                  <th className="py-5 px-6 whitespace-nowrap">Amount</th>
                  <th className="py-5 px-6 whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6]">
                {payments.map((payment, index) => (
                  <tr key={payment._id || index} className="hover:bg-[#F0FBF9] transition-colors">
                    <td className="py-5 px-6">
                      <span className="font-mono text-xs font-semibold text-[#4B5563] bg-gray-50 px-2 py-1 rounded-md border border-gray-100 whitespace-nowrap">
                        {payment.transactionId ? `${payment.transactionId.substring(0, 15)}...` : 'N/A'}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <span className="font-bold text-[#1C1C1E] text-sm tracking-tight whitespace-nowrap">
                        {payment.propertyTitle || 'N/A'}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex flex-col">
                        <span className="text-[#1C1C1E] font-bold text-sm whitespace-nowrap">
                          {payment.userName || 'N/A'}
                        </span>
                        <span className="text-[#6B7280] text-xs whitespace-nowrap">
                          {payment.email || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <span className="text-[#4B5563] text-sm whitespace-nowrap">
                        {payment.phone || 'N/A'}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <span className="text-[#4B5563] font-semibold text-sm whitespace-nowrap">
                        {payment.bookingDate ? new Date(payment.bookingDate).toLocaleDateString() : 'N/A'}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <span className="font-black text-[#009282] text-[15px] whitespace-nowrap">
                        ${payment.monthlyRent || '0'}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <span 
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border whitespace-nowrap ${
                          payment.paymentStatus === 'PAID' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : 'bg-orange-50 text-orange-700 border-orange-200'
                        }`}
                      >
                        {payment.paymentStatus || 'PENDING'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-[#9CA3AF] font-medium text-sm">
            No payment history available yet.
          </div>
        )}
      </div>
    </div>
  );
}
