"use client"
import { navLinks } from '@/constants';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
const pathname = usePathname()
  return (
    <div className=" bg-[#15171C] h-full min-w-[260px] px-6 py-8 shadow-lg flex flex-col justify-between rounded-xl">
      {/* Logo Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-[#5436ff] tracking-wide">
          SnapFix
        </h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1">
        <ul className="space-y-4">
          {navLinks.map((item, index) => (
            <li key={index} className={`group ${
              pathname === item.route ? "bg-gradient-to-r rounded-lg from-[#6556cd]  to-[#4a42a2] text-white" : ""
            }`}>
              <Link
                href={item.route}
                className={`flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 group-hover:text-[#ffffff] ${
                  pathname === item.route ? "text-white" : "text-gray-300"
                }`}
              >
                <Image
                  className="w-6 h-6 transition-transform duration-300 group-hover:scale-110"
                  src={item.icon}
                  alt={item.label}
                  width={24}
                  height={24}
                />
                <span className="text-md font-semibold hover:text-white ">
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Authentication Section */}
      <div className="mt-6">
        <SignedOut>
          <SignInButton>
            <button className="w-full bg-gradient-to-r from-[#6556cd] to-[#4a42a2] text-white px-4 py-3 rounded-lg hover:brightness-110 transition-all duration-300 shadow-lg">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <div className="flex justify-center mt-4">
            <UserButton />
          </div>
        </SignedIn>
      </div>
    </div>
  );
};

export default Sidebar;
