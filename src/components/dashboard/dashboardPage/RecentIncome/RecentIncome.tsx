import { memo, useMemo } from "react";
import { LuBadgeDollarSign } from "react-icons/lu";
import type { RecentIncomeProps } from "@/types/contract";
import IncomeRow from "./IncomeRow";
import Pagination from "./Pagination";
import Skeleton from "@/components/common/Skeleton";
import { formatEther } from "viem";

const RecentIncome = memo(({
    recentIncomes,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    isLoading,      
}: RecentIncomeProps) => {
    const incomes = useMemo(() => recentIncomes ?? {
        userAddresses: [],
        levelNumbers: [],
        amounts: [],
        timestamps: [],
        totalCount: 0
    }, [recentIncomes]);

    const totalPages = useMemo(
        () => Math.ceil(incomes.totalCount / itemsPerPage),
        [incomes.totalCount, itemsPerPage]
    );

    const startEntry = useMemo(
        () => (currentPage - 1) * itemsPerPage + 1,
        [currentPage, itemsPerPage]
    );

    const endEntry = useMemo(
        () => Math.min(currentPage * itemsPerPage, incomes.totalCount),
        [currentPage, itemsPerPage, incomes.totalCount]
    );

    if (isLoading) {
        return <Skeleton className="h-64 w-full" />;
    }

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
                        {incomes.userAddresses.map((address, index) => (
                            <IncomeRow
                                key={`${index + 1}`}
                                address={address}
                                level={incomes.levelNumbers[index]}
                                amount={formatEther(BigInt(incomes.amounts[index]))}
                                timestamp={incomes.timestamps[index]}
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
                    totalCount={incomes.totalCount}
                />
            </div>
        </div>
    );
});

RecentIncome.displayName = 'RecentIncome';

export default RecentIncome; 