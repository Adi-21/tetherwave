import React from "react";
import type { Metadata } from "next";
import RoyaltySlab from "@/components/dashboard/dashboardPage/RoyaltySlab";

export const metadata: Metadata = {
    title: "Royalty",
};

const Royalty = () => {
    return <>
        <section className="mt-2 lg:mt-4 w-full">
            <h3 className="text-2xl lg:text-5xl font-bold pb-4 lg:pb-8 text-center text-3d dark:text-3d-dark bg-gradient-to-r from-pink via-purple to-blue text-transparent/10 bg-clip-text">
                Fortune Founder Reward
            </h3>
            <RoyaltySlab />
        </section>
    </>;
};

export default Royalty;