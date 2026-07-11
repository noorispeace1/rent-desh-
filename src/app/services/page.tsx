import Link from "next/link";

export const metadata = {
  title: "Our Services | RentDesh — Bangladesh's Smart Rental Platform",
  description:
    "Discover RentDesh's full suite of rental services — verified listings, property management, tenant screening, legal assistance, and more. Simplifying renting across Bangladesh.",
};

const services = [
  {
    id: "verified-listings",
    badge: "Most Popular",
    title: "Verified Property Listings",
    subtitle: "Browse with confidence",
    description:
      "Every property on RentDesh undergoes a strict multi-step verification process. We confirm ownership documents, physical inspections, and owner identity — so you never fall for a fake listing.",
    features: [
      "Ownership document check",
      "Physical inspection report",
      "Owner identity verified",
      "Zero fake listings guarantee",
    ],
    color: "#009282",
    colorRgb: "0,146,130",
    gradTop: "linear-gradient(135deg, #009282 0%, #4ECCA3 100%)",
    gradBorder1: "#009282",
    gradBorder2: "#4ECCA3",
    bg: "rgba(0,146,130,0.07)",
    iconType: "home",
  },
  {
    id: "smart-search",
    badge: "AI Powered",
    title: "Smart Search & Filters",
    subtitle: "Find exactly what you need",
    description:
      "Our intelligent search engine helps you filter by location, price, property type, amenities, and much more. With saved searches and instant alerts, your dream home finds you.",
    features: [
      "Advanced multi-filter system",
      "Location-based search",
      "Instant price-drop alerts",
      "Save & compare listings",
    ],
    color: "#7C3AED",
    colorRgb: "124,58,237",
    gradTop: "linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)",
    gradBorder1: "#7C3AED",
    gradBorder2: "#A78BFA",
    bg: "rgba(124,58,237,0.07)",
    iconType: "search",
  },
  {
    id: "tenant-tools",
    badge: "For Tenants",
    title: "Tenant Management Tools",
    subtitle: "Everything a tenant needs",
    description:
      "From booking viewings to submitting maintenance requests, our tenant dashboard gives you full control over your rental journey. Track your applications and communicate directly with landlords.",
    features: [
      "Online viewing booking",
      "Maintenance request system",
      "Application status tracking",
      "Direct landlord messaging",
    ],
    color: "#0EA5E9",
    colorRgb: "14,165,233",
    gradTop: "linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)",
    gradBorder1: "#0EA5E9",
    gradBorder2: "#38BDF8",
    bg: "rgba(14,165,233,0.07)",
    iconType: "tenant",
  },
  {
    id: "owner-tools",
    badge: "For Owners",
    title: "Owner & Property Management",
    subtitle: "Manage everything in one place",
    description:
      "List multiple properties, track tenant payments, handle lease agreements digitally, and receive monthly performance analytics — all from a single, easy-to-use dashboard.",
    features: [
      "Multi-property dashboard",
      "Digital lease management",
      "Payment tracking & history",
      "Monthly analytics reports",
    ],
    color: "#F59E0B",
    colorRgb: "245,158,11",
    gradTop: "linear-gradient(135deg, #F59E0B 0%, #FCD34D 100%)",
    gradBorder1: "#F59E0B",
    gradBorder2: "#FCD34D",
    bg: "rgba(245,158,11,0.07)",
    iconType: "owner",
  },
  {
    id: "legal-support",
    badge: "Legal",
    title: "Legal & Documentation Support",
    subtitle: "Stay protected, always",
    description:
      "Navigating rental law in Bangladesh is complex. Our team assists with standardized rental agreements, dispute mediation, and document verification so both parties stay protected.",
    features: [
      "Standard rental agreements",
      "Dispute mediation support",
      "Document attestation help",
      "Legal FAQ & guidance",
    ],
    color: "#10B981",
    colorRgb: "16,185,129",
    gradTop: "linear-gradient(135deg, #10B981 0%, #6EE7B7 100%)",
    gradBorder1: "#10B981",
    gradBorder2: "#6EE7B7",
    bg: "rgba(16,185,129,0.07)",
    iconType: "legal",
  },
  {
    id: "support",
    badge: "Always On",
    title: "24/7 Customer Support",
    subtitle: "We\u2019re here whenever you need us",
    description:
      "Our dedicated support team is available around the clock via chat, email, and phone. Whether it\u2019s a late-night emergency or a quick question, we\u2019ve got you covered.",
    features: [
      "Live chat support",
      "Email response < 2 hours",
      "Phone helpline available",
      "Dedicated support agents",
    ],
    color: "#EF4444",
    colorRgb: "239,68,68",
    gradTop: "linear-gradient(135deg, #EF4444 0%, #FCA5A5 100%)",
    gradBorder1: "#EF4444",
    gradBorder2: "#FCA5A5",
    bg: "rgba(239,68,68,0.07)",
    iconType: "phone",
  },
];

const stats = [
  { value: "10,000+", label: "Properties Listed", emoji: "🏠" },
  { value: "25,000+", label: "Happy Tenants", emoji: "😊" },
  { value: "8,000+", label: "Verified Owners", emoji: "✅" },
  { value: "64", label: "Districts Covered", emoji: "📍" },
];

const howItWorks = [
  {
    step: "01",
    title: "Create Your Account",
    desc: "Sign up for free in under 60 seconds. Choose your role as a tenant or property owner.",
    emoji: "👤",
  },
  {
    step: "02",
    title: "Browse or List",
    desc: "Tenants search verified properties. Owners list their properties with photos and details.",
    emoji: "🔍",
  },
  {
    step: "03",
    title: "Connect & Book",
    desc: "Schedule a viewing, communicate with owners, and submit your rental application online.",
    emoji: "📅",
  },
  {
    step: "04",
    title: "Move In Happily",
    desc: "Sign digital agreements, make payments securely, and settle into your new home with ease.",
    emoji: "🎉",
  },
];

function ServiceIcon({ type, color }: { type: string; color: string }) {
  const stroke = color;
  if (type === "home")
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    );
  if (type === "search")
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    );
  if (type === "tenant")
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    );
  if (type === "owner")
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    );
  if (type === "legal")
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    );
  // phone
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.02 1.18 2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14h0v2.92z" />
    </svg>
  );
}

export default function ServicesPage() {
  return (
    <main className="min-h-screen">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0B1A18] via-[#0d2320] to-[#061412] py-28 px-4">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#009282] opacity-10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#7C3AED] opacity-8 rounded-full blur-[100px] pointer-events-none" />
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,146,130,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,146,130,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative max-w-[1100px] mx-auto text-center">
          <span className="inline-flex items-center gap-2 bg-[#009282]/20 border border-[#009282]/30 text-[#4ECCA3] text-xs font-bold uppercase tracking-[0.15em] px-4 py-2 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-[#4ECCA3] rounded-full" style={{ boxShadow: "0 0 6px #4ECCA3" }} />
            Our Services
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.1] tracking-tight mb-6">
            Everything You Need to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#009282] to-[#4ECCA3]">
              Rent Smarter
            </span>
          </h1>
          <p className="text-[#94A3B8] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            RentDesh brings Bangladesh&apos;s rental ecosystem online — with tools built
            for tenants, owners, and everyone in between.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#009282] to-[#00a896] text-white font-bold px-7 py-3.5 rounded-xl shadow-[0_8px_30px_rgba(0,146,130,0.4)] hover:shadow-[0_12px_40px_rgba(0,146,130,0.5)] hover:-translate-y-0.5 transition-all duration-200"
            >
              Browse Properties
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-white/15 backdrop-blur-sm transition-all duration-200"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="py-12 px-4">
        <div className="max-w-[1100px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div
              key={s.label}
              className="svc-stat group relative overflow-hidden rounded-2xl border border-[#E0E6E4] bg-white p-6 text-center"
              style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
            >
              {/* subtle gradient bg on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(0,146,130,0.06) 0%, transparent 70%)" }}
              />
              <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">{s.emoji}</div>
              <div className="text-3xl font-black text-[#009282] tracking-tight tabular-nums">{s.value}</div>
              <div className="text-[13px] text-[#6B7280] font-semibold mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Services Grid ── */}
      <section className="py-24 px-4">
        <div className="max-w-[1240px] mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-[#009282] font-bold uppercase tracking-widest text-xs mb-3">
              What We Offer
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-[#1C1C1E] tracking-tight mb-4">
              Services Built for Bangladesh
            </h2>
            <p className="text-[#6B7280] text-[15px] max-w-xl mx-auto leading-relaxed">
              A complete suite of tools and support systems designed specifically for the unique needs of the Bangladeshi rental market.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
            {services.map((service) => (
              <div
                key={service.id}
                className="svc-card group relative bg-white rounded-[28px] overflow-hidden"
                style={{
                  "--svc-c1": service.gradBorder1,
                  "--svc-c2": service.gradBorder2,
                  "--svc-hover-shadow": `rgba(${service.colorRgb},0.20)`,
                  "--svc-hover-shadow-sm": `rgba(${service.colorRgb},0.11)`,
                  boxShadow: "0 2px 16px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                {/* ── Gradient top accent bar ── */}
                <div
                  className="h-1.5 w-full"
                  style={{ background: service.gradTop }}
                />

                {/* ── Soft GREEN wash background ── */}
                <div
                  className="absolute top-0 left-0 right-0 h-36 pointer-events-none"
                  style={{
                    background: "linear-gradient(180deg, rgba(0,146,130,0.09) 0%, transparent 100%)",
                  }}
                />

                <div className="relative p-7">
                  {/* ── Header: icon + badge ── */}
                  <div className="flex items-start justify-between mb-6">
                    {/* Icon with glow ring */}
                    <div className="svc-icon-wrap relative">
                      <div
                        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 blur-[10px]"
                        style={{ background: service.gradTop }}
                      />
                      <div
                        className="relative w-14 h-14 rounded-2xl flex items-center justify-center"
                        style={{
                          background: "linear-gradient(135deg, rgba(0,146,130,0.14) 0%, rgba(0,146,130,0.07) 100%)",
                          border: "1.5px solid rgba(0,146,130,0.28)",
                          boxShadow: "0 4px 14px rgba(0,146,130,0.18)",
                        }}
                      >
                        <ServiceIcon type={service.iconType} color={service.color} />
                      </div>
                    </div>

                    {/* Badge — green tint always */}
                    <span
                      className="svc-badge text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full"
                      style={{
                        background: "linear-gradient(135deg, rgba(0,146,130,0.14) 0%, rgba(0,146,130,0.07) 100%)",
                        color: service.color,
                        border: "1px solid rgba(0,146,130,0.28)",
                      }}
                    >
                      {service.badge}
                    </span>
                  </div>

                  {/* ── Text content ── */}
                  <p
                    className="text-[10.5px] font-bold uppercase tracking-[0.13em] mb-1.5"
                    style={{ color: service.color }}
                  >
                    {service.subtitle}
                  </p>
                  <h3 className="text-[20px] font-black text-[#1C1C1E] mb-3 leading-tight">
                    {service.title}
                  </h3>
                  <p className="text-[#6B7280] text-[13.5px] leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* ── Feature list ── */}
                  <ul className="space-y-2.5">
                    {service.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-[13px] text-[#374151] font-medium">
                        <span
                          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{
                            background: "linear-gradient(135deg, rgba(0,146,130,0.18) 0%, rgba(0,146,130,0.09) 100%)",
                            boxShadow: "0 2px 6px rgba(0,146,130,0.18)",
                          }}
                        >
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#009282" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* ── Bottom green stripe ── */}
                  <div
                    className="mt-6 h-px w-full opacity-0 group-hover:opacity-100 transition-all duration-500"
                    style={{ background: "linear-gradient(90deg, #009282, #4ECCA3, transparent)" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-24 px-4">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-[#009282] font-bold uppercase tracking-widest text-xs mb-3">
              Simple Process
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-[#1C1C1E] tracking-tight mb-4">
              How RentDesh Works
            </h2>
            <p className="text-[#6B7280] text-[15px] max-w-xl mx-auto">
              Getting your perfect rental is easier than you think. Here&apos;s how it works in just four steps.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step, index) => (
              <div key={step.step} className="svc-step relative">
                {/* connector dashes */}
                {index < howItWorks.length - 1 && (
                  <div
                    className="hidden lg:block absolute top-[44px] left-[calc(50%+44px)] h-px z-10"
                    style={{
                      width: "calc(100% - 20px)",
                      background: "repeating-linear-gradient(90deg, #009282 0, #009282 6px, transparent 6px, transparent 14px)",
                      opacity: 0.3,
                    }}
                  />
                )}
                <div
                  className="svc-step-inner group relative overflow-hidden bg-white rounded-[22px] border border-[#E0E6E4] p-7 text-center"
                  style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
                >
                  {/* top shimmer line */}
                  <div
                    className="svc-step-topline absolute top-0 left-0 right-0 h-0.5 opacity-0 transition-opacity duration-300 rounded-t-[22px]"
                    style={{ background: "linear-gradient(90deg, #009282, #4ECCA3)" }}
                  />
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-[28px] mx-auto mb-5"
                    style={{
                      background: "linear-gradient(135deg, #009282 0%, #00a896 100%)",
                      boxShadow: "0 8px 24px rgba(0,146,130,0.30)",
                    }}
                  >
                    {step.emoji}
                  </div>
                  <div
                    className="inline-block text-[10px] font-black tracking-[0.18em] px-3 py-1 rounded-full mb-2"
                    style={{ background: "rgba(0,146,130,0.08)", color: "#009282" }}
                  >
                    STEP {step.step}
                  </div>
                  <h3 className="text-[16px] font-black text-[#1C1C1E] mb-2">{step.title}</h3>
                  <p className="text-[13px] text-[#6B7280] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4 relative overflow-hidden bg-gradient-to-br from-[#009282] to-[#007a6d]">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-[80px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="relative max-w-[750px] mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-5 leading-tight tracking-tight">
            Ready to Find Your Next Home in Bangladesh?
          </h2>
          <p className="text-white/80 text-lg mb-10 leading-relaxed">
            Join thousands of happy tenants and owners who trust RentDesh for a seamless, stress-free rental experience.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 bg-white text-[#009282] font-black px-8 py-4 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.25)] hover:-translate-y-0.5 transition-all duration-200"
            >
              Start for Free
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 border-2 border-white/40 text-white font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition-all duration-200"
            >
              Browse Properties
            </Link>
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
            {["No Hidden Fees", "100% Verified Listings", "Secure Payments", "24/7 Support"].map((badge) => (
              <div key={badge} className="flex items-center gap-2 text-white/90 text-sm font-semibold">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {badge}
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
