"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { toast } from "react-toastify";

// ─── Nav configs per role ───────────────────────────────────────────────────
const tenantNav = [
  {
    group: "", // No group name to match the UI style if preferred, or "Overview"
    items: [
      { label: "Overview", href: "/dashboard/tenant", icon: GridIcon },
      { label: "My Bookings", href: "/dashboard/tenant/my-bookings", icon: FileIcon },
      { label: "Favorites", href: "/dashboard/tenant/favorites", icon: HeartIcon },
      { label: "Reviews", href: "/dashboard/tenant/review", icon: ChatIcon },
      { label: "Profile", href: "/dashboard/profile", icon: UserIcon },
    ],
  },
];

const ownerNav = [
  {
    group: "Overview",
    items: [
      { label: "Dashboard", href: "/dashboard/owner", icon: GridIcon },
      { label: "My Properties", href: "/dashboard/owner/properties", icon: BuildingIcon },
      { label: "Add Property", href: "/dashboard/owner/property/add", icon: PlusIcon },
    ],
  },
  {
    group: "Tenants & Bookings",
    items: [
      { label: "Applications", href: "/dashboard/owner/applications", icon: FileIcon },
      { label: "Bookings", href: "/dashboard/owner/bookings", icon: UsersIcon },
      { label: "Lease Agreements", href: "/dashboard/owner/leases", icon: DocumentIcon },
    ],
  },
  {
    group: "Finance",
    items: [
      { label: "Rent Collected", href: "/dashboard/owner/rent", icon: WalletIcon },
      { label: "Transactions", href: "/dashboard/owner/transactions", icon: ReceiptIcon },
      { label: "Analytics", href: "/dashboard/owner/analytics", icon: ChartIcon },
    ],
  },
  {
    group: "Account",
    items: [
      { label: "Messages", href: "/dashboard/owner/messages", icon: ChatIcon },
      { label: "Profile", href: "/dashboard/profile", icon: UserIcon },
      { label: "Settings", href: "/dashboard/owner/settings", icon: CogIcon },
    ],
  },
];

const adminNav = [
  {
    group: "",
    items: [
      { label: "Overview", href: "/dashboard/admin", icon: GridIcon },
      { label: "Users", href: "/dashboard/admin/users", icon: UsersIcon },
      { label: "Properties", href: "/dashboard/admin/properties", icon: BuildingIcon },
      { label: "Bookings", href: "/dashboard/admin/bookings", icon: CalendarIcon },
      { label: "Transactions", href: "/dashboard/admin/transactions", icon: ReceiptIcon },
      { label: "Profile", href: "/dashboard/profile", icon: UserIcon },
    ],
  },
];

const roleConfig = {
  Tenant: {
    nav: tenantNav,
    color: "from-[#009282] to-[#00b8a4]",
    badge: "Tenant",
    badgeBg: "bg-emerald-100 text-emerald-700",
    activeBg: "bg-[#F0FBF9]",
    activeText: "text-[#009282]",
    activeDot: "bg-[#009282]",
    hoverBg: "hover:bg-[#F9FAFB]",
  },
  Owner: {
    nav: ownerNav,
    color: "from-[#3730A3] to-[#6366F1]",
    badge: "Owner",
    badgeBg: "bg-indigo-100 text-indigo-700",
    activeBg: "bg-indigo-50",
    activeText: "text-indigo-600",
    activeDot: "bg-indigo-500",
    hoverBg: "hover:bg-[#F9FAFB]",
  },
  Admin: {
    nav: adminNav,
    color: "from-[#B91C1C] to-[#EF4444]",
    badge: "Admin",
    badgeBg: "bg-red-100 text-red-600",
    activeBg: "bg-red-50",
    activeText: "text-red-600",
    activeDot: "bg-red-500",
    hoverBg: "hover:bg-[#FFF5F5]",
  },
};

// ─── Main Sidebar ────────────────────────────────────────────────────────────
const DashboardSidebar = ({ isMobileOpen, onMobileClose }) => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const rawRole = session?.user?.role || "Tenant";
  const role = rawRole.charAt(0).toUpperCase() + rawRole.slice(1).toLowerCase();
  const cfg = roleConfig[role] || roleConfig["Tenant"];
  const nav = cfg.nav;

  const isActive = (href) =>
    href === "/dashboard/tenant" || href === "/dashboard/owner" || href === "/dashboard/admin"
      ? pathname === href
      : pathname.startsWith(href);

  const TenantTheme = {
    bg: "bg-[#0B1120]",
    text: "text-white",
    border: "border-white/10",
    brandBorder: "border-white/10",
    activeBg: "bg-[#2563EB]", // Bright blue active background
    activeText: "text-white",
    activeDot: "bg-white",
    hoverBg: "hover:bg-white/5",
    inactiveText: "text-[#9CA3AF]",
    badgeBg: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    userBg: "bg-[#0B1120]",
    userBorder: "border-white/10",
  };

  const LightTheme = {
    bg: "bg-white",
    text: "text-[#1C1C1E]",
    border: "border-[#F3F4F6]",
    brandBorder: "border-[#F3F4F6]",
    activeBg: cfg.activeBg,
    activeText: cfg.activeText,
    activeDot: cfg.activeDot,
    hoverBg: cfg.hoverBg,
    inactiveText: "text-[#6B7280]",
    badgeBg: cfg.badgeBg,
    userBg: "bg-white",
    userBorder: "border-[#F3F4F6]",
  };

  const theme = role === "Tenant" ? TenantTheme : LightTheme;

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Logged out!");
          window.location.href = "/";
        },
      },
    });
  };

  const SidebarContent = () => (
    <div className={`flex flex-col h-full ${theme.bg} ${theme.text}`}>
    

      {/* ── User Card ── */}
    
      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-5 scrollbar-thin">
        {nav.map((section, idx) => (
          <div key={idx}>
            {section.group && (
              <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest px-3 mb-1.5">
                {section.group}
              </p>
            )}
            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onMobileClose}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-semibold transition-all duration-150 group ${
                      active
                        ? `${theme.activeBg} ${theme.activeText}`
                        : `${theme.inactiveText} ${theme.hoverBg} hover:${theme.text}`
                    }`}
                  >
                    <span className={`shrink-0 transition-colors ${active ? theme.activeText : `text-[#9CA3AF] group-hover:${theme.inactiveText}`}`}>
                      <Icon className="w-[17px] h-[17px]" />
                    </span>
                    {item.label}
                    {active && (
                      <span className={`ml-auto w-1.5 h-1.5 rounded-full ${theme.activeDot}`} />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Bottom ── */}
      <div className={`px-3 py-4 border-t ${theme.border} flex flex-col gap-1`}>
        <Link
          href="/"
          onClick={onMobileClose}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-semibold ${theme.inactiveText} ${theme.hoverBg} hover:${theme.text} transition-all`}
        >
          <ArrowLeftIcon className="w-[17px] h-[17px] text-[#9CA3AF]" />
          Back to Home
        </Link>
        <button
          onClick={handleSignOut}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-semibold text-red-500 ${role === "Tenant" ? "hover:bg-red-500/10" : "hover:bg-red-50"} hover:text-red-400 transition-all text-left`}
        >
          <LogOutIcon className="w-[17px] h-[17px]" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 ${theme.bg} border-r ${theme.border} overflow-hidden`}>
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={onMobileClose}
          />
          <aside className="lg:hidden fixed left-0 top-0 h-full w-72 bg-white z-50 shadow-2xl overflow-hidden animate-in slide-in-from-left duration-300">
            <div className="absolute top-4 right-4">
              <button
                onClick={onMobileClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB] transition-colors"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
};

export default DashboardSidebar;

// ─── Inline SVG Icon Components ──────────────────────────────────────────────
function CalendarIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}

function GridIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  );
}
function HomeIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}
function HeartIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
    </svg>
  );
}
function FileIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
    </svg>
  );
}
function WalletIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
    </svg>
  );
}
function ClockIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}
function ChatIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
    </svg>
  );
}
function UserIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  );
}
function CogIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  );
}
function BuildingIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="15" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><line x1="12" y1="12" x2="12" y2="17"/><line x1="9.5" y1="14.5" x2="14.5" y2="14.5"/>
    </svg>
  );
}
function PlusIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}
function UsersIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>
  );
}
function DocumentIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
    </svg>
  );
}
function ChartIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  );
}
function ShieldIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}
function BadgeIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
    </svg>
  );
}
function ArrowLeftIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
    </svg>
  );
}
function LogOutIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  );
}
function CloseIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}

function ReceiptIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 2v20l2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2V2H4z"/><line x1="16" y1="8" x2="8" y2="8"/><line x1="16" y1="12" x2="8" y2="12"/><line x1="10" y1="16" x2="8" y2="16"/>
    </svg>
  );
}