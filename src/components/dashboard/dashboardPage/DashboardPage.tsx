"use client";

import { memo, useCallback, useMemo } from "react";
import SocialLinks from "../SocialLinks";
import Link from "next/link";
import ProfileDetails from "./ProfileDetails";
import WalletDetails from "./WalletDetails";
import Registration from "./Registration";
import Packages from "./Packages";
import AllIncomes from "./AllIncomes";
import RankIncome from "./RankIncome/RankIncome";
import RoyaltySlab from "./RoyaltySlab";
import RecentIncome from "./RecentIncome/RecentIncome";
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store';
import { setReferrerAddress, setCurrentPage } from '@/store/features/dashboardSlice';

const DashboardPage = memo(() => {
  const dispatch = useDispatch();
  const {
    isLoading,
    referrerAddress,
    currentPage,
    recentIncomes,
    userStatsData,
    levelIncomesData,
    itemsPerPage
  } = useSelector((state: RootState) => state.dashboard);

  // Memoize static values
  const staticProps = useMemo(() => ({
    referralCode: "0x5275",
    usdtBalance: "0.0",
    userProfileData: null,
    currentLevel: 1,
    directSponsorId: "0x",
    matrixSponsorId: "0x"
  }), []);

  const handleRegister = useCallback(() => {}, []);

  return (
    <div className="flex flex-col justify-center items-center gap-4 w-full overflow-hidden">
      <div className="lg:hidden flex justify-between items-center w-full drop-shadow-lg lg:p-4 pb-2 ps-5">
        <SocialLinks />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 text-nowrap w-full">
        <ProfileDetails
          userProfileData={staticProps.userProfileData}
          isLoading={isLoading}
          currentLevel={staticProps.currentLevel}
          directSponsorId={staticProps.directSponsorId}
          matrixSponsorId={staticProps.matrixSponsorId}
        />
        <WalletDetails
          isLoading={isLoading}
          address={"0x"}
          usdtBalance={staticProps.usdtBalance}
          referralCode={staticProps.referralCode}
        />
      </div>

      <Registration
        referrerAddress={referrerAddress}
        setReferrerAddress={(address) => dispatch(setReferrerAddress(address))}
        handleRegister={handleRegister}
      />

      <Packages currentLevel={staticProps.currentLevel} handleUpgrade={() => {}} />

      <AllIncomes
        userStats={userStatsData}
        upgradeReferralIncome={null}
        totalTeamSize={2}
        isLoading={isLoading}
      />
      <RankIncome 
        userStats={userStatsData}
        levelIncomes={levelIncomesData}
        isLoading={isLoading}
      />
      <section className="mt-4 lg:mt-8 w-full">
        <h3 className="text-2xl lg:text-5xl font-bold pb-4 lg:pb-8 text-center text-3d dark:text-3d-dark bg-gradient-to-r from-pink via-purple to-blue text-transparent/10 bg-clip-text">
          Fortune Founder Reward
        </h3>
        <RoyaltySlab />
      </section>
      <RecentIncome
        recentIncomes={recentIncomes}
        currentLevel={staticProps.currentLevel}
        currentPage={currentPage}
        setCurrentPage={(page: number) => dispatch(setCurrentPage(page))}
        itemsPerPage={itemsPerPage}
        isLoading={isLoading}
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
});

DashboardPage.displayName = "DashboardPage";

export default DashboardPage;
