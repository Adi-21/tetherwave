"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
// import { usePathname } from "next/navigation";
import { IoMenu, IoClose } from "react-icons/io5";
import Container from "./Container";
import { WalletConnect } from "../WalletConnect";

// const navItems = [
//   { name: "Staking", href: "" },
//   { name: "Integrations", href: "" },
//   { name: "Node Operators", href: "" },
//   { name: "Tether DAO", href: "" },
// ];

const Header = () => {
  // const pathname = usePathname();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  // const NavLinks = ({ className }: { className?: string }) => (
  //   <nav
  //     className={`flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-3 lg:text-sm ${className}`}
  //   >
  //     {navItems.map((item) => (
  //       <Link
  //         key={item.name}
  //         href={item.href}
  //         className={`font-medium px-4 py-0.5 transition-all duration-300  hover:text-gray-100 text-lg ${pathname === item.href ? "text-gray-200" : "text-gray-300"
  //           }`}
  //         onClick={() => isMobileMenuOpen && setMobileMenuOpen(false)}
  //       >
  //         {item.name}
  //       </Link>
  //     ))}
  //   </nav>
  // );

  return (
    <header
      className={
        "shadow-sm fixed top-0 left-0 w-full z-50 bg-white/10 backdrop-blur-md transition-all duration-300"
      }
    >
      <Container className="py-4">
        <div className="flex justify-between items-center gap-8 w-full">
          <section>
            <BrandLogo />
          </section>
          {/* <section className="hidden lg:block">
            <NavLinks />
          </section> */}
          <section className="flex items-center gap-4">
            <WalletConnect />

            <button
              type="button"
              className="lg:hidden text-3xl"
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <IoClose size={28} /> : <IoMenu size={28} />}
            </button>
          </section>
        </div>
      </Container>

      <div
        className={`fixed inset-0 flex lg:hidden bg-black/50  backdrop-blur w-full h-screen z-[100] transform transition-all duration-500 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="relative w-full h-full p-6 bg-black/90  text-white backdrop-blur">
          <div className="px-4">
            <BrandLogo />
          </div>
          {/* <div className="mt-8">
            <NavLinks />
          </div> */}

          <button
            type="button"
            className="absolute top-6 right-6 text-3xl"
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          >
            <IoClose size={28} />
          </button>
        </div>

        <div
          className="flex-1"
          onClick={() => setMobileMenuOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setMobileMenuOpen(false)}
          role="button"
          tabIndex={0}
        />
      </div>
    </header>
  );
};

export default Header;

const BrandLogo = () => (
  <Link href="/" className="flex items-center justify-start gap-2">
    <div className="w-16 lg:w-24  rounded-md overflow-hidden  flex items-center justify-center">
      <Image
        src="/images/logo.png"
        alt="Logo"
        width={400}
        height={400}
        quality={100}
        className="object-cover w-full h-full"
      />
    </div>
  </Link>
);
