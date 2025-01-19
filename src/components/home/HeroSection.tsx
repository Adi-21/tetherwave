import React from "react";
import Image from "next/image";
import Container from "../common/Container";
import { FlipWords } from "../ui/FlipWords";

const HeroSection = () => {
  return (
    <section className="relative flex items-center pt-20 lg:pt-16 min-h-screen w-full overflow-hidden">
      <Container>
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-28 justify-center items-center h-full w-full">
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-[#f3ba2f] opacity-20 blur-3xl rounded-full animate-pulse" />
            {/* Saturn Rings */}
            <div className="absolute inset-0 flex items-center justify-center w-full h-full">
              <div className="w-[100%] h-[100%] border border-[#f3ba2f]/5 rounded-full absolute animate-spin-slow" />
              <div className="w-[120%] h-[120%] border border-[#f3ba2f]/10 rounded-full absolute animate-spin-slower" />
              <div className="w-[140%] h-[140%] border border-[#f3ba2f]/5 rounded-full absolute animate-reverse-spin" />
            </div>
            <div>
              <Image
                src="/images/landingpage.png"
                alt="tether Logo Animation"
                width={400}
                height={400}
                quality={100}
                priority
                className="object-contain relative z-10 w-full"
              />
            </div>
          </div>
          <div className="space-y-3 lg:space-y-4 lg:mb-12">
            <div className="text-4xl lg:text-6xl">
              <div className="lg:text-7xl font-bold ">
                <FlipWords
                  words={["Expand", "Excel"]}
                  className="!text-[#f3ba2f] !px-0"
                />
              </div>
              <h1 className="font-semibold">
                <span className="leading-tight">Earning with</span>
                <br />
                <span className="leading-tight font-extrabold">
                  Tether Waves
                </span>
              </h1>
            </div>
            <p className="lg:text-xl text-gray-400">
               World&apos;s first fully decentralized community building platform.
            </p>
            <div className="flex gap-8">
              <div className="">
                <span className="text-2xl lg:text-3xl font-semibold">3.0%</span>{" "}
                <br />
                <span className="opacity-80">APR</span>
              </div>
              <div className="">
                <span className="text-2xl lg:text-3xl font-semibold">
                  $32,227,733,224
                </span>{" "}
                <br />
                <span className="opacity-80">TVL</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HeroSection;
