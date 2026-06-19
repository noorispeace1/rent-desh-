"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast'; // or react-toastify, let me use standard fetch error handling

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/properties', { cache: 'no-store' });
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
      const res = await fetch(`http://localhost:5000/properties/${id}`, {
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
      const res = await fetch(`http://localhost:5000/properties/${editingProperty._id}`, {
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

      {/* Table Container */}
      <div className="bg-[#1c212a] rounded-xl border border-gray-800 overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 bg-[#1c212a]">
                <th className="py-4 px-6 text-[13px] font-semibold text-gray-400 whitespace-nowrap">Title</th>
                <th className="py-4 px-6 text-[13px] font-semibold text-gray-400 whitespace-nowrap">Location</th>
                <th className="py-4 px-6 text-[13px] font-semibold text-gray-400 whitespace-nowrap">Price</th>
                <th className="py-4 px-6 text-[13px] font-semibold text-gray-400 whitespace-nowrap">Type</th>
                <th className="py-4 px-6 text-[13px] font-semibold text-gray-400 whitespace-nowrap">Status</th>
                <th className="py-4 px-6 text-[13px] font-semibold text-gray-400 whitespace-nowrap text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                      </div>
                      <h3 className="text-base font-medium text-white mb-1">No properties found</h3>
                      <p className="text-gray-400 text-sm">Start listing your properties to see them here.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentItems.map((property) => (
                  <tr key={property._id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="py-4 px-6 text-[14px] text-white font-medium whitespace-nowrap">
                      {property.title || "Untitled Property"}
                    </td>
                    <td className="py-4 px-6 text-[14px] text-gray-400 whitespace-nowrap">
                      {property.location || "N/A"}
                    </td>
                    <td className="py-4 px-6 text-[14px] text-gray-400 whitespace-nowrap">
                      {property.monthlyRent || property.price || "N/A"}
                    </td>
                    <td className="py-4 px-6 text-[14px] text-gray-400 capitalize whitespace-nowrap">
                      {property.propertyType || "N/A"}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="text-[12px] font-semibold text-[#10B981] tracking-wide">
                        {property.status?.toUpperCase() || "APPROVED"}
                      </span>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-4">
                        <button onClick={() => handleEditClick(property)} className="text-[#10B981] hover:text-[#059669] transition-colors" title="Edit">
                          <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button onClick={() => handleDelete(property._id)} className="text-[#EF4444] hover:text-[#DC2626] transition-colors" title="Delete/Hide">
                          <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="flex items-center justify-center gap-1.5 py-5 border-t border-gray-800 bg-[#1c212a]">
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
                      ? 'bg-gray-800 text-white font-semibold border border-gray-700' 
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