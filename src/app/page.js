import Banner from "@/component/Banner";
import Link from 'next/link';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import FavoriteButton from '@/component/dashboard/FavoriteButton';
import Section from "@/component/Section";

export const dynamic = 'force-dynamic';

async function getProperties() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/properties/public`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch properties:", error);
    return [];
  }
}

async function getFavoriteIds(userId) {
  if (!userId) return [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/favorites/ids/${userId}`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch favorite IDs:", error);
    return [];
  }
}

export default async function Home() {
  const properties = await getProperties();
  const session = await auth.api.getSession({
    headers: await headers()
  });
  const userId = session?.user?.id;
  const favoriteIds = await getFavoriteIds(userId);
  
  // Show top 6 properties on the home page as featured listings
  const featuredProperties = properties.slice(0, 6);

  return (
    <div className="bg-[#F9FAFB] min-h-screen pb-16">
      <Banner />
      
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="inline-block text-[#009282] font-bold uppercase tracking-widest text-xs mb-3">Premium Picks</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#1C1C1E] tracking-tight mb-2">Featured Properties</h2>
            <p className="text-[#6B7280] text-[15px] max-w-2xl leading-relaxed">Explore our handpicked premium and verified listings across Bangladesh. Crafted for modern living.</p>
          </div>
          <Link 
            href="/properties" 
            className="inline-flex items-center justify-center bg-emerald-50 hover:bg-emerald-100 text-[#009282] px-6 py-3 rounded-xl font-bold transition-all"
          >
            Explore All Listings
          </Link>
        </div>

        {featuredProperties.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-[32px] p-16 text-center flex flex-col items-center justify-center min-h-[400px] shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5" />
              </svg>
            </div>
            <h3 className="text-xl font-black text-[#1C1C1E] mb-2">No properties listed yet</h3>
            <p className="text-[#6B7280] text-[15px] max-w-sm">Be the first to list a property on RentDesh.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <div key={property._id} className="group bg-white rounded-[24px] border border-gray-100 overflow-hidden shadow-[0_2px_15px_rgb(0,0,0,0.02)] hover:shadow-[0_15px_40px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 relative">
                <div className="relative h-[260px] w-full bg-gray-50 overflow-hidden">
                  {property.imageUrl ? (
                    <img 
                      src={property.imageUrl} 
                      alt={property.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1500ms] ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="absolute top-4 left-4 bg-[#009282] px-3 py-1.5 rounded-full text-[11px] font-black text-white shadow-sm uppercase tracking-wider">
                    {property.propertyType || "Property"}
                  </div>
                  
                  {/* Favorite Toggle Button */}
                  <FavoriteButton 
                    propertyId={property._id} 
                    initialIsFavorited={favoriteIds.includes(property._id)} 
                  />
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-[19px] font-black text-[#1C1C1E] line-clamp-1 flex-1 pr-4">{property.title || "Untitled Property"}</h3>
                    <span className="text-[#009282] font-black shrink-0 text-lg">৳{property.monthlyRent}</span>
                  </div>
                  <div className="flex items-center text-[#6B7280] text-[13px] font-semibold mb-5">
                    <svg className="w-4 h-4 mr-1.5 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="line-clamp-1">{property.location || "Location not provided"}</span>
                  </div>
                  
                  <div className="flex items-center gap-5 py-4 border-t border-gray-100">
                    <div className="flex items-center gap-1.5 text-[13px] text-[#4B5563]">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span className="font-bold text-[#1C1C1E]">{property.bedroom || 0}</span> Beds
                    </div>
                    <div className="flex items-center gap-1.5 text-[13px] text-[#4B5563]">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span className="font-bold text-[#1C1C1E]">{property.bathroom || 0}</span> Baths
                    </div>
                    <div className="flex items-center gap-1.5 text-[13px] text-[#4B5563]">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                      <span className="font-bold text-[#1C1C1E]">{property.propertySize || 0}</span> sqft
                    </div>
                  </div>

                  <div className="mt-2">
                    <Link 
                      href={`/dashboard/tenant/my-bookings/${property._id}`}
                      className="w-full block text-center bg-[#1C1C1E] hover:bg-black text-white py-3 rounded-xl text-[14px] font-bold transition-all shadow-sm hover:shadow-md"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Section />
    </div>
  );
}
