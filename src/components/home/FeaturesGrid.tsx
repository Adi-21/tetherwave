import React from "react";
import Container from "../common/Container";

const FeaturesGrid = () => {
  return (
    <div className="py-20 lg:py-24">
      <Container>
        <div className="grid lg:grid-cols-2 gap-4 lg:gap-8">
          {[
            {
              title: "Direct Referral Rewards",
              description:
                "Earn $10 instantly for each direct referral who joins with an $11 deposit. Build your first line of network with 3 direct referrals.",
              stats: "$547,230 Total Rewards Paid",
              bg: "bg-[radial-gradient(129.96%_104.38%_at_43.18%_37.89%,_#d16fff33_0,_#fc6fff07_100%)]",
            },
            {
              title: "Network Growth Bonus",
              description:
                "As your network grows deeper, earn additional rewards from indirect referrals. Expand your earning potential through multiple levels.",
              stats: "12,547 Active Networks",
              bg: "bg-[radial-gradient(122.64%_113.99%_at_50%_50%,_#5aff882b_0,_#5aff8800_100%)]",
            },
            {
              title: "Team Performance Rewards",
              description:
                "Unlock special bonuses when your team reaches certain milestones. Higher network activity means greater rewards.",
              stats: "432 Top Performers",
              bg: "bg-[radial-gradient(165.59%_161.07%_at_52.72%_2.21%,_#0085ff29_0,_#0085ff07_100%)]",
            },
            {
              title: "Smart Contract Security",
              description:
                "Your investments and rewards are secured by blockchain technology. Transparent, immutable, and automatically executed rewards system.",
              stats: "$2.3M Total TVL",
              bg: "bg-[radial-gradient(130%_120%_at_50%_50%,_#ff9b8f33_0,_#ff9b8f00_100%)]",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className={`rounded-3xl px-4 lg:px-8 py-8 lg:py-12 drop-shadow-lg border border-white border-opacity-10 ${feature.bg}`}
            >
              <h3 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-6">
                {feature.title}
              </h3>
              <p className="lg:text-xl text-gray-400 mb-4 lg:mb-6">
                {feature.description}
              </p>
              <div className="text-xl lg:text-2xl font-bold text-[#f3ba2f]">
                {feature.stats}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default FeaturesGrid;
