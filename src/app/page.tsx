import { Footer } from "@/components/common/Footer";
import Header from "@/components/common/Header";
import FeaturesGrid from "@/components/home/FeaturesGrid";
import HeroSection from "@/components/home/HeroSection";
import HowItWorks from "@/components/home/HowItWorks";
import { SplitViewSection } from "@/components/home/SplitViewSection";
import { GradientCursor } from "@/components/ui/GradientCursor";
import Image from "next/image";
import { metadata } from './metadata';

export { metadata };

export default function Home() {
  return (
    <main className="relative bg-black text-white w-full">
      <GradientCursor />
      <Header />
      <section className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-screen w-full overflow-hidden">
        <div className="w-full h-full">
          <Image
            src="/images/bnb-bg.png"
            alt="tether Logo Animation"
            width={1000}
            height={1000}
            quality={100}
            priority
            className="object-cover relative z-10 w-full h-full opacity-15"
          />
        </div>
      </section>
      <HeroSection />
      <SplitViewSection />
      <HowItWorks />
      <FeaturesGrid />
      <Footer />
    </main>
  );
}
