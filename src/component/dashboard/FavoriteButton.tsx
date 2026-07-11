"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { toast } from "react-toastify";

export default function FavoriteButton({ propertyId, initialIsFavorited, onToggle }) {
  const { data: session } = useSession();
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [loading, setLoading] = useState(false);

  // Keep state in sync with prop updates
  useEffect(() => {
    setIsFavorited(initialIsFavorited);
  }, [initialIsFavorited]);

  const toggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user) {
      toast.error("Please sign in to save favorites");
      return;
    }

    if (loading) return;

    const previousState = isFavorited;
    // Optimistically toggle UI state
    setIsFavorited(!previousState);
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user.id,
          propertyId,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to toggle favorite");
      }

      const data = await res.json();
      setIsFavorited(data.favorited);
      
      if (data.favorited) {
        toast.success("Added to favorites!", { autoClose: 2000 });
      } else {
        toast.success("Removed from favorites!", { autoClose: 2000 });
      }

      // Notify parent component if callback provided
      if (onToggle) {
        onToggle(propertyId, data.favorited);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      // Revert optimistic update
      setIsFavorited(previousState);
      toast.error("Failed to update favorite. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`absolute bottom-4 right-4 backdrop-blur-sm p-3 rounded-full shadow-lg transition-all duration-300 transform z-10 overflow-hidden group focus:outline-none ${
        isFavorited 
          ? "bg-red-50 text-red-500 border border-red-100 shadow-red-500/30 hover:scale-105" 
          : "bg-white/90 text-gray-400 hover:text-red-500 border border-white/50 hover:scale-105 hover:bg-white"
      }`}
      title={isFavorited ? "Remove from Favorites" : "Add to Favorites"}
    >
      <div className="relative flex items-center justify-center">
        <svg
          className={`w-5 h-5 transition-all duration-500 ${isFavorited ? "scale-110" : "scale-100 group-hover:scale-110"}`}
          fill={isFavorited ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={isFavorited ? "0" : "2"}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        
        {/* Beautiful ping animation when favorited */}
        {isFavorited && (
          <svg
            className="absolute inset-0 w-5 h-5 text-red-400 animate-ping opacity-75"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        )}
      </div>
    </button>
  );
}
