"use client";

import { LuCoins } from "react-icons/lu";
import { BsDroplet } from "react-icons/bs";
import { GiWallet } from "react-icons/gi";

import { motion } from "framer-motion";
import Container from "../common/Container";

export default function HowItWorks() {
  const steps = [
    {
      icon: <LuCoins className="w-8 h-8" />,
      title: "Refer",
      subtitle: "Refer Your Friends",
    },
    {
      icon: <BsDroplet className="w-8 h-8 text-blue-400" />,
      title: "Earn",
      subtitle: "Receive Rewards and Bonuses for Each Referral",
    },
    {
      icon: <GiWallet className="w-8 h-8" />,
      title: "Grow",
      subtitle: "Boost Network",
    },
  ];

  // Animation variants for steps
  const stepVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.3, // Stagger animation
      },
    }),
  };

  return (
    <section className="relative py-16 lg:py-24">
      <Container>
        <motion.div
          className="flex flex-col lg:flex-row justify-between items-start relative gap-8 w-full"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="absolute top-0 left-[40px] lg:top-[50px] lg:left-[15%] lg:right-[15%] w-px lg:w-auto h-full lg:h-px bg-gray-400">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
              viewport={{ once: true, amount: 0.2 }}
              className="w-full h-full bg-gray-400"
            />
          </div>

          {steps.map((step, index) => (
            <motion.div
              key={`${index + 1}`}
              className="relative z-10 text-center flex-1"
              custom={index}
              variants={stepVariant}
            >
              <div className="inline-flex lg:flex-col justify-between items-start lg:items-center gap-8">
                <div className="bg-gray-600 p-4 rounded-full border">
                  <div className="w-12 lg:w-16 h-12 lg:h-16 rounded-full flex items-center justify-center">
                    {step.icon}
                  </div>
                </div>
                <div className="text-left lg:text-center w-full mt-1">
                  <h2 className="text-4xl lg:text-6xl font-medium mb-1 lg:mb-4">
                    {step.title}
                  </h2>
                  <p className="lg:text-2xl text-gray-400">{step.subtitle}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
