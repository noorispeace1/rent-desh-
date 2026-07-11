"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useSession } from "@/lib/auth-client";

const AddPropertyForm = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const amenitiesList = [
    "WiFi",
    "Security",
    "Parking",
    "Generator",
    "Air Conditioning",
    "Gym",
    "Lift",
    "Swimming Pool",
  ];

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    propertyType: "",
    rentType: "",
    monthlyRent: "",
    propertySize: "",
    bedroom: "",
    bathroom: "",
    extraFeatures: "",
    description: "",
    amenities: [],
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmenityChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      if (checked) {
        return { ...prev, amenities: [...prev.amenities, value] };
      } else {
        return { ...prev, amenities: prev.amenities.filter((item) => item !== value) };
      }
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = "";

    if (image) {
      const imgData = new FormData();
      imgData.append("image", image);
      
      try {
        // You can put your ImgBB API Key in .env.local as NEXT_PUBLIC_IMGBB_API_KEY
        const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY  // Add your actual key here
        const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
          method: "POST",
          body: imgData,
        });
        const imgbbData = await imgbbRes.json();
        
        if (imgbbData.success) {
          imageUrl = imgbbData.data.display_url;
        } else {
          toast.error("Image upload to ImgBB failed!");
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error("Image upload failed", error);
        toast.error("Image upload failed");
        setLoading(false);
        return;
      }
    }

    const propertyData = {
      ...formData,
      imageUrl,
      ownerEmail: session?.user?.email,
      ownerName: session?.user?.name,
      createdAt: new Date().toISOString()
    };

    try {
      // Get or Generate JWT Token
      let token = localStorage.getItem('access_token');
      if (!token && session?.user?.email) {
        const tokenRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/jwt`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: session.user.email })
        });
        if (tokenRes.ok) {
          const tokenData = await tokenRes.json();
          token = tokenData.token;
          localStorage.setItem('access_token', token);
        }
      }

      if (!token) {
         toast.error("Authentication failed. No token generated.");
         setLoading(false);
         return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/property`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(propertyData),
      });

      if (response.ok) {
        toast.success("Property Added Successfully!");
        setFormData({
          title: "",
          location: "",
          propertyType: "",
          rentType: "",
          monthlyRent: "",
          propertySize: "",
          bedroom: "",
          bathroom: "",
          extraFeatures: "",
          description: "",
          amenities: [],
        });
        setImage(null);
        e.target.reset();
        router.refresh();
        router.push("/dashboard/owner/properties");
      } else {
        toast.error("Failed to add property");
      }
    } catch (error) {
      console.error("Error posting property", error);
      toast.error("Error posting property");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#F3F4F6] p-6 sm:p-8 w-full max-w-[1000px]">
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        
        {/* ── Row 1 ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#374151]">Property Title</label>
            <input 
              type="text" 
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Luxury Apartment in Dhaka" 
              className="px-4 py-2.5 rounded-lg border border-[#E5E7EB] text-[14px] text-[#1C1C1E] focus:outline-none focus:border-[#009282] focus:ring-1 focus:ring-[#009282] transition-colors bg-white w-full placeholder:text-[#9CA3AF]" 
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#374151]">Location</label>
            <input 
              type="text" 
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Khulna, Bangladesh" 
              className="px-4 py-2.5 rounded-lg border border-[#E5E7EB] text-[14px] text-[#1C1C1E] focus:outline-none focus:border-[#009282] focus:ring-1 focus:ring-[#009282] transition-colors bg-white w-full placeholder:text-[#9CA3AF]" 
              required
            />
          </div>
        </div>

        {/* ── Row 2 ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#374151]">Property Type</label>
            <div className="relative">
              <select 
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                className="px-4 py-2.5 rounded-lg border border-[#E5E7EB] text-[14px] text-[#1C1C1E] focus:outline-none focus:border-[#009282] focus:ring-1 focus:ring-[#009282] transition-colors bg-white appearance-none w-full cursor-pointer"
                required
              >
                <option value="" disabled className="text-[#9CA3AF]">Select Type</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="commercial">Commercial Space</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#374151]">Rent Type</label>
            <div className="relative">
              <select 
                name="rentType"
                value={formData.rentType}
                onChange={handleChange}
                className="px-4 py-2.5 rounded-lg border border-[#E5E7EB] text-[14px] text-[#1C1C1E] focus:outline-none focus:border-[#009282] focus:ring-1 focus:ring-[#009282] transition-colors bg-white appearance-none w-full cursor-pointer"
                required
              >
                <option value="" disabled className="text-[#9CA3AF]">Select Rent Type</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="weekly">Weekly</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
        </div>

        {/* ── Row 3 ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#374151]">Monthly Rent</label>
            <input 
              type="number" 
              name="monthlyRent"
              value={formData.monthlyRent}
              onChange={handleChange}
              placeholder="15000" 
              className="px-4 py-2.5 rounded-lg border border-[#E5E7EB] text-[14px] text-[#1C1C1E] focus:outline-none focus:border-[#009282] focus:ring-1 focus:ring-[#009282] transition-colors bg-white w-full placeholder:text-[#9CA3AF]" 
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#374151]">Property Size (sqft)</label>
            <input 
              type="number" 
              name="propertySize"
              value={formData.propertySize}
              onChange={handleChange}
              placeholder="1200" 
              className="px-4 py-2.5 rounded-lg border border-[#E5E7EB] text-[14px] text-[#1C1C1E] focus:outline-none focus:border-[#009282] focus:ring-1 focus:ring-[#009282] transition-colors bg-white w-full placeholder:text-[#9CA3AF]" 
            />
          </div>
        </div>

        {/* ── Row 4 ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#374151]">Bedroom</label>
            <input 
              type="number" 
              name="bedroom"
              value={formData.bedroom}
              onChange={handleChange}
              placeholder="2" 
              className="px-4 py-2.5 rounded-lg border border-[#E5E7EB] text-[14px] text-[#1C1C1E] focus:outline-none focus:border-[#009282] focus:ring-1 focus:ring-[#009282] transition-colors bg-white w-full placeholder:text-[#9CA3AF]" 
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#374151]">Bathroom</label>
            <input 
              type="number" 
              name="bathroom"
              value={formData.bathroom}
              onChange={handleChange}
              placeholder="2" 
              className="px-4 py-2.5 rounded-lg border border-[#E5E7EB] text-[14px] text-[#1C1C1E] focus:outline-none focus:border-[#009282] focus:ring-1 focus:ring-[#009282] transition-colors bg-white w-full placeholder:text-[#9CA3AF]" 
            />
          </div>
        </div>

        {/* ── Row 5 ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#374151]">Extra Features</label>
            <input 
              type="text" 
              name="extraFeatures"
              value={formData.extraFeatures}
              onChange={handleChange}
              placeholder="Balcony, Pet Friendly, Rooftop, CCTV" 
              className="px-4 py-2.5 rounded-lg border border-[#E5E7EB] text-[14px] text-[#1C1C1E] focus:outline-none focus:border-[#009282] focus:ring-1 focus:ring-[#009282] transition-colors bg-white w-full placeholder:text-[#9CA3AF]" 
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#374151]">Property Image</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleImageChange}
              className="px-4 py-2 rounded-lg border border-[#E5E7EB] text-[14px] text-[#1C1C1E] focus:outline-none focus:border-[#009282] focus:ring-1 focus:ring-[#009282] transition-colors bg-white w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#009282] file:text-white hover:file:bg-[#007a6c] cursor-pointer" 
            />
          </div>
        </div>

        {/* ── Description ── */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-[#374151]">Description</label>
          <textarea 
            rows="4" 
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Write property details..." 
            className="px-4 py-3 rounded-lg border border-[#E5E7EB] text-[14px] text-[#1C1C1E] focus:outline-none focus:border-[#009282] focus:ring-1 focus:ring-[#009282] transition-colors bg-white resize-y w-full placeholder:text-[#9CA3AF]"
          ></textarea>
        </div>

        {/* ── Amenities ── */}
        <div className="flex flex-col gap-3 mt-2">
          <label className="text-[13px] font-semibold text-[#374151]">Amenities</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-6">
            {amenitiesList.map((item) => (
              <label key={item} className="flex items-center gap-2.5 cursor-pointer group w-fit">
                <input 
                  type="checkbox" 
                  value={item}
                  onChange={handleAmenityChange}
                  checked={formData.amenities.includes(item)}
                  className="w-4 h-4 rounded border-[#D1D5DB] text-[#009282] focus:ring-[#009282] transition-colors cursor-pointer" 
                />
                <span className="text-[13px] font-medium text-[#374151] group-hover:text-[#1C1C1E] transition-colors">
                  {item}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* ── Submit Button ── */}
        <div className="mt-4">
          <button 
            type="submit" 
            disabled={loading}
            className="px-8 py-2.5 bg-[#1C1C1E] hover:bg-[#2D2D2D] disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-[13px] font-bold rounded-lg transition-colors shadow-sm"
          >
            {loading ? "Adding..." : "Add Property"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddPropertyForm;
