import { Inter, Space_Mono } from "next/font/google";
import type { Metadata } from "next";
import { ClerkProvider,  } from '@clerk/nextjs'
// SignInButton, SignedIn, SignedOut, UserButton
import "./globals.css";

// Load Inter font
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"], // Choose appropriate weights for your design
  display: "swap", // Ensures font is rendered immediately with a fallback
});

// Load Space Mono font
const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  weight: ["400", "700"], // Normal and bold weights
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
       
   
        {children}
     
        
      
      </body>
    </html>
  </ClerkProvider>
  );
}
