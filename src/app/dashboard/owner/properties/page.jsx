"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast'; // or react-toastify, let me use standard fetch error handling

import { useSession } from '@/lib/auth-client';

export default function PropertiesPage() {
  const { data: session } = useSession();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Edit Modal States
  const [editingProperty, setEditingProperty] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    monthlyRent: '',
    propertyType: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (session?.user?.email) {
      fetchProperties();
    }
  }, [session]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/properties/owner/${session.user.email}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setProperties(data);
      }
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = properties.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(properties.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this property?")) return;
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/properties/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProperties(properties.filter(p => p._id !== id));
      } else {
        alert("Failed to delete property");
      }
    } catch (error) {
      console.error("Error deleting property:", error);
      alert("Error deleting property");
    }
  };

  const handleEditClick = (property) => {
    setEditingProperty(property);
    setFormData({
      title: property.title || '',
      location: property.location || '',
      monthlyRent: property.monthlyRent || property.price || '',
      propertyType: property.propertyType || '',
    });
  };

  const closeEditModal = () => {
    setEditingProperty(null);
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingProperty) return;

    setIsUpdating(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/properties/${editingProperty._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        // Update local state
        setProperties(properties.map(p => 
          p._id === editingProperty._id ? { ...p, ...formData } : p
        ));
        closeEditModal();
        if (toast) toast.success("Property updated successfully!");
        else alert("Property updated successfully!");
      } else {
        if (toast) toast.error("Failed to update property");
        else alert("Failed to update property");
      }
    } catch (error) {
      console.error("Error updating property:", error);
      if (toast) toast.error("Error updating property");
      else alert("Error updating property");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-[calc(100vh-100px)] flex items-center justify-center flex-col">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#009282] to-[#00b8a4] animate-pulse shadow-lg mb-4" />
        <p className="text-[#9CA3AF] text-sm font-medium">Loading properties...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto p-4 sm:p-6 lg:p-8 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">My Properties</h1>
          <p className="text-gray-400 text-sm">Manage and view all your listed properties.</p>
        </div>
        <Link 
          href="/dashboard/owner/property/add"
          className="bg-[#009282] hover:bg-[#007A6C] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          Add New
        </Link>
      </div>

      {/* Cards Container */}
      <div className="mt-6">
        {currentItems.length === 0 ? (
          <div className="bg-[#1c212a] rounded-xl border border-gray-800 py-16 text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
              </div>
              <h3 className="text-base font-medium text-white mb-1">No properties found</h3>
              <p className="text-gray-400 text-sm">Start listing your properties to see them here.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentItems.map((property) => (
                <div key={property._id} className="bg-[#1c212a] rounded-xl border border-gray-800 overflow-hidden hover:shadow-lg transition-shadow relative flex flex-col group">
                  {/* Card Image */}
                  <div className="relative h-48 w-full bg-[#13192b] overflow-hidden">
                    {property.imageUrl ? (
                      <img 
                        src={property.imageUrl} 
                        alt={property.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-[#009282] px-3 py-1 rounded-full text-[10px] font-extrabold text-white shadow-sm uppercase tracking-wide">
                      {property.propertyType || "Property"}
                    </div>
                    <div className="absolute top-3 right-3 bg-[#13192b]/80 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-bold text-[#10B981] shadow-sm uppercase tracking-widest border border-gray-700/50">
                      {property.status?.toUpperCase() || "APPROVED"}
                    </div>
                  </div>
                  
                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-white font-bold text-lg mb-1.5 line-clamp-1">{property.title || "Untitled Property"}</h3>
                    <p className="text-gray-400 text-xs mb-4 flex items-center gap-1.5 line-clamp-1">
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      {property.location || "N/A"}
                    </p>
                    
                    <div className="text-[#009282] font-bold text-xl mb-5">
                      ৳{property.monthlyRent || property.price || 0} <span className="text-xs text-gray-500 font-medium">/mo</span>
                    </div>
                    
                    {/* Actions */}
                    <div className="mt-auto flex items-center gap-3 pt-4 border-t border-gray-800/60">
                      <button 
                        onClick={() => handleEditClick(property)} 
                        className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg text-[13px] font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(property._id)} 
                        className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 py-2 rounded-lg text-[13px] font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 0 && (
              <div className="flex items-center justify-center gap-1.5 py-6 mt-4">
                <button 
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  className="text-[13px] font-medium text-gray-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 mr-2 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7" /></svg>
                  Previous
                </button>
                
                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`min-w-[28px] h-[28px] px-2 flex items-center justify-center rounded text-[13px] transition-colors ${
                        currentPage === i + 1 
                          ? 'bg-[#009282] text-white font-semibold shadow-sm' 
                          : 'text-gray-400 hover:bg-gray-800'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="text-[13px] font-medium text-gray-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 ml-2 transition-colors"
                >
                  Next
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Edit Modal */}
      {editingProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#1c212a] border border-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-[#13192b]/50">
              <h2 className="text-lg font-bold text-white">Edit Property</h2>
              <button onClick={closeEditModal} className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <form onSubmit={handleUpdate} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Title</label>
                  <input 
                    type="text" 
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    required
                    className="w-full bg-[#13192b] border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#009282] focus:ring-1 focus:ring-[#009282] transition-colors"
                    placeholder="E.g. Luxury Apartment"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Location</label>
                  <input 
                    type="text" 
                    name="location"
                    value={formData.location}
                    onChange={handleFormChange}
                    required
                    className="w-full bg-[#13192b] border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#009282] focus:ring-1 focus:ring-[#009282] transition-colors"
                    placeholder="E.g. Dhaka, Bangladesh"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Monthly Rent (৳)</label>
                    <input 
                      type="number" 
                      name="monthlyRent"
                      value={formData.monthlyRent}
                      onChange={handleFormChange}
                      required
                      className="w-full bg-[#13192b] border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#009282] focus:ring-1 focus:ring-[#009282] transition-colors"
                      placeholder="E.g. 15000"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Type</label>
                    <select 
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleFormChange}
                      className="w-full bg-[#13192b] border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#009282] focus:ring-1 focus:ring-[#009282] transition-colors"
                    >
                      <option value="">Select type</option>
                      <option value="apartment">Apartment</option>
                      <option value="house">House</option>
                      <option value="villa">Villa</option>
                      <option value="office">Office</option>
                      <option value="studio">Studio</option>
                      <option value="commercial">Commercial</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex gap-3 justify-end">
                <button 
                  type="button" 
                  onClick={closeEditModal}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isUpdating}
                  className="bg-[#009282] hover:bg-[#007A6C] disabled:bg-opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm flex items-center gap-2"
                >
                  {isUpdating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}