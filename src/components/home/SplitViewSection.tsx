"use client";

import Container from "../common/Container";
import { GoDot } from "react-icons/go";

export function SplitViewSection() {
  return (
    <Container>
      <div className="relative w-full">
        <div className="grid lg:grid-cols-2 gap-4 lg:gap-8 border-y w-full border-white border-opacity-20">
          <div className="lg:sticky lg:top-10 lg:self-start lg:h-[calc(125vh-40px)]">
            <div className="lg:pe-12 py-10 lg:py-20">
              <h2 className="text-3xl lg:text-6xl font-bold mb-4 lg:mb-8">
                Why Choose
                <br />
                Tether Waves?
              </h2>
              <p className="text-lg lg:text-2xl text-gray-400 mb-6 lg:mb-8">
                Join the fastest growing referral network and unlock unlimited
                earning potential.
              </p>
              <div className="space-y-4 lg:space-y-6">
                {points.map((point, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-6 h-6 lg:w-6 lg:h-6 rounded-full bg-[#f3ba2f]/80 flex items-center justify-center">
                      <span className="text-xs lg:text-xs font-bold">
                        {point.icon}
                      </span>
                    </div>
                    <div className="text-sm lg:text-base font-semibold">
                      {point.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative lg:ps-16 py-10 lg:py-20 space-y-12 lg:space-y-20 w-full border-t lg:border-t-0 lg:border-l border-white border-opacity-20">
            {sections.map((section, index) => (
              <div key={`${index + 1}`} className="">
                <div className="space-y-2 lg:space-y-4 mb-6 lg:mb-10">
                  <div className="flex gap-1 items-center">
                    <GoDot className="text-xl lg:text-2xl" />
                    <h3 className="text-2xl lg:text-4xl font-bold">
                      {section.title}
                    </h3>
                  </div>
                  <p className="text-base lg:text-xl text-gray-400">
                    {section.description}
                  </p>
                </div>
                <div className="space-y-6 lg:space-y-8">
                  {section.items.map((item, idx) => (
                    <div key={`${idx + 1}`} className="space-y-2 lg:space-y-4">
                      <div className="text-xl lg:text-3xl font-semibold">
                        {item.heading}
                      </div>
                      <p className="text-base lg:text-xl text-gray-400">
                        {item.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}

const sections = [
  {
    title: "Simple 3-Step Process",
    description: "Getting started is easier than ever",
    items: [
      {
        heading: "1. Initial Deposit",
        content:
          "Start your journey with just $11. This one-time deposit activates your network potential.",
      },
      {
        heading: "2. Build Your Network",
        content:
          "Invite 3 direct referrals to join your network. Each successful referral earns you $10 instantly.",
      },
      {
        heading: "3. Expand & Earn",
        content:
          "As your network grows, unlock additional rewards and bonuses at each level.",
      },
    ],
  },
  {
    title: "Reward Structure",
    description: "Multiple ways to earn with our platform",
    items: [
      {
        heading: "1. Direct Referral Bonus",
        content:
          "Earn $10 instantly for each direct referral who joins with an $11 deposit.",
      },
      {
        heading: "2. Direct Level Upgrade Bonus",
        content:
          "Whenever your direct referral upgrades to the next level, you earn 50% of each upgrade package value.",
      },
      {
        heading: "3. Fortune Founder Reward",
        content:
          "Unlock special bonuses when your team reaches certain milestones.",
      },
    ],
  },
  {
    title: "Security First",
    description: "Your investment is protected",
    items: [
      {
        heading: "1. Smart Contract Security",
        content:
          "All transactions and rewards are secured by blockchain technology.",
      },
      {
        heading: "2. Transparent System",
        content:
          "Every transaction and reward distribution is visible on the blockchain.",
      },
    ],
  },
];

const points = [
  { icon: "$", text: "Low Entry Barrier - Start with just $11" },
  { icon: "3x", text: "Triple Referral System" },
  { icon: "∞", text: "Unlimited Earning Potential" },
  { icon: "💯", text: "100% Decentralized Crypto Platform" },
  { icon: "✔️", text: "Safe and Secure" },
  { icon: "📈", text: "Stable Career-Building Forever Plan" },
  { icon: "🛡️", text: "Risk-Free and Zero Liquidity Issues" },
  { icon: "⚡", text: "Instant Live Distribution via Blockchain" },
  { icon: "🚫", text: "Scam-Free Platform" },
  { icon: "💵", text: "Stable Income in USDT" },
  { icon: "📉", text: "No Pump and Dump Market Risks" },
];
