import { useState, useMemo, useEffect } from "react";
import type { RecentIncomeEvents } from "@/types/contract";

export const useDashboardData = () => {
  const [referrerAddress, setReferrerAddress] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  
  const itemsPerPage = 5;

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);

  // Hardcoded data for now
  const recentIncomesData = useMemo((): RecentIncomeEvents => ({
    userAddresses: [],
    incomeTypes: [],
    levelNumbers: [],
    amounts: [],
    timestamps: [],
    totalCount: 0
  }), []);

  const userStatsData = useMemo(() => ({
    directReferrals: 0,
    directCommissionEarned: BigInt(0),
    currentLevel: 0,
    totalEarnings: BigInt(0),
    levelIncomeEarned: BigInt(0),
    magicIncome: BigInt(0),
    timestamp: Math.floor(Date.now() / 1000)
  }), []);

  const levelIncomesData = useMemo(() => 
    Array(10).fill(BigInt(0))
  , []);

  return {
    referrerAddress,
    setReferrerAddress,
    currentPage,
    setCurrentPage,
    recentIncomes: recentIncomesData,
    userStatsData,
    levelIncomesData,
    isLoading,
    itemsPerPage
  };
}; 