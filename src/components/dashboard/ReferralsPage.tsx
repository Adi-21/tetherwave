"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAccount } from "wagmi";
import { fetchReferralData, setCurrentPage } from "@/store/features/referralsSlice";
import { LEVELS } from "@/lib/constants/levels";
import type { ReferralData } from "@/types/contract";
import type { AppDispatch, RootState } from "@/store";
import { FrontendIdDisplay } from "./FrontendIdDisplay";
import Skeleton from "../common/Skeleton";
import Pagination from "../common/Pagination";

const ReferralsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { address } = useAccount();
  const { referralData, totalCount, currentPage, isLoading } = useSelector(
    (state: RootState) => state.referrals
  );
  const itemsPerPage = 5;

  useEffect(() => {
    if (address) {
      dispatch(fetchReferralData({ address, page: currentPage, itemsPerPage }));
    }
  }, [address, currentPage, dispatch]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startEntry = (currentPage - 1) * itemsPerPage + 1;
  const endEntry = Math.min(currentPage * itemsPerPage, totalCount);

  return (
    <div className="p-4 rounded-lg drop-shadow-lg shadow bg-gradient w-full">
      {isLoading ? (
        <div className="flex flex-col justify-between items-center gap-4 p-4 rounded-lg bg-white/70 dark:bg-black/80 drop-shadow-lg shadow-md">
          {[...Array(4)].map((_, index) => (
            <div key={`${index + 1}`} className="h-10 lg:h-12 w-full">
              <div className="w-full h-full">
                <Skeleton className="h-full w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-y-auto text-nowrap pb-1">
          <table className="w-full rounded-lg overflow-hidden">
            <thead>
              <tr className="p-4 bg-white/70 dark:bg-black/80 drop-shadow-lg shadow-md">
                <th className="p-4 text-center">S.No</th>
                <th className="p-4 text-center">Address</th>
                <th className="p-4 text-center">Activation Date</th>
                <th className="p-4 text-center">Level</th>
                <th className="p-4 text-center">Direct Team</th>
              </tr>
            </thead>
            <tbody>
              {referralData.map((referral: ReferralData, index: number) => (
                <tr
                  key={`referral-${index + 1}`}
                  className="text-start p-4 rounded-lg bg-white/70 dark:bg-black/80 drop-shadow-lg shadow-md"
                >
                  <td className="py-2 px-8 text-center">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                  <td className="p-4 text-center">
                    <FrontendIdDisplay
                      address={referral.userAddress}
                      isRegistered={referral.currentLevel > 0}
                    />
                  </td>
                  <td className="p-4 text-center">
                    {new Date(
                      referral.activationTime * 1000
                    ).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </td>
                  <td className="p-4 text-center">
                    {LEVELS[referral.currentLevel - 1]?.name ||
                      `Level ${referral.currentLevel}`}
                  </td>
                  <td className="p-4 text-center">{referral.directReferrals}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {referralData.length === 0 && (
            <p className="text-gray-500 text-center mt-4">
              No referral data available.
            </p>
          )}

          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                startEntry={startEntry}
                endEntry={endEntry}
                totalCount={totalCount}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReferralsPage;
