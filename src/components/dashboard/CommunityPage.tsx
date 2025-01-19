"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAccount } from "wagmi";
import { fetchDownlineData, setSelectedLevel, setCurrentPage } from "@/store/features/communitySlice";
import type { AppDispatch, RootState } from "@/store";
import { FrontendIdDisplay } from "./FrontendIdDisplay";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CommunityPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { address } = useAccount();
  const { downlineData, selectedLevel, currentPage, isLoading } = useSelector(
    (state: RootState) => state.community
  );
  const itemsPerPage = 5;

  useEffect(() => {
    if (address) {
      dispatch(fetchDownlineData({ address, level: selectedLevel, page: currentPage, itemsPerPage }));
    }
  }, [address, selectedLevel, currentPage, dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full">
      <div className="p-4 rounded-lg drop-shadow-lg shadow bg-light-gradient dark:bg-dark-gradient w-full">
        <div className="flex justify-start gap-4 overflow-x-auto">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((level) => (
            <button
              type="button"
              key={level}
              onClick={() => {
                dispatch(setSelectedLevel(level));
                dispatch(setCurrentPage(1));
              }}
              className={`py-2 px-6 rounded bg-gradient-button text-white ${
                selectedLevel === level ? "opacity-100" : "opacity-50"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <section className="mt-4 p-4 rounded-lg drop-shadow-lg shadow bg-light-gradient dark:bg-dark-gradient">
        <div className="overflow-y-auto text-nowrap pb-1">
          <table className="w-full mt-4 border-collapse">
            <thead className="overflow-y-auto drop-shadow-lg bg-white/40 dark:bg-white/5">
              <tr>
                <th className="py-2 px-4 text-left">S.No.</th>
                <th className="py-2 px-4 text-left">Address</th>
                <th className="py-2 px-4 text-left">Sponsor</th>
                <th className="py-2 px-4 text-left">Direct Referral</th>
                <th className="py-2 px-4 text-left">Current Levels</th>
              </tr>
            </thead>
            <tbody>
              {downlineData.downlineAddresses.map((address, index) => (
                <tr
                  key={`${index + 1}`}
                  className="hover:bg-white/20 dark:hover:bg-white/10"
                >
                  <td className="py-2 px-8 text-left">{index + 1}</td>
                  <td className="py-2 px-4 text-left">
                    <FrontendIdDisplay address={address} isRegistered={true} />
                  </td>
                  <td className="py-2 px-4 text-left">
                    <FrontendIdDisplay
                      address={downlineData.sponsorAddresses[index]}
                      isRegistered={true}
                    />
                  </td>
                  <td className="py-2 px-16 text-left">
                    {downlineData.directReferralsCount[index]}
                  </td>
                  <td className="py-2 px-16 text-left">
                    {downlineData.currentLevels[index]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {downlineData.downlineAddresses.length === 0 && (
            <p className="text-gray-500 text-center mt-4">
              No downline data available for this level.
            </p>
          )}

          <div className="flex justify-between items-center mt-4 gap-4 w-full">
            <div className="text-sm text-gray-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, downlineData.totalCount)} of{" "}
              {downlineData.totalCount} entries
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => dispatch(setCurrentPage(currentPage - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded drop-shadow shadow ${
                  currentPage === 1 ? "bg-gray-300 text-gray-600 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed" : "bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-300 hover:bg-opacity-80 dark:hover:bg-opacity-80"
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="px-3 py-1 rounded drop-shadow shadow bg-gradient-button text-white">
                {currentPage} of{" "}
                {Math.ceil(downlineData.totalCount / itemsPerPage)}
              </div>
              <button
                type="button"
                onClick={() =>
                  dispatch(setCurrentPage(currentPage + 1))
                }
                disabled={
                  currentPage ===
                  Math.ceil(downlineData.totalCount / itemsPerPage)
                }
                className={`px-3 py-1 rounded drop-shadow shadow ${
                  currentPage ===
                  Math.ceil(downlineData.totalCount / itemsPerPage)
                    ? "bg-gray-300 text-gray-600 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
                    : "bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-300 hover:bg-opacity-80 dark:hover:bg-opacity-80"
                }`}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CommunityPage;
