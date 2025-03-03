"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAccount } from "wagmi";
import { fetchDownlineData, setSelectedLevel, setCurrentPage } from "@/store/features/communitySlice";
import type { AppDispatch, RootState } from "@/store";
import { FrontendIdDisplay } from "./FrontendIdDisplay";
import Skeleton from "../common/Skeleton";
import Pagination from "../common/Pagination";
import { LEVELS } from "@/lib/constants";

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

  const totalPages = Math.ceil(downlineData.totalCount / itemsPerPage);
  const startEntry = (currentPage - 1) * itemsPerPage + 1;
  const endEntry = Math.min(currentPage * itemsPerPage, downlineData.totalCount);

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
              className={`py-2 px-6 rounded bg-gradient-button text-white ${selectedLevel === level ? "opacity-100" : "opacity-50"
                }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <section className="mt-4 p-4 rounded-lg drop-shadow-lg shadow bg-gradient">
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
          <div className="overflow-y-auto text-nowrap pb-1 rounded-lg">
            <table className="w-full mt-4 border-collapse rounded-lg overflow-hidden">
              <thead>
                <tr className="p-4 bg-white/70 dark:bg-black/80 drop-shadow-lg shadow-md">
                  <th className="p-4 text-center">S.No.</th>
                  <th className="p-4 text-center">Address</th>
                  <th className="p-4 text-center">Sponsor</th>
                  <th className="p-4 text-center">Direct Referral</th>
                  <th className="p-4 text-center">Current Levels</th>
                </tr>
              </thead>
              <tbody>
                {downlineData.downlineAddresses.map((address, index) => (
                  <tr
                    key={`${index + 1}`}
                    className="bg-white/70 dark:bg-black/80 drop-shadow-lg shadow-md"
                  >
                    <td className="py-2 px-8 text-center">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="p-4 text-center">
                      <FrontendIdDisplay
                        address={address}
                        isRegistered={true}
                      />
                    </td>
                    <td className="p-4 text-center">
                      <FrontendIdDisplay
                        address={downlineData.sponsorAddresses[index]}
                        isRegistered={true}
                      />
                    </td>
                    <td className="py-2 px-16 text-center">
                      {downlineData.directReferralsCount[index]}
                    </td>
                    <td className="py-2 px-16 text-center">
                      {LEVELS[downlineData.currentLevels[index] - 1]?.name ||
                        `Level ${downlineData.currentLevels[index]}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {downlineData.downlineAddresses.length === 0 && (
              <p className="text-gray-500 text-center mt-4">
                No community data available for this level.
              </p>
            )}
            {totalPages > 1 && (
              <div className="mt-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => dispatch(setCurrentPage(page))}
                  startEntry={startEntry}
                  endEntry={endEntry}
                  totalCount={downlineData.totalCount}
                />
              </div>
            )}

          </div>
        )}
      </section>
    </div>
  );
};

export default CommunityPage;
