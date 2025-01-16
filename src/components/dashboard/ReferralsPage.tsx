"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAccount } from "wagmi";
import { fetchReferralData, setCurrentPage } from "@/store/features/referralsSlice";
import { LEVELS } from "@/lib/constants/levels";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReferralData } from "@/types/contract";
import type { AppDispatch, RootState } from "@/store";
import { FrontendIdDisplay } from "./FrontendIdDisplay";

const ReferralsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { address } = useAccount();
  const { referralData, totalCount, currentPage, isLoading } = useSelector(
    (state: RootState) => state.referrals
  );
  const itemsPerPage = 10;

  useEffect(() => {
    if (address) {
      dispatch(fetchReferralData({ address, page: currentPage, itemsPerPage }));
    }
  }, [address, currentPage, dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 rounded-lg drop-shadow-lg shadow bg-light-gradient dark:bg-dark-gradient w-full">
      <div className="overflow-y-auto text-nowrap pb-1">
        <table className="w-full">
          <thead className="overflow-y-auto drop-shadow-lg bg-white/40 dark:bg-white/5">
            <tr>
              <th className="py-2 px-4 text-left">S.No</th>
              <th className="py-2 px-4 text-left">Address</th>
              <th className="py-2 px-4 text-left">Activation Date</th>
              <th className="py-2 px-4 text-left">Level</th>
              <th className="py-2 px-4 text-left">Direct Team</th>
            </tr>
          </thead>
          <tbody>
            {referralData.map((referral: ReferralData, index: number) => (
              <tr
                key={`referral-${index + 1}`}
                className="hover:bg-white/20 dark:hover:bg-white/10"
              >
                <td className="py-2 px-4">{index + 1}</td>
                <td className="py-2 px-4">
                  <FrontendIdDisplay address={referral.userAddress} isRegistered={referral.currentLevel > 0} />
                </td>
                <td className="py-2 px-4">
                  {new Date(
                    referral.activationTime * 1000
                  ).toLocaleDateString()}
                </td>
                <td className="py-2 px-4">
                  {LEVELS[referral.currentLevel - 1]?.name ||
                    `Level ${referral.currentLevel}`}
                </td>
                <td className="py-2 px-4">{referral.directReferrals}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {referralData.length === 0 && (
          <p className="text-gray-500 text-center mt-4">
            No referral data available.
          </p>
        )}
        <div className="flex justify-between items-center gap-8 mt-4 w-full text-nowrap">
          <div className="text-sm text-gray-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, totalCount)} of{" "}
            {totalCount} entries
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => dispatch(setCurrentPage(currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft />
            </button>
            <div className="px-3 py-1 rounded bg-gradient-button text-white">
              {currentPage} of{" "}
              {Math.ceil(totalCount / itemsPerPage)}
            </div>
            <button
              type="button"
              onClick={() => dispatch(setCurrentPage(currentPage + 1))}
              disabled={
                currentPage === Math.ceil(totalCount / itemsPerPage)
              }
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralsPage;
