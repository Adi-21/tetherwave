import { memo } from "react";
import type { RecentIncomeEvents } from "@/types/contract";
import { LuHistory } from "react-icons/lu";
import Skeleton from "@/components/common/Skeleton";
import { formatEther } from "viem";
import { formatDistanceToNow } from 'date-fns';
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

interface IncomeEventCardProps {
    address: string;
    level: number;
    amount: string;
    timestamp: number;
}

const IncomeEventCard = memo(({ address, level, amount, timestamp }: IncomeEventCardProps) => (
    <div className="flex flex-col lg:flex-row justify-between items-center gap-2 p-4 rounded-lg bg-white/70 dark:bg-black/80 drop-shadow-lg shadow-md">
        <div className="flex flex-col lg:flex-row items-center gap-2 lg:gap-4">
            <FrontendIdDisplay address={address} isRegistered={level > 0} />
            <p className="text-sm lg:text-base font-bold text-purple-600">Level {level}</p>
        </div>
        <div className="flex flex-col lg:flex-row items-center gap-2 lg:gap-4">
            <p className="text-sm lg:text-base font-bold text-green-600">
                +{Number(formatEther(BigInt(amount))).toFixed(2)} USDT
            </p>
            <p className="text-xs lg:text-sm text-gray-500">
                {formatDistanceToNow(new Date(timestamp * 1000), { addSuffix: true })}
            </p>
        </div>
    </div>
));

const RecentIncome = memo(({
    recentIncomes,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    isLoading
}: RecentIncomeProps) => {
    const totalPages = Math.ceil(recentIncomes.totalCount / itemsPerPage);
    const startEntry = (currentPage - 1) * itemsPerPage + 1;
    const endEntry = Math.min(currentPage * itemsPerPage, recentIncomes.totalCount);

    return (
        <div className="mt-4 lg:mt-8 w-full">
            <div className="rounded-lg drop-shadow-lg shadow bg-gradient">
                <div className="flex items-center space-x-2 text-lg font-bold px-4 lg:px-6 pt-4 pb-2 lg:pt-6">
                    <LuHistory className="h-5 w-5" />
                    <span>Recent Income</span>
                </div>
                <div className="p-4 lg:px-6 lg:pb-6 flex flex-col gap-4">
                    {isLoading ? (
                        <>
                            <div className="flex flex-col lg:flex-row justify-between items-center gap-2 p-4 rounded-lg bg-white/70 dark:bg-black/80 drop-shadow-lg shadow-md h-[68px]">
                                <div className="w-full h-full">
                                    <Skeleton className="h-full w-full" />
                                </div>
                            </div>
                            <div className="flex flex-col lg:flex-row justify-between items-center gap-2 p-4 rounded-lg bg-white/70 dark:bg-black/80 drop-shadow-lg shadow-md h-[68px]">
                                <div className="w-full h-full">
                                    <Skeleton className="h-full w-full" />
                                </div>
                            </div>
                            <div className="flex flex-col lg:flex-row justify-between items-center gap-2 p-4 rounded-lg bg-white/70 dark:bg-black/80 drop-shadow-lg shadow-md h-[68px]">
                                <div className="w-full h-full">
                                    <Skeleton className="h-full w-full" />
                                </div>
                            </div>
                            <div className="flex flex-col lg:flex-row justify-between items-center gap-2 p-4 rounded-lg bg-white/70 dark:bg-black/80 drop-shadow-lg shadow-md h-[68px]">
                                <div className="w-full h-full">
                                    <Skeleton className="h-full w-full" />
                                </div>
                            </div>
                            <div className="flex flex-col lg:flex-row justify-between items-center gap-2 p-4 rounded-lg bg-white/70 dark:bg-black/80 drop-shadow-lg shadow-md h-[68px]">
                                <div className="w-full h-full">
                                    <Skeleton className="h-full w-full" />
                                </div>
                            </div>
                        </>
                    ) : recentIncomes.userAddresses.length > 0 ? (
                        <>
                            {recentIncomes.userAddresses.map((address, index) => (
                                <IncomeEventCard
                                    key={`${address}-${recentIncomes.timestamps[index]}`}
                                    address={address}
                                    level={Number(recentIncomes.levelNumbers[index])}
                                    amount={recentIncomes.amounts[index]}
                                    timestamp={Number(recentIncomes.timestamps[index])}
                                />
                            ))}
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
                        <div className="text-center py-8 text-gray-500">
                            No recent income events
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

IncomeEventCard.displayName = 'IncomeEventCard';
RecentIncome.displayName = 'RecentIncome';

export default RecentIncome; 