import { memo, useMemo } from "react";
import { LuBadgeDollarSign } from "react-icons/lu";
import type { RecentIncomeProps } from "@/types/contract";
import IncomeRow from "./IncomeRow";
import Pagination from "./Pagination";
import Skeleton from "@/components/common/Skeleton";

const RecentIncome = memo(({
    recentIncomes,
    currentLevel,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    isLoading,      
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
                {isLoading ? (
                    <div className="space-y-4 mt-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                ) : (
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
                )}

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
});

RecentIncome.displayName = 'RecentIncome';

export default RecentIncome; 