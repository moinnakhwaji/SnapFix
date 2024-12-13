import { Inter, Space_Mono } from "next/font/google";
import type { Metadata } from "next";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import Sidebar from "@/components/shared/Sidebar";
import MobileNav from "@/components/shared/MobileNav";

// Load Inter font
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Load Space Mono font
const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MY SaaS Application",
  description: "Modern and scalable SaaS solution",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.variable} ${spaceMono.variable} antialiased`}>
          <div className="flex min-h-screen flex-col lg:flex-row">
            {/* Mobile nav */}
            <div className="lg:hidden w-full bg-[#15171C] text-white p-2 flex items-center justify-between">
              <div className="text-center flex justify-center">
                <h1 className="text-xl text-center font-extrabold text-[#5436ff] tracking-wide">
                  SnapFix
                </h1>
                
              </div>
              {/* Show Sign In button or UserButton based on authentication state */}
              <div className="flex justify-center items-center">
              <div className="">
                <SignedOut>
                  <SignInButton>
                    <button className="w-full bg-gradient-to-r from-[#6556cd] to-[#4a42a2] text-white px-6 py-2 rounded-lg hover:brightness-110 transition-all duration-300 shadow-lg">
                      login
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <div className="flex justify-center items-center">
                    <UserButton />
                  </div>
                </SignedIn>
              </div>
              <div>
              <MobileNav />
              </div>
              </div>
            </div>

            {/* Sidebar for larger screens */}
            <div className="w-80 hidden lg:block bg-[black] text-white">
              <Sidebar />
            </div>

            {/* Content */}
            <div className="flex-1 text-white p-6 bg-black ">
              {children}
            </div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
