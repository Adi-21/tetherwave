import type { Metadata } from "next";
import "./globals.css";
import { inter, manrope } from "./font";

export const metadata: Metadata = {
  title: {
    default: "Tether - Liquid staking for digital assets",
    template: "%s | Tether - Liquid staking for digital assets",
  },
  description: "Stake your digital assets and earn daily rewards",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${manrope.variable} antialiased font-manrope`}
      >
        {children}
      </body>
    </html>
  );
}
