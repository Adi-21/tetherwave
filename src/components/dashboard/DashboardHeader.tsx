"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

import SocialLinks from "@/components/dashboard/SocialLinks";
import Container from "../common/Container";
import ThemeToggle from "../common/ThemeToggle";
import { useAccount, useDisconnect } from "wagmi";

const navItems = [
  { title: "Dashboard", path: "/dashboard" },
  { title: "Referrals", path: "/dashboard/referrals" },
  { title: "Community", path: "/dashboard/community" },
  { title: "Geneology", path: "/dashboard/geneology" },
  { title: "Royalty", path: "/dashboard/royalty" },
];

const DashboardHeader = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected, router]);

  if (!isConnected) {
    return null;
  }

  const handleLogout = () => {
    disconnect();
    router.push("/");
  };

  return (
    <section className="fixed top-0 w-full drop-shadow-2xl shadow-sm bg-white/20 dark:bg-black/10 backdrop-blur-md z-50">
      <Container>
        <div className="flex justify-between items-center w-full">
          <div className="flex flex-col lg:flex-row justify-center items-center gap-0 lg:gap-8 w-full">
            <Link
              href="/dashboard"
              className="flex w-full lg:w-auto pt-5 lg:pt-0"
            >
              <div className="flex items-center justify-center gap-1 overflow-hidden">
                <Image
                  src="/images/logo.png"
                  alt="Logo"
                  width={400}
                  height={400}
                  quality={100}
                  className="object-cover w-16 h-10 rounded-md"
                />
              </div>
            </Link>
            <div className="flex justify-start items-center gap-2 lg:gap-4 overflow-y-auto w-full p-4">
              {navItems.map((item, index) => (
                <Link
                  href={item.path}
                  key={`${index + 1}`}
                  className={`relative py-2.5 px-6 lg:!px-8 group font-semibold drop-shadow 
                    shadow-[4px_4px_12px_#FC2FA450,-4px_-4px_12px_#FC2FA450] cursor-pointer rounded-full 
                    bg-gradient-button text-white hover:opacity-100 dark:hover:opacity-100 transition-all duration-300 active:scale-105 ${
                      pathname === item.path
                        ? "opacity-100"
                        : "opacity-60 dark:opacity-70"
                    }`}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>

          <div className="absolute lg:relative right-4 lg:right-auto top-4 lg:top-auto flex justify-center items-center gap-4">
            <div className="hidden lg:block">
              <SocialLinks />
            </div>
            <div>
              <ThemeToggle />
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="p-2.5 px-4 lg:px-8 font-semibold cursor-pointer drop-shadow bg-red-500 dark:bg-red-600 
              shadow-[4px_4px_12px_#ef444450,-4px_-4px_12px_#ef444450] text-white bg-opacity-80 dark:bg-opacity-85 
              hover:bg-opacity-100 dark:hover:bg-opacity-100 rounded-lg w-full transition-all duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default DashboardHeader;
