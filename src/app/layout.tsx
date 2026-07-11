import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "@/context/ThemeContext";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "RentDesh | Find Your Perfect Rental Property in Bangladesh",
  description:
    "Discover verified apartments, sublets, mess rooms, and commercial spaces for rent across Bangladesh. Find your next home easily with RentDesh.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Prevent dark-mode flash on page load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('rentdesh-theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (saved === 'dark' || (!saved && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col overflow-x-hidden bg-white dark:bg-[#0F1F1D] text-[#1C1C1E] dark:text-[#F3F4F6] transition-colors duration-300">
        <ThemeProvider>
          <Navbar />
          
          <main className="flex-1 w-full flex flex-col">
            {children}
          </main>
          <Footer />
          <ToastContainer position="bottom-right" autoClose={3000} />
        </ThemeProvider>
      </body>
    </html>
  );
}
