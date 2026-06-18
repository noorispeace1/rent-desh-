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
      const res = await fetch("http://localhost:5000/favorites", {
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
      className={`absolute bottom-4 right-4 bg-white/95 hover:bg-white backdrop-blur-sm p-2.5 rounded-full shadow-md transition-all duration-300 transform active:scale-95 z-10 ${
        isFavorited 
          ? "text-red-500 scale-105" 
          : "text-gray-400 hover:text-red-500"
      }`}
      title={isFavorited ? "Remove from Favorites" : "Add to Favorites"}
    >
      <svg
        className="w-5 h-5 transition-transform duration-300"
        fill={isFavorited ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
}
