import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "@/context/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "RentDesh | Find Your Perfect Rental Property in Bangladesh",
  description:
    "Discover verified apartments, sublets, mess rooms, and commercial spaces for rent across Bangladesh. Find your next home easily with RentDesh.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
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
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <Navbar />
          
          {children}
          <Footer />
          <ToastContainer position="bottom-right" autoClose={3000} />
        </ThemeProvider>
      </body>
    </html>
  );
}
