import { memo, useState, useEffect } from "react";
import type { RecentIncomeEvents } from "@/types/contract";
import { LuHistory } from "react-icons/lu";
import Skeleton from "@/components/common/Skeleton";
import { formatEther } from "viem";
import { formatDistanceToNow } from "date-fns";
import Pagination from "../../../common/Pagination";
import { FrontendIdDisplay } from "@/components/dashboard/FrontendIdDisplay";
import type { AppDispatch } from "@/store";
import { useDispatch } from "react-redux";
import { fetchRecentIncomeData, setCurrentPage } from "@/store/features/dashboardSlice";
import { useAccount } from "wagmi";
import { LEVELS } from '@/lib/constants';

interface RecentIncomeProps {
    recentIncomes: RecentIncomeEvents;
    currentLevel: number;
    currentPage: number;
    itemsPerPage: number;
    isLoading: boolean;
}

const INCOME_TYPES = [
    { id: -1, label: 'All' },
    { id: 0, label: 'DirectReferral' },
    { id: 1, label: 'UpgradeReferral' },
    { id: 2, label: 'LevelIncome' },
    { id: 3, label: 'MagicIncome' }
] as const;

const RecentIncome = memo(
    ({
        recentIncomes,
        currentPage,
        itemsPerPage,
        isLoading,
    }: RecentIncomeProps) => {
        const dispatch = useDispatch<AppDispatch>();
        const { address } = useAccount();
        const [selectedType, setSelectedType] = useState(-1);

        const totalPages = Math.ceil(recentIncomes.totalCount / itemsPerPage);
        const startEntry = (currentPage - 1) * itemsPerPage + 1;
        const endEntry = Math.min(currentPage * itemsPerPage, recentIncomes.totalCount);

        useEffect(() => {
            if (address) {
                dispatch(fetchRecentIncomeData({
                    address,
                    page: currentPage,
                    itemsPerPage,
                    filterTypes: selectedType === -1 ? [] : [selectedType]
                }));
            }
        }, [currentPage, selectedType, dispatch, address, itemsPerPage]);

        useEffect(() => {
            dispatch(setCurrentPage(1));
        }, [dispatch]);


        return (
            <div className="mt-4 lg:mt-8 w-full">
                <div className="rounded-lg drop-shadow-lg shadow bg-gradient">
                    <div className="flex items-center space-x-2 text-lg font-bold px-4 lg:px-6 pt-4 pb-2 lg:pt-6">
                        <LuHistory className="h-5 w-5" />
                        <span>Recent Income</span>
                    </div>
                    <div className="flex gap-2 px-4 lg:px-6 overflow-x-auto">
                        {INCOME_TYPES.map(type => (
                            <button
                                type="button"
                                key={type.id}
                                onClick={() => setSelectedType(type.id)}
                                className={`px-4 py-2 rounded ${
                                    selectedType === type.id 
                                        ? 'bg-gradient-button text-white' 
                                        : 'bg-white/70 dark:bg-black/80'
                                }`}
                            >
                                {type.label}
                            </button>
                        ))}
                    </div>
                    <div className="p-4 lg:px-6 lg:pb-6 flex flex-col gap-4">
                        {isLoading ? (
                            <div className="flex flex-col justify-between items-center gap-4 p-4 rounded-lg bg-white/70 dark:bg-black/80 drop-shadow-lg shadow-md">
                                {[...Array(5)].map((_, index) => (
                                    <div key={`${index + 1}`} className="h-10 lg:h-12 w-full">
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
                                                <th className="p-4 text-center">S No.</th>
                                                <th className="p-4 text-center">Address</th>
                                                <th className="p-4 text-center">Level Name</th>
                                                <th className="p-4 text-center">Income Type</th>
                                                <th className="p-4 text-center">Amount (USDT)</th>
                                                <th className="p-4 text-center">Received</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-transparent">
                                            {recentIncomes.userAddresses.map((_, index) => (
                                                <tr
                                                    key={`${index+1}`}
                                                    className="text-start p-4 rounded-lg bg-white/70 dark:bg-black/80 drop-shadow-lg shadow-md"
                                                >
                                                    <td className="py-2 px-8 text-center">
                                                        {(currentPage - 1) * itemsPerPage + index + 1}
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <FrontendIdDisplay
                                                            address={recentIncomes.userAddresses[index]}
                                                            isRegistered={Number(recentIncomes.levelNumbers[index]) > 0}
                                                        />
                                                    </td>
                                                    <td className="p-4 text-center">
                                                            {LEVELS[recentIncomes.levelNumbers[index] - 1]?.name ?? `Level ${recentIncomes.levelNumbers[index]}`}
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        {INCOME_TYPES.find(type => type.id === recentIncomes.incomeTypes[index])?.label ?? 'Unknown'}
                                                    </td>
                                                    <td className="p-4 text-center text-green-600">
                                                        +{Number(formatEther(BigInt(recentIncomes.amounts[index]))).toFixed(2)}
                                                    </td>
                                                    <td className="p-4 text-center text-gray-500">
                                                        {formatDistanceToNow(
                                                            new Date(Number(recentIncomes.timestamps[index]) * 1000),
                                                            { addSuffix: true }
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {recentIncomes.userAddresses.length > 0 && (
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={(page) => {
                                            dispatch(setCurrentPage(page));
                                        }}
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
