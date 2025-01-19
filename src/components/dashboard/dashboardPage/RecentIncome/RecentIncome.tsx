import { memo } from "react";
import type { RecentIncomeEvents } from "@/types/contract";
import { LuHistory } from "react-icons/lu";
import Skeleton from "@/components/common/Skeleton";
import { formatEther } from "viem";
import { formatDistanceToNow } from "date-fns";
import Pagination from "./Pagination";
import { FrontendIdDisplay } from "@/components/dashboard/FrontendIdDisplay";

interface RecentIncomeProps {
  recentIncomes: RecentIncomeEvents;
  currentLevel: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  isLoading: boolean;
}

const RecentIncome = memo(
  ({
    recentIncomes,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    isLoading,
  }: RecentIncomeProps) => {
    const totalPages = Math.ceil(recentIncomes.totalCount / itemsPerPage);
    const startEntry = (currentPage - 1) * itemsPerPage + 1;
    const endEntry = Math.min( currentPage * itemsPerPage, recentIncomes.totalCount );

    return (
      <div className="mt-4 lg:mt-8 w-full">
        <div className="rounded-lg drop-shadow-lg shadow bg-gradient">
          <div className="flex items-center space-x-2 text-lg font-bold px-4 lg:px-6 pt-4 pb-2 lg:pt-6">
            <LuHistory className="h-5 w-5" />
            <span>Recent Income</span>
          </div>
          <div className="p-4 lg:px-6 lg:pb-6 flex flex-col gap-4">
            {isLoading ? (
              <div className="flex flex-col justify-between items-center gap-4 p-4 rounded-lg bg-white/70 dark:bg-black/80 drop-shadow-lg shadow-md">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="h-10 lg:h-12 w-full">
                    <div className="w-full h-full">
                      <Skeleton className="h-full w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentIncomes.userAddresses.length > 0 ? (
              <>
                <div className="overflow-x-auto space-y-4 rounded-lg">
                  <table className="w-full text-nowrap">
                    <thead>
                      <tr className="p-4 bg-white/70 dark:bg-black/80 drop-shadow-lg shadow-md">
                        <th className="p-4 text-start">Address</th>
                        <th className="p-4 text-start">Level Name</th>
                        <th className="p-4 text-start">Income Type</th>
                        <th className="p-4 text-start">Amount (USDT)</th>
                        <th className="p-4 text-start">Received</th>
                      </tr>
                    </thead>
                    <tbody className="bg-transparent">
                      {recentIncomes.userAddresses.map((address, index) => (
                        <tr
                          key={`${address}-${recentIncomes.timestamps[index]}`}
                          className="text-start p-4 rounded-lg bg-white/70 dark:bg-black/80 drop-shadow-lg shadow-md"
                        >
                          <td className="p-4">
                            <FrontendIdDisplay
                              address={address}
                              isRegistered={
                                Number(recentIncomes.levelNumbers[index]) > 0
                              }
                            />
                          </td>
                          <td className="p-4">
                            Level {recentIncomes.levelNumbers[index]}
                          </td>
                          <td className="p-4">Type</td>
                          <td className="p-4  text-green-600">
                            +
                            {Number(
                              formatEther(BigInt(recentIncomes.amounts[index]))
                            ).toFixed(2)}
                          </td>
                          <td className="p-4 text-gray-500">
                            {formatDistanceToNow(
                              new Date(
                                Number(recentIncomes.timestamps[index]) * 1000
                              ),
                              { addSuffix: true }
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    startEntry={startEntry}
                    endEntry={endEntry}
                    totalCount={recentIncomes.totalCount}
                  />
                )}
              </>
            ) : (
              <div className="text-center py-4 lg:py-8 text-gray-500">
                No recent income events
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

RecentIncome.displayName = "RecentIncome";

export default RecentIncome;
