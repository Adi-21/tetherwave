"use client";

import { memo, useCallback, useEffect } from "react";
import SocialLinks from "../SocialLinks";
import Link from "next/link";
import ProfileDetails from "./ProfileDetails";
import WalletDetails from "./WalletDetails";
import Registration from "./Registration";
import Packages from "./Packages";
import AllIncomes from "./AllIncomes";
import RankIncome from "./RankIncome/RankIncome";
import RecentIncome from "./RecentIncome/RecentIncome";
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '@/store';
import { setReferrerAddress, setCurrentPage, fetchDashboardData, registerUser, upgradeUser } from '@/store/features/dashboardSlice';
import { toast } from 'react-hot-toast';
import { useAccount, useBalance } from 'wagmi';
import { truncateAddress } from "@/lib/utils/format";


const DashboardPage = memo(() => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    isLoading,
    userStatsData,
    levelIncomesData,
    itemsPerPage,
    referrerAddress,
    currentPage,
    recentIncomes,
    directSponsor,
    matrixSponsor,
    isRegistered
  } = useSelector((state: RootState) => state.dashboard);

  const { address } = useAccount();

  const { data: usdtBalance, refetch: refetchBalance } = useBalance({
    address,
    token: '0xe6Ad72C499ce626b10De645E25BbAb40C5A34C9f',
  });

  const balances = {
    usdt: usdtBalance?.formatted || '0.0'
  };

  useEffect(() => {
    if (address) {
      void dispatch(fetchDashboardData(address));
    }
  }, [address, dispatch]);

  const handleRegister = useCallback(async (referrerAddress: string) => {
    if (!address || !referrerAddress) {
      toast.error("Missing address or referrer address");
      return;
    }

    try {
      // Show initial registration toast
      const loadingToast = toast.loading('Registration Started', {
        position: 'top-center'
      });

      await dispatch(registerUser({ 
        referrerAddress, 
        balance: balances.usdt,
        userAddress: address 
      })).unwrap();

      // Dismiss the loading toast
      toast.dismiss(loadingToast);

      // Show processing toast
      const processingToast = toast.loading('Registration is in processing...', {
        position: 'top-center'
      });

      // Wait for transaction confirmation
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Dismiss the processing toast
      toast.dismiss(processingToast);

      // Show success toast
      toast.success("Registration successful!", {
        duration: 5000,
        position: 'top-center',
        style: {
          background: '#DCFCE7',
          color: '#166534',
          border: '1px solid #166534'
        }
      });
    } catch (error: unknown) {
      console.error('Registration error:', error);
      const errorMessage = error instanceof Error ? error.message : 
        typeof error === 'object' && error && 'message' in error ? error.message : 
        'Registration failed';
      toast.error(errorMessage, {
        duration: 5000,
        position: 'top-center',
        style: {
          background: '#FEE2E2',
          color: '#DC2626',
          border: '1px solid #DC2626'
        }
      });
    }
  }, [address, balances.usdt, dispatch]);

  const handleUpgrade = useCallback(async (targetLevel: number) => {
    if (!address) return;

    try {
        const loadingToast = toast.loading('Upgrade Started', {
            position: 'top-center'
        });

        await dispatch(upgradeUser({ 
            targetLevel, 
            balance: balances.usdt,
            userAddress: address
        })).unwrap();

        toast.dismiss(loadingToast);

        const processingToast = toast.loading('Upgrade level is in processing...', {
            position: 'top-center'
        });

        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Refresh balance after transaction
        await refetchBalance();
        
        toast.dismiss(processingToast);
        toast.success(`Successfully upgraded to Level ${targetLevel}!`, {
            duration: 5000,
            position: 'top-center',
            style: {
                background: '#DCFCE7',
                color: '#166534',
                border: '1px solid #166534'
            }
        });
    } catch (error: unknown) {
        console.error('Upgrade error in component:', error);
        const errorMessage = error instanceof Error ? error.message : 
            typeof error === 'object' && error && 'message' in error ? error.message : 
            'Upgrade failed';
        toast.error(errorMessage, {
            duration: 5000,
            position: 'top-center',
            style: {
                background: '#FEE2E2',
                color: '#DC2626',
                border: '1px solid #DC2626'
            }
        });
    }
  }, [address, balances.usdt, dispatch, refetchBalance]);

  const levelIncomes = levelIncomesData.map(val => BigInt(val));

  return (
    <div className="flex flex-col justify-center items-center gap-4 w-full overflow-hidden">
      <div className="lg:hidden flex justify-between items-center w-full drop-shadow-lg lg:p-4 pb-2 ps-5">
        <SocialLinks />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 text-nowrap w-full">
        <ProfileDetails
          userProfileData={null}
          isLoading={isLoading}
          currentLevel={userStatsData?.currentLevel || 0}
          directSponsorId={truncateAddress(directSponsor?.directSponsor[0] || '0x')}
          matrixSponsorId={truncateAddress(matrixSponsor?.matrixSponsor[0] || '0x')}
        />
        <WalletDetails
          address={address}
          usdtBalance={balances.usdt}
          referralCode={address || '0x'}
        />
      </div>

      {!isRegistered && (
        <Registration
          referrerAddress={referrerAddress}
          setReferrerAddress={(address: string) => void dispatch(setReferrerAddress(address))}
          handleRegister={() => void handleRegister(referrerAddress)}
        />
      )}
      
      <Packages 
        currentLevel={userStatsData?.currentLevel || 0} 
        handleUpgrade={handleUpgrade} 
      />

      <AllIncomes
        userStats={userStatsData}
        upgradeReferralIncome={null}
        totalTeamSize={2}
        isLoading={isLoading}
      />
      <RankIncome 
        userStats={userStatsData}
        levelIncomes={levelIncomes}
        isLoading={isLoading}
      />
      {/* <section className="mt-4 lg:mt-8 w-full">
        <h3 className="text-2xl lg:text-5xl font-bold pb-4 lg:pb-8 text-center text-3d dark:text-3d-dark bg-gradient-to-r from-pink via-purple to-blue text-transparent/10 bg-clip-text">
          Fortune Founder Reward
        </h3>
        <RoyaltySlab />
      </section> */}
      <RecentIncome
        recentIncomes={recentIncomes}
        currentLevel={userStatsData?.currentLevel || 0}
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
