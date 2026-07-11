import React from 'react';
import Link from 'next/link';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip } from "@heroui/react";

export const dynamic = 'force-dynamic';

async function getBooking(id) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/bookings/single/${id}`, { cache: 'no-store' });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        console.error("Failed to fetch booking:", error);
        return null;
    }
}

async function getProperty(id) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/property/${id}`, { cache: 'no-store' });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        console.error("Failed to fetch property:", error);
        return null;
    }
}

export default async function BookingInfoPage({ params }) {
    const { id } = await params;
    const booking = await getBooking(id);
    
    if (!booking) {
        return (
            <div className="min-h-[80vh] bg-[#F9FAFB] flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-3xl shadow-lg border border-[#E5E7EB] text-center max-w-md w-full">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                    </div>
                    <h1 className="text-2xl font-bold text-[#1C1C1E] mb-3">Booking Not Found</h1>
                    <p className="text-[#6B7280] mb-8">The booking you are looking for does not exist or has been removed.</p>
                    <Link href="/dashboard/tenant/my-bookings" className="block w-full bg-[#009282] text-white py-3.5 rounded-xl font-bold hover:bg-[#007A6C] transition-colors">
                        Go Back to Bookings
                    </Link>
                </div>
            </div>
        );
    }

    const property = await getProperty(booking.propertyId);

    // Prepare table data for Booking Details
    const detailsData = [
        { key: "1", label: "Property Title", value: booking.propertyTitle || "N/A" },
        { key: "2", label: "Transaction ID", value: booking.transactionId || "N/A", isMono: true },
        { key: "3", label: "Booking Date", value: booking.bookingDate || "N/A" },
        { key: "4", label: "Amount Paid / Rent", value: `৳${booking.monthlyRent || 0}`, isHighlight: true },
        { key: "5", label: "Applicant Name", value: booking.userName || "N/A" },
        { key: "6", label: "Email Address", value: booking.email || "N/A" },
        { key: "7", label: "Phone Number", value: booking.phone || "N/A" },
        { key: "8", label: "Additional Notes", value: booking.additionalNotes || "None" },
    ];

    return (
        <div className="min-h-screen bg-[#F9FAFB] pb-20">
            {/* Top Navigation Overlay */}
            <div className="w-full p-4 sm:p-8 flex justify-between items-center bg-white border-b border-[#E5E7EB]">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/tenant/my-bookings" className="bg-gray-50 hover:bg-gray-100 text-[#4B5563] p-2.5 rounded-full transition-all border border-[#E5E7EB]">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    </Link>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-black text-[#1C1C1E] tracking-tight">Booking Overview</h1>
                        <p className="text-sm text-[#6B7280] font-medium">Review your application and payment details.</p>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto mt-8 px-4 sm:px-6 lg:px-8 space-y-8">
                
                {/* Status Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white rounded-3xl shadow-sm border border-[#E5E7EB] p-6 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mb-1">Payment Status</p>
                            <h3 className="text-xl font-black text-[#1C1C1E]">{booking.paymentStatus || 'PENDING'}</h3>
                        </div>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${booking.paymentStatus === 'PAID' ? 'bg-emerald-50 text-emerald-500' : 'bg-orange-50 text-orange-500'}`}>
                            {booking.paymentStatus === 'PAID' ? (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            )}
                        </div>
                    </div>
                    <div className="bg-white rounded-3xl shadow-sm border border-[#E5E7EB] p-6 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest mb-1">Booking Status</p>
                            <h3 className="text-xl font-black text-[#1C1C1E]">{booking.status || 'PENDING'}</h3>
                        </div>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${booking.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-500' : booking.status === 'REJECTED' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                            {booking.status === 'APPROVED' ? (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            ) : booking.status === 'REJECTED' ? (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            )}
                        </div>
                    </div>
                </div>

                {/* Beautiful Hero UI Table for Booking Details */}
                <div className="bg-white rounded-[2rem] shadow-xl shadow-[#009282]/5 border border-[#E5E7EB] overflow-hidden">
                    <div className="p-6 border-b border-[#F3F4F6] bg-gray-50 flex items-center justify-between">
                        <h2 className="text-lg font-black text-[#1C1C1E] flex items-center gap-2">
                            <svg className="w-5 h-5 text-[#009282]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            Complete Booking Details
                        </h2>
                        <Chip size="sm" className="bg-[#009282]/10 text-[#009282] font-bold tracking-wider">
                            ID: {booking._id}
                        </Chip>
                    </div>
                    <Table 
                        aria-label="Booking Details Table"
                        shadow="none"
                        classNames={{
                            wrapper: "p-0 rounded-none bg-transparent",
                            th: "bg-white text-[#9CA3AF] text-[10px] font-bold uppercase tracking-widest py-4 border-b border-[#F3F4F6]",
                            td: "py-4 px-6 border-b border-[#F9FAFB] group-data-[last=true]:border-b-0",
                            tr: "hover:bg-[#F9FAFB]/50 transition-colors"
                        }}
                    >
                        <TableHeader>
                            <TableColumn key="field">INFORMATION FIELD</TableColumn>
                            <TableColumn key="value">PROVIDED VALUE</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {detailsData.map((item) => (
                                <TableRow key={item.key}>
                                    <TableCell className="text-[#6B7280] font-semibold text-sm w-1/3">
                                        {item.label}
                                    </TableCell>
                                    <TableCell>
                                        <span className={`
                                            ${item.isHighlight ? 'text-[#009282] text-xl font-black' : 'text-[#1C1C1E] font-medium text-sm'}
                                            ${item.isMono ? 'font-mono bg-gray-100 px-2 py-1 rounded-md border border-gray-200 text-xs' : ''}
                                        `}>
                                            {item.value}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Associated Property (Optional) */}
                {property && (
                    <div className="bg-white rounded-[2rem] shadow-sm border border-[#E5E7EB] p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                        <div className="w-full sm:w-48 h-32 bg-gray-200 rounded-2xl overflow-hidden shrink-0 shadow-inner">
                            <img src={property.imageUrl || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1200&auto=format&fit=crop"} alt={property.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center h-full space-y-3 w-full">
                            <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-extrabold rounded-full uppercase tracking-widest w-max">
                                Linked Property
                            </div>
                            <h3 className="text-2xl font-black text-[#1C1C1E] tracking-tight">{property.title}</h3>
                            <p className="text-[#6B7280] text-sm font-medium flex items-center gap-1.5">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                                {property.location}
                            </p>
                        </div>
                        <div className="shrink-0 w-full sm:w-auto">
                            <Link href={`/properties`}>
                                <button className="w-full sm:w-auto px-6 py-3 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#374151] font-bold rounded-xl transition-all">
                                    View Live Listing
                                </button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
