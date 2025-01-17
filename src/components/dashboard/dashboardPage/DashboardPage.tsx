"use client";

import { memo, useCallback, useEffect } from "react";
import SocialLinks from "../SocialLinks";
import ProfileDetails from "./ProfileDetails";
import WalletDetails from "./WalletDetails";
import Registration from "./Registration";
import Packages from "./Packages";
import AllIncomes from "./AllIncomes";
import RankIncome from "./RankIncome/RankIncome";
import RecentIncome from "./RecentIncome/RecentIncome";
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '@/store';
import { setReferrerAddress, register, upgrade, setRecentIncomePage, fetchRecentIncomeData, fetchRankIncomeData, fetchProfileData, fetchAllIncomesData, fetchPackagesData, fetchWalletData } from '@/store/features/dashboardSlice';
import { toast } from 'react-hot-toast';
import { useAccount } from 'wagmi';
import { truncateAddress } from "@/lib/utils/format";
import type { DashboardState } from '@/store/features/dashboardSlice';
import { useUSDTBalance } from '@/hooks/useUSDTBalance';

const DashboardPage = memo(() => {
  const dispatch = useDispatch<AppDispatch>();
  const { address } = useAccount();
  const { balance: usdtBalance, formatted: usdtFormatted, refetch: refetchBalance } = useUSDTBalance(address as `0x${string}`);

  const balances = {
    usdt: usdtFormatted || '0.0'
  };

  useEffect(() => {
    if (address) {
      Promise.all([
        dispatch(fetchProfileData(address)),
        dispatch(fetchWalletData(address)),
        dispatch(fetchAllIncomesData(address)),
        dispatch(fetchRankIncomeData(address)),
        dispatch(fetchPackagesData(address)),
        dispatch(fetchRecentIncomeData({
          address,
          page: 1,
          itemsPerPage: 5
        }))
      ]).catch((error) => {
        console.error('Error fetching data:', error);
      });
    }
  }, [dispatch, address]);

  const {
    profile,
    wallet,
    registration,
    packages,
    allIncomes,
    rankIncome,
    recentIncome
  } = useSelector((state: RootState) => state.dashboard as DashboardState);

  const handleRegister = useCallback(async (referrerAddress: string) => {
    if (!address || !referrerAddress) {
      toast.error("Missing address or referrer address");
      return;
    }

    try {
      const loadingToast = toast.loading('Registration Started', {
        position: 'top-center'
      });

      await dispatch(register({
        referrerAddress,
        balance: balances.usdt,
        userAddress: address
      })).unwrap();

      toast.dismiss(loadingToast);

      const processingToast = toast.loading('Registration is in processing...', {
        position: 'top-center'
      });

      await new Promise(resolve => setTimeout(resolve, 5000));
      await refetchBalance();
      toast.dismiss(processingToast);

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
        typeof error === 'object' && error && 'message' in error ? String(error.message) :
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
  }, [address, balances.usdt, dispatch, refetchBalance]);

  const handleUpgrade = useCallback(async (targetLevel: number) => {
    if (!address || !usdtBalance) return;

    try {
      const loadingToast = toast.loading('Upgrade Started', {
        position: 'top-center'
      });

      await dispatch(upgrade({
        targetLevel,
        userAddress: address,
        balance: usdtFormatted
      })).unwrap();

      await refetchBalance();
      toast.dismiss(loadingToast);

      const processingToast = toast.loading('Upgrade level is in processing...', {
        position: 'top-center'
      });

      await new Promise(resolve => setTimeout(resolve, 5000));
      await Promise.all([
        dispatch(fetchProfileData(address)),
        dispatch(fetchPackagesData(address))
      ]);
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
      console.error('Upgrade error:', error);
      toast.dismiss();

      const errorMessage = error instanceof Error ? error.message :
        typeof error === 'string' ? error : 'Upgrade failed';

      toast.error(errorMessage, {
        duration: 5000,
        position: 'top-center',
        style: {
          background: '#FEE2E2',
          color: '#DC2626',
          border: '1px solid #DC2626',
          whiteSpace: 'pre-line',
          textAlign: 'center',
          padding: '1rem',
          fontWeight: 'bold'
        }
      });
    }
  }, [address, usdtFormatted, dispatch, usdtBalance, refetchBalance]);

  const handlePageChange = useCallback((page: number) => {
    dispatch(setRecentIncomePage(page));
    if (address) {
      dispatch(fetchRecentIncomeData({
        address,
        page,
        itemsPerPage: recentIncome.pagination.itemsPerPage
      }));
    }
  }, [address, dispatch, recentIncome.pagination.itemsPerPage]);

  return (
    <div className="flex flex-col justify-center items-center gap-4 w-full overflow-y-auto overflow-x-hidden scroll-smooth">
      <div className="lg:hidden flex justify-between items-center w-full drop-shadow-lg lg:p-4 pb-2 ps-5">
        <SocialLinks />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 text-nowrap w-full">
        <ProfileDetails
          userProfileData={{
            frontend_id: truncateAddress(address || '0x'),
            isLoading: profile.isLoading
          }}
          isLoading={profile.isLoading}
          currentLevel={profile.data.currentLevel}
          levelName={profile.data.levelName}
          directSponsorId={truncateAddress(profile.data.directSponsor)}
          matrixSponsorId={truncateAddress(profile.data.matrixSponsor)}
        />
        <WalletDetails
          address={address || '0x'}
          referralCode={wallet.data.referralCode || address || '0x'}
        />
      </div>

      {!profile.data.currentLevel && (
        <Registration
          referrerAddress={registration.referrerAddress}
          setReferrerAddress={(address: string) => dispatch(setReferrerAddress(address))}
          handleRegister={() => void handleRegister(registration.referrerAddress)}
        />
      )}

      <Packages
        currentLevel={packages.currentLevel}
        handleUpgrade={handleUpgrade}
        isLoading={packages.isLoading}
      />

      <AllIncomes
        userStats={{
          totalEarnings: allIncomes.data.totalIncome,
          directCommissionEarned: allIncomes.data.referralIncome,
          levelIncomeEarned: allIncomes.data.levelIncome,
          directReferrals: allIncomes.data.directReferrals,
          currentLevel: profile.data.currentLevel,
          timestamp: Math.floor(Date.now() / 1000),
          totalTeamSize: allIncomes.data.totalTeamSize
        }}
        upgradeReferralIncome={BigInt(allIncomes.data.upgradeReferralIncome)}
        totalTeamSize={allIncomes.data.totalTeamSize}
        isLoading={allIncomes.isLoading}
      />

      <RankIncome
        userStats={{
          totalEarnings: rankIncome.data.levelIncomes.reduce(
            (acc, val) => acc + (typeof val === 'string' ? BigInt(val.replace(/,/g, '')) : BigInt(0)),
            BigInt(0)
          ).toString(),
          directCommissionEarned: rankIncome.data.directCommission,
          levelIncomeEarned: rankIncome.data.levelIncomes.reduce(
            (acc, val) => acc + (typeof val === 'string' ? BigInt(val.replace(/,/g, '')) : BigInt(0)),
            BigInt(0)
          ).toString(),
          directReferrals: allIncomes.data.directReferrals,
          currentLevel: profile.data.currentLevel,
          timestamp: Math.floor(Date.now() / 1000),
          totalTeamSize: allIncomes.data.totalTeamSize
        }}
        levelIncomes={rankIncome.data.levelIncomes.map(val =>
          typeof val === 'string' ? BigInt(val.replace(/,/g, '')) : BigInt(0)
        )}
        isLoading={rankIncome.isLoading || profile.isLoading}
      />

      <RecentIncome
        recentIncomes={recentIncome.data}
        currentLevel={profile.data.currentLevel}
        currentPage={recentIncome.pagination.currentPage}
        setCurrentPage={handlePageChange}
        itemsPerPage={recentIncome.pagination.itemsPerPage}
        isLoading={recentIncome.isLoading}
      />
    </div>
  );
});

DashboardPage.displayName = "DashboardPage";

export default DashboardPage;
