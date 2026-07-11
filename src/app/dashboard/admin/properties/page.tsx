"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Building, Check, Trash2, Edit2, ChevronLeft, ChevronRight, RefreshCw, X } from "lucide-react";

const PAGE_SIZE = 10;

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  
  // Edit Modal State
  const [editingProperty, setEditingProperty] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', location: '', monthlyRent: '', propertyType: '' });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/properties/public`);
      if (res.ok) {
        const data = await res.json();
        setProperties(data);
      }
    } catch (error) {
      console.error("Failed to fetch properties:", error);
      toast.error("Failed to load properties list");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      setActionLoadingId(id);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/properties/approve/${id}`, {
        method: "PATCH"
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success("Property approved successfully!");
        setProperties(prev => 
          prev.map(p => p._id === id ? { ...p, status: "APPROVED" } : p)
        );
      } else {
        throw new Error(data.error || "Failed to approve property");
      }
    } catch (error) {
      console.error("Error approving property:", error);
      toast.error(error.message || "Failed to approve property");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this property listing?")) {
      return;
    }

    try {
      setActionLoadingId(id);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/properties/${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success("Property deleted successfully!");
        setProperties(prev => prev.filter(p => p._id !== id));
      } else {
        throw new Error(data.error || "Failed to delete property");
      }
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error(error.message || "Failed to delete property");
    } finally {
      setActionLoadingId(null);
    }
  };

  const openEditModal = (property) => {
    setEditingProperty(property);
    setEditForm({
      title: property.title || '',
      location: property.location || '',
      monthlyRent: property.monthlyRent || '',
      propertyType: property.propertyType || ''
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setActionLoadingId(editingProperty._id);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/properties/${editingProperty._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm)
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success("Property updated successfully!");
        setProperties(prev => prev.map(p => p._id === editingProperty._id ? { ...p, ...editForm } : p));
        setEditingProperty(null);
      } else {
        throw new Error(data.error || "Failed to update property");
      }
    } catch (error) {
      console.error("Error updating property:", error);
      toast.error(error.message || "Failed to update property");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(properties.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedProperties = properties.slice(startIndex, startIndex + PAGE_SIZE);

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#009282] to-[#00b8a4] animate-pulse shadow-lg mb-4" />
        <p className="text-[#9CA3AF] text-sm font-medium">Loading properties list...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-6xl w-full mx-auto relative">
      {/* Edit Modal */}
      {editingProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setEditingProperty(null)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Edit2 className="w-5 h-5 text-indigo-600" />
              Edit Property
            </h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Title</label>
                <input 
                  type="text" required
                  value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Location</label>
                <input 
                  type="text" required
                  value={editForm.location} onChange={e => setEditForm({...editForm, location: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Monthly Rent (৳)</label>
                <input 
                  type="number" required
                  value={editForm.monthlyRent} onChange={e => setEditForm({...editForm, monthlyRent: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Property Type</label>
                <select 
                  required
                  value={editForm.propertyType} onChange={e => setEditForm({...editForm, propertyType: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium"
                >
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="studio">Studio</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setEditingProperty(null)} className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={actionLoadingId === editingProperty._id} className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors flex justify-center items-center">
                  {actionLoadingId === editingProperty._id ? <RefreshCw className="w-5 h-5 animate-spin" /> : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1C1C1E] tracking-tight mb-2 flex items-center gap-3">
            <Building className="w-8 h-8 text-[#009282]" />
            Manage Properties
          </h1>
          <p className="text-[#6B7280] text-sm">Review, approve, edit, or delete active rental listings on RentDesh.</p>
        </div>
        <button 
          onClick={fetchProperties}
          className="p-3 bg-white border border-[#E5E7EB] hover:bg-gray-50 text-[#4B5563] rounded-xl transition-all shadow-sm hover:shadow active:scale-95 flex items-center justify-center"
          title="Refresh properties list"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Properties Table */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden flex flex-col justify-between min-h-[480px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#4B5563]">
            <thead>
              <tr className="border-b border-[#F3F4F6] text-[#9CA3AF] text-[11px] font-bold uppercase tracking-wider bg-[#F9FAFB]">
                <th className="py-4 pl-6">Title</th>
                <th className="py-4">Location</th>
                <th className="py-4">Price</th>
                <th className="py-4">Type</th>
                <th className="py-4">Owner Email</th>
                <th className="py-4">Status</th>
                <th className="py-4 text-center pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6] font-semibold text-[13.5px] text-[#1C1C1E]">
              {paginatedProperties.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-[#9CA3AF] italic">
                    No properties listed on the platform.
                  </td>
                </tr>
              ) : (
                paginatedProperties.map((property) => {
                  const isApproved = property.status === "APPROVED";
                  const displayStatus = property.status || "APPROVED"; // Defaulting to approved for existing data

                  return (
                    <tr key={property._id} className="hover:bg-[#F9FAFB]/50 transition-colors">
                      <td className="py-4 pl-6 font-bold text-[#1C1C1E]">{property.title || "Untitled Property"}</td>
                      <td className="py-4 text-[#6B7280] font-medium">{property.location || "Bangladesh"}</td>
                      <td className="py-4 text-[#1C1C1E] font-bold">৳{property.monthlyRent || 0}</td>
                      <td className="py-4 text-[#6B7280] font-medium capitalize">{property.propertyType || "Property"}</td>
                      <td className="py-4 text-[#6B7280] font-medium">{property.ownerEmail || "owner@gmail.com"}</td>
                      <td className="py-4">
                        <span className={`text-xs font-bold tracking-wide ${
                          displayStatus === "APPROVED" 
                            ? "text-emerald-600 uppercase" 
                            : "text-amber-500 uppercase"
                        }`}>
                          {displayStatus}
                        </span>
                      </td>
                      <td className="py-4 text-center pr-6">
                        <div className="flex items-center justify-center gap-2">
                          {/* Approve Button */}
                          <button
                            onClick={() => handleApprove(property._id)}
                            disabled={isApproved || actionLoadingId === property._id}
                            className={`p-1.5 rounded-lg border transition-all ${
                              isApproved 
                                ? "border-gray-100 text-gray-300 cursor-not-allowed" 
                                : "border-emerald-100 text-emerald-600 hover:bg-emerald-50 active:scale-90"
                            }`}
                            title={isApproved ? "Already Approved" : "Approve Listing"}
                          >
                            <Check className="w-4 h-4 stroke-[3]" />
                          </button>
                          
                          {/* Edit Button */}
                          <button
                            onClick={() => openEditModal(property)}
                            disabled={actionLoadingId === property._id}
                            className="p-1.5 rounded-lg border border-indigo-100 text-indigo-500 hover:bg-indigo-50 active:scale-90 transition-all"
                            title="Edit Listing"
                          >
                            <Edit2 className="w-4 h-4 stroke-[2]" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(property._id)}
                            disabled={actionLoadingId === property._id}
                            className="p-1.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 active:scale-90 transition-all"
                            title="Delete Listing"
                          >
                            <Trash2 className="w-4 h-4 stroke-[2]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="py-4 border-t border-[#F3F4F6] bg-[#F9FAFB]/50 flex items-center justify-center gap-1 font-semibold text-xs text-[#4B5563]">
            {/* Previous */}
            <button
               onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-white hover:bg-gray-50 transition-all disabled:opacity-50 disabled:hover:bg-white flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Previous
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  currentPage === page
                    ? "border-[#009282] bg-[#009282]/5 text-[#009282]"
                    : "border-[#E5E7EB] bg-white hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}

            {/* Next */}
            <button
               onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] bg-white hover:bg-gray-50 transition-all disabled:opacity-50 disabled:hover:bg-white flex items-center gap-1 cursor-pointer"
            >
              Next
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
