
import { memo, useMemo } from "react";
import { LuBadgeDollarSign, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { LEVELS } from "@/lib/constants/levels";
import { FrontendIdDisplay } from "../FrontendIdDisplay";
import type { RecentIncomeProps } from "@/types/contract";

const IncomeRow = memo(
  ({
    address,
    amount,
    levelNumber,
    timestamp,
    currentLevel,
  }: {
    address: string;
    amount: bigint;
    levelNumber: number;
    timestamp: number;
    currentLevel: number;
  }) => (
    <tr className="hover:bg-white/20 dark:hover:bg-white/10">
      <td className="py-2 px-4">
        <FrontendIdDisplay address={address} isRegistered={currentLevel > 0} />
      </td>
      <td className="py-2 px-4 text-green-600">
        {/* +{formatUnits(amount, 18)} USDT */}
        {amount}
      </td>
      <td className="py-2 px-4">
        {LEVELS[levelNumber - 1]?.name || `Level ${levelNumber}`}
      </td>
      <td className="py-2 px-4">Level {levelNumber}</td>
      <td className="py-2 px-4">
        {new Date(timestamp * 1000).toLocaleDateString()}
      </td>
    </tr>
  )
);

IncomeRow.displayName = "IncomeRow";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  startEntry,
  endEntry,
  totalCount,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  startEntry: number;
  endEntry: number;
  totalCount: number;
}) => (
  <div className="flex justify-between items-center gap-4 mt-4 w-full">
    <div className="text-sm text-gray-500 w-full">
      Showing {startEntry} to {endEntry} of {totalCount} entries
    </div>
    <div className="flex justify-end gap-1 lg:gap-2">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className={`px-3 py-2 rounded drop-shadow shadow ${
          currentPage === 1
            ? "bg-gray-300 text-gray-600 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
            : "bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-300 hover:bg-opacity-80 dark:hover:bg-opacity-80"
        }`}
      >
        <LuChevronLeft className="h-4 w-4" />
      </button>
      <div className="px-3 py-1 rounded bg-gradient-button text-white">
        {currentPage} of {totalPages}
      </div>
      <button
        type="button"
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded drop-shadow shadow ${
          currentPage === totalPages
            ? "bg-gray-300 text-gray-600 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
            : "bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-300 hover:bg-opacity-80 dark:hover:bg-opacity-80"
        }`}
      >
        <LuChevronRight className="h-4 w-4" />
      </button>
    </div>
  </div>
);

const RecentIncome = memo(
  ({
    recentIncomes,
    currentLevel,
    currentPage,
    setCurrentPage,
    itemsPerPage,
  }: RecentIncomeProps) => {
    const totalPages = useMemo(
      () => Math.ceil(recentIncomes.totalCount / itemsPerPage),
      [recentIncomes.totalCount, itemsPerPage]
    );

    const startEntry = useMemo(
      () => (currentPage - 1) * itemsPerPage + 1,
      [currentPage, itemsPerPage]
    );

    const endEntry = useMemo(
      () => Math.min(currentPage * itemsPerPage, recentIncomes.totalCount),
      [currentPage, itemsPerPage, recentIncomes.totalCount]
    );

    return (
      <div className="mt-4 lg:mt-8 p-4 rounded-lg drop-shadow-lg shadow bg-gradient w-full">
        <div className="flex items-center space-x-2 text-lg font-bold">
          <LuBadgeDollarSign className="h-5 w-5" />
          <span>Recent Income</span>
        </div>
        <div className="overflow-y-auto text-nowrap pb-1">
          <table className="w-full mt-4 border-collapse">
            <thead className="overflow-y-auto drop-shadow-lg bg-white/40 dark:bg-white/5">
              <tr>
                <th className="py-2 px-4 text-left">From</th>
                <th className="py-2 px-4 text-left">Amount</th>
                <th className="py-2 px-4 text-left">Rank Level</th>
                <th className="py-2 px-4 text-left">Layer</th>
                <th className="py-2 px-4 text-left">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentIncomes.userAddresses.map((address, index) => (
                <IncomeRow
                  key={`${index + 1}`}
                  address={address}
                  amount={recentIncomes.amounts[index]}
                  levelNumber={recentIncomes.levelNumbers[index]}
                  timestamp={recentIncomes.timestamps[index]}
                  currentLevel={currentLevel}
                />
              ))}
            </tbody>
          </table>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            startEntry={startEntry}
            endEntry={endEntry}
            totalCount={recentIncomes.totalCount}
          />
        </div>
      </div>
    );
  }
);

RecentIncome.displayName = 'RecentIncome';

export default RecentIncome;
