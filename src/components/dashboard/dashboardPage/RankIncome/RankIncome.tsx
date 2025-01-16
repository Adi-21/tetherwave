import { memo, useMemo } from "react";
import { LEVELS } from "@/lib/constants";
import type { RankIncomeProps } from "@/types/contract";
import { LuLandmark } from "react-icons/lu";
import RankCard from "./RankCard";
import Skeleton from "@/components/common/Skeleton";
import { formatEther } from "viem";

const RankIncome = memo(({ userStats, levelIncomes, isLoading }: RankIncomeProps) => {
    const formattedLevelIncomes = useMemo(() =>
        LEVELS.slice(1).map((level, index) => ({
            id: level.id,
            name: level.name,
            amount: levelIncomes[index + 1]?.toString() ?? "0",
        })),
        [levelIncomes]
    );

    const directCommission = useMemo(() => 
        userStats?.directCommissionEarned?.toString() ?? "0",
        [userStats?.directCommissionEarned]
    );

    return (
        <div className="mt-4 lg:mt-8 w-full">
            <div className="rounded-lg drop-shadow-lg shadow bg-gradient">
                <div className="flex items-center space-x-2 text-lg font-bold px-4 lg:px-6 pt-4 pb-2 lg:pt-6">
                    <LuLandmark className="h-5 w-5" />
                    <span>Rank Income</span>
                </div>
                <div className="p-4 lg:px-6 lg:pb-6 grid gap-4 md:grid-cols-2 h-80 lg:h-auto overflow-auto">
                    {isLoading ? (
                        <>
                            <Skeleton className="h-32 w-full" />
                            <Skeleton className="h-32 w-full" />
                            <Skeleton className="h-32 w-full" />
                            <Skeleton className="h-32 w-full" />
                        </>
                    ) : (
                        <>
                            <RankCard title={LEVELS[0].name} amount={formatEther(BigInt(directCommission))} />
                            {formattedLevelIncomes.map((level) => (
                                <RankCard key={level.id} title={level.name} amount={formatEther(BigInt(level.amount))} />
                            ))}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
});

RankIncome.displayName = 'RankIncome';

export default RankIncome; 