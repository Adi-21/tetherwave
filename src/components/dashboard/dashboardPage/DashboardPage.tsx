"use client";

import { useState, useMemo, useCallback } from "react";
import SocialLinks from "../SocialLinks";
import Link from "next/link";
import ProfileDetails from "./ProfileDetails";
import WalletDetails from "./WalletDetails";
import Registration from "./Registration";
import Packages from "./Packages";
import AllIncomes from "./AllIncomes";
import RankIncome from "./RankIncome";
import RoyaltySlab from "./RoyaltySlab";
import RecentIncome from "./RecentIncome";

const DashboardPage = () => {
  const [referrerAddress, setReferrerAddress] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const referralCode = "0x5275";
  const usdtBalance = "0.0";

  const itemsPerPage = 5;
  const handleRegister = useCallback(() => {}, []);
  const userProfileData = useMemo(() => null, []);
  const recentIncomes = useMemo(
    () => ({
      userAddresses: [],
      levelNumbers: [],
      amounts: [],
      timestamps: [],
      totalCount: 0,
    }),
    []
  );

  return (
    <div className="flex flex-col justify-center items-center gap-4 w-full overflow-hidden">
      <div className="lg:hidden flex justify-between items-center w-full drop-shadow-lg lg:p-4 pb-2 ps-5">
        <SocialLinks />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 text-nowrap w-full">
        <ProfileDetails
          userProfileData={userProfileData}
          currentLevel={1}
          directSponsorId={"0x"}
          matrixSponsorId={"0x"}
        />
        <WalletDetails
          address={"0x"}
          usdtBalance={usdtBalance}
          referralCode={referralCode}
        />
      </div>

      <Registration
        referrerAddress={referrerAddress}
        setReferrerAddress={setReferrerAddress}
        handleRegister={handleRegister}
      />

      <Packages currentLevel={1} handleUpgrade={() => {}} />

      <AllIncomes
        userStats={null}
        upgradeReferralIncome={null}
        totalTeamSize={2}
      />
      <RankIncome userStats={null} levelIncomes={[]} />
      <section className="mt-4 lg:mt-8 w-full">
        <h3 className="text-2xl lg:text-5xl font-bold pb-4 lg:pb-8 text-center text-3d dark:text-3d-dark bg-gradient-to-r from-pink via-purple to-blue text-transparent/10 bg-clip-text">
          Fortune Founder Reward
        </h3>
        <RoyaltySlab />
      </section>
      <RecentIncome
        {...{
          recentIncomes,
          currentLevel: 1,
          currentPage,
          setCurrentPage,
          itemsPerPage,
        }}
      />

      <div className="text-center text-xs lg:text-sm font-bold mt-4 lg:mt-8 mb-2 w-full">
        <p>TetherWave Contract opbnb.bscscan</p>
        <Link
          href="https://opbnb-testnet.bscscan.com/address/0xad7284Bf6fB1c725a7500C51b71847fEf2D2d17C"
          className="text-yellow-600 hover:underline"
        >
          (0xad7284Bf6fB1c725a7500C51b71847fEf2D2d17C)
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;
