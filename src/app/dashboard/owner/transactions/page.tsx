"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSession } from '@/lib/auth-client';
import { toast } from 'react-toastify';
import { Receipt, Search } from 'lucide-react';

function OwnerTransactionsPage() {
  const { data: session, isPending: sessionLoading } = useSession();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!sessionLoading && session?.user?.email) {
      fetchTransactions(session.user.email);
    } else if (!sessionLoading && !session) {
      setLoading(false);
    }
  }, [session, sessionLoading]);

  const fetchTransactions = async (email) => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/bookings/owner/${email}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      } else {
        toast.error("Failed to fetch transactions");
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(t => 
    t.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.propertyTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (sessionLoading || loading) {
    return (
      <div className="w-full max-w-[1200px] mx-auto p-8 min-h-[400px] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#009282] to-[#00b8a4] animate-pulse shadow-lg mb-4" />
        <p className="text-[#9CA3AF] text-sm font-medium">Loading transactions...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1C1E] mb-2 tracking-tight flex items-center gap-2">
            <Receipt className="w-8 h-8 text-[#009282]" />
            Income & Transactions
          </h1>
          <p className="text-[#6B7280] text-sm">Monitor all payments and bookings for your properties.</p>
        </div>
        
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search TXN ID, email, or property..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#009282] transition-colors"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
        </div>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#F3F4F6] bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-4 px-6">Transaction ID</th>
                <th className="py-4 px-6">Tenant Email</th>
                <th className="py-4 px-6">Property</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Income</th>
                <th className="py-4 px-6 text-right">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6] text-[14px]">
              {filteredTransactions.length > 0 ? filteredTransactions.map((txn) => (
                <tr key={txn._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 font-mono text-xs text-[#6B7280]">
                    {txn.transactionId || 'N/A'}
                  </td>
                  <td className="py-4 px-6 font-medium text-[#1C1C1E]">
                    {txn.email || 'N/A'}
                  </td>
                  <td className="py-4 px-6 text-[#4B5563] truncate max-w-[200px]">
                    {txn.propertyTitle || 'Untitled'}
                  </td>
                  <td className="py-4 px-6 text-[#6B7280]">
                    {txn.bookingDate ? new Date(txn.bookingDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="py-4 px-6 font-semibold text-[#009282]">
                    ৳{txn.monthlyRent}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-50 text-green-700">
                      {txn.paymentStatus || 'PAID'}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-500 text-sm">
                    No transactions found for your properties yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function OwnerTransactionsWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OwnerTransactionsPage />
    </Suspense>
  );
}
