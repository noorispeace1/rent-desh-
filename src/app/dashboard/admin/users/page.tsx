"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { updateUserRole } from "@/lib/actions/users";
import { toast } from "react-toastify";
import { Users, Shield, UserCheck, RefreshCw } from "lucide-react";

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/admin/users`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Failed to fetch admin users:", error);
      toast.error("Failed to load users list");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    if (userId === session?.user?.id) {
      toast.error("You cannot change your own admin role!");
      return;
    }

    try {
      setUpdatingId(userId);
      const res = await updateUserRole(userId, newRole);
      
      if (res.success) {
        toast.success(`User role updated to ${newRole} successfully!`);
        // Update local state
        setUsers(prev => 
          prev.map(u => u._id === userId ? { ...u, role: newRole } : u)
        );
      } else {
        throw new Error(res.error || "Failed to update role");
      }
    } catch (error) {
      console.error("Error changing role:", error);
      toast.error(error.message || "Failed to update user role");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#009282] to-[#00b8a4] animate-pulse shadow-lg mb-4" />
        <p className="text-[#9CA3AF] text-sm font-medium">Loading user list...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-6xl w-full mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1C1C1E] tracking-tight mb-2 flex items-center gap-3">
            <Users className="w-8 h-8 text-[#009282]" />
            Manage Users
          </h1>
          <p className="text-[#6B7280] text-sm">View and change role authorizations for registered accounts.</p>
        </div>
        <button 
          onClick={fetchUsers}
          className="p-3 bg-white border border-[#E5E7EB] hover:bg-gray-50 text-[#4B5563] rounded-xl transition-all shadow-sm hover:shadow active:scale-95 flex items-center justify-center"
          title="Refresh user list"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#4B5563]">
            <thead>
              <tr className="border-b border-[#F3F4F6] text-[#9CA3AF] text-[11px] font-bold uppercase tracking-wider bg-[#F9FAFB]">
                <th className="py-4 pl-6">User Details</th>
                <th className="py-4">Email Address</th>
                <th className="py-4">Current Authorization</th>
                <th className="py-4 text-center pr-6">Change Role (Action)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6] font-semibold text-[13.5px] text-[#1C1C1E]">
              {users.map((user) => {
                const normalizedRole = user.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()) : "Tenant";
                const isSelf = user._id === session?.user?.id;

                return (
                  <tr key={user._id} className="hover:bg-[#F9FAFB]/50 transition-colors">
                    <td className="py-4 pl-6 flex items-center gap-3">
                      {user.image ? (
                        <img 
                          src={user.image} 
                          alt={user.name} 
                          className="w-10 h-10 rounded-full object-cover border border-gray-100"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#009282]/10 text-[#009282] flex items-center justify-center font-bold text-sm">
                          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-[#1C1C1E]">{user.name || "Anonymous User"}</p>
                        {isSelf && (
                          <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold">You</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 text-[#6B7280] font-medium">{user.email}</td>
                    <td className="py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        normalizedRole === "Admin" 
                          ? "bg-red-50 text-red-700 border border-red-100" 
                          : normalizedRole === "Owner"
                          ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      }`}>
                        {normalizedRole === "Admin" ? <Shield className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                        {normalizedRole}
                      </span>
                    </td>
                    <td className="py-4 text-center pr-6">
                      <select
                        value={normalizedRole}
                        disabled={updatingId === user._id || isSelf}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        className="bg-white border border-[#E5E7EB] hover:border-gray-300 rounded-xl px-3 py-1.5 text-xs font-bold text-[#1C1C1E] outline-none cursor-pointer focus:border-[#009282] transition-colors disabled:opacity-50"
                      >
                        <option value="Tenant">Set as Tenant</option>
                        <option value="Owner">Set as Owner</option>
                        <option value="Admin">Set as Admin</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
