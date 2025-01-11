import Link from "next/link";
import { FaFacebookF, FaXTwitter, FaInstagram } from "react-icons/fa6";
import Container from "./Container";

export function Footer() {
  return (
    <footer className="border-t border-white border-opacity-20 pt-8 lg:pt-12 pb-4 lg:pb-6">
      <Container>
        <div className="flex flex-col items-center gap-8 w-full">
          <section className="grid lg:grid-cols-2 gap-8 w-full">
            <div className="flex flex-col justify-center lg:items-start lg:justify-start gap-4 w-full">
              <div className="text-center lg:text-start">
                <h2 className="text-2xl font-bold mb-2">Tether Ventures</h2>
                <p className="text-l text-gray-400">
                  Building Networks, Growing Wealth Together
                </p>
              </div>
              <div className="flex justify-center items-center gap-8">
                <Link href="#" className="text-gray-400 hover:text-[#f3ba2f]">
                  <FaFacebookF className="w-8 h-8" />
                </Link>
                <span className="text-gray-600">•</span>
                <Link href="#" className="text-gray-400 hover:text-[#f3ba2f]">
                  <FaXTwitter className="w-8 h-8" />
                </Link>
                <span className="text-gray-600">•</span>
                <Link href="#" className="text-gray-400 hover:text-[#f3ba2f]">
                  <FaInstagram className="w-8 h-8" />
                </Link>
              </div>
            </div>

            <div className="flex flex-col justify-center lg:items-end items-center lg:justify-end gap-4">
              <nav className="flex items-center gap-4">
                <Link
                  href="#"
                  className="text-l text-gray-400 hover:text-[#f3ba2f]"
                >
                  Learn
                </Link>
                <span className="text-gray-600">•</span>
                <Link
                  href="#"
                  className="text-l text-gray-400 hover:text-[#f3ba2f]"
                >
                  FAQ
                </Link>
                <span className="text-gray-600">•</span>
                <Link
                  href="#"
                  className="text-l text-gray-400 hover:text-[#f3ba2f]"
                >
                  Support
                </Link>
              </nav>
            </div>
          </section>
          <section className="flex justify-center items-center pt-4 l:pt-6 border-t w-full border-white border-opacity-20">
            <div className="text-gray-400">
              © {new Date().getFullYear()} Tether Ventures. All rights reserved.
            </div>
          </section>
        </div>
      </Container>
    </footer>
  );
}
