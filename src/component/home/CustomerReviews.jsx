import React from 'react';

async function getReviews() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/reviews`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return [];
  }
}

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg 
          key={star} 
          className={`w-4 h-4 ${star <= rating ? 'text-[#FFB800] fill-current drop-shadow-sm' : 'text-gray-200'}`} 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default async function CustomerReviews() {
  const reviews = await getReviews();

  if (!reviews || reviews.length === 0) {
    return null; // Hide the section if there are no reviews yet
  }

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-br from-[#0B1120] to-[#111827]">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-[#009282]/20 blur-[100px]"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#3730A3]/20 blur-[120px]"></div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block py-1.5 px-4 rounded-full bg-[#009282]/10 text-[#00E5CC] text-xs font-bold tracking-widest uppercase mb-4 border border-[#009282]/20 shadow-[0_0_15px_rgba(0,146,130,0.2)]">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
            Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5CC] to-[#009282]">Tenants</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
            Discover what our community is saying about their experience renting through RentDesh. Genuine reviews from verified tenants.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <div 
              key={review._id || index} 
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-2xl hover:-translate-y-2 hover:bg-white/10 transition-all duration-300 group relative overflow-hidden flex flex-col h-full"
            >
              {/* Decorative Quote Icon */}
              <div className="absolute -top-4 -right-4 text-white/5 group-hover:text-white/10 transition-colors duration-300 pointer-events-none">
                <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
              </div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-6 flex-1">
                  <StarRating rating={review.rating || 5} />
                  <p className="text-gray-300 mt-4 leading-relaxed text-[15px] italic">
                    "{review.reviewText}"
                  </p>
                </div>
                
                <div className="mt-auto border-t border-white/10 pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#009282] to-[#00E5CC] flex items-center justify-center text-white font-bold text-lg shadow-lg shrink-0">
                      {(review.userName || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-white font-bold tracking-wide">{review.userName || 'Anonymous Tenant'}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[#00E5CC] text-xs font-semibold">{review.propertyTitle || 'Verified Property'}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                        <span className="text-gray-500 text-xs">{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
