"use client";

import { navLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const MobileNav = () => {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger>
        <Image
          src="/assets/icons/menu.svg"
          alt="menu"
          width={32}
          height={32}
          className="cursor-pointer hover:scale-110 transition-transform duration-200"
        />
      </SheetTrigger>

      <SheetContent className="bg-[#1c1e26] text-white sm:w-64">
        <SheetHeader>
          <SheetTitle>
            <div className="text-center mb-6">
              <h1 className="text-3xl font-extrabold text-[#5436ff] tracking-wide">
                SnapFix
              </h1>
            </div>
          </SheetTitle>
        </SheetHeader>

        <nav className="space-y-4">
          {navLinks.map((link) => {
            const isActive = link.route === pathname;
            return (
              <li
                key={link.route}
                className={`${
                  isActive ? "text-[#5436ff]" : "text-white"
                } p-4 flex items-center gap-2 cursor-pointer`}
              >
                <Link href={link.route} className="flex items-center space-x-2">
                  <Image
                    src={link.icon}
                    alt={link.label}
                    width={24}
                    height={24}
                  />
                  <span>{link.label}</span>
                </Link>
              </li>
            );
          })}
        </nav>

        <div className="mt-6">
          <Button asChild className="bg-purple-gradient bg-cover w-full">
            <Link href="/sign-in">Login</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
