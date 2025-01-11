"use client";

import Container from "../common/Container";

export function SplitViewSection() {
  return (
    <Container>
      <div className="relative w-full">
        <div className="grid lg:grid-cols-2 gap-4 lg:gap-8 border-y w-full border-white border-opacity-20">
          <div className="lg:sticky lg:top-10 lg:self-start lg:h-[calc(100vh-40px)]">
            <div className="lg:pe-12 py-10 lg:py-20">
              <h2 className="text-3xl lg:text-6xl font-bold mb-4 lg:mb-8">
                Why Choose
                <br />
                Tether Ventures?
              </h2>
              <p className="text-lg lg:text-2xl text-gray-400 mb-6 lg:mb-8">
                Join the fastest growing referral network and unlock unlimited
                earning potential.
              </p>
              <div className="space-y-4 lg:space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#f3ba2f]/80 flex items-center justify-center">
                    <span className="text-xl lg:text-2xl font-bold">$</span>
                  </div>
                  <div className="text-lg lg:text-xl font-semibold">
                    Low Entry Barrier - Start with just $11
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#f3ba2f]/80 flex items-center justify-center">
                    <span className="text-xl lg:text-2xl font-bold">3x</span>
                  </div>
                  <div className="text-lg lg:text-xl font-semibold">
                    Triple Referral System
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#f3ba2f]/80 flex items-center justify-center">
                    <span className="text-xl lg:text-2xl font-bold">∞</span>
                  </div>
                  <div className="text-lg lg:text-xl font-semibold">
                    Unlimited Earning Potential
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative lg:ps-16 py-10 lg:py-20 space-y-12 lg:space-y-20 w-full border-t lg:border-t-0 lg:border-l border-white border-opacity-20">
            {sections.map((section, index) => (
              <div key={`${index + 1}`} className="">
                <div className="space-y-2 lg:space-y-4 mb-6 lg:mb-10">
                  <h3 className="text-3xl lg:text-4xl font-bold">
                    {section.title}
                  </h3>
                  <p className="text-lg lg:text-xl text-gray-400">
                    {section.description}
                  </p>
                </div>
                <div className="space-y-6 lg:space-y-8">
                  {section.items.map((item, idx) => (
                    <div key={`${idx + 1}`} className="space-y-2 lg:space-y-4">
                      <div className="text-2xl lg:text-3xl font-semibold">
                        {item.heading}
                      </div>
                      <p className="text-lg lg:text-xl text-gray-400">
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
        heading: "Direct Referral Bonus",
        content:
          "Earn $10 instantly for each direct referral who joins with an $11 deposit.",
      },
      {
        heading: "Network Growth Rewards",
        content:
          "Earn additional rewards as your network expands through multiple levels.",
      },
      {
        heading: "Performance Bonuses",
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
        heading: "Smart Contract Security",
        content:
          "All transactions and rewards are secured by blockchain technology.",
      },
      {
        heading: "Transparent System",
        content:
          "Every transaction and reward distribution is visible on the blockchain.",
      },
    ],
  },
];
