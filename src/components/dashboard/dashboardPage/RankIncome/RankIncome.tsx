import { memo, useMemo } from "react";
import type { UserStats } from "@/types/contract";
import { LuLandmark } from "react-icons/lu";
import { LEVELS } from '@/lib/constants';
import Skeleton from "@/components/common/Skeleton";
import { formatEther } from "viem";

interface RankIncomeProps {
    userStats: UserStats | null;
    levelIncomes: bigint[];
    isLoading: boolean;
}

interface RankCardProps {
    title: string;
    amount: string;
}

const RankCard = memo(({ title, amount }: RankCardProps) => (
    <div className="flex flex-col justify-center items-center p-4 rounded-lg bg-white/70 dark:bg-black/80 drop-shadow-lg shadow-md">
        <div className="flex flex-col justify-center items-center gap-2">
            <p className="text-lg font-bold text-center">{title}</p>
            <p className="font-bold text-green-600">
                +{Number(amount).toFixed(2)} USDT
            </p>
        </div>
    </div>
));

const RankIncome = memo(({ userStats, levelIncomes, isLoading }: RankIncomeProps) => {

    const formattedLevelIncomes = useMemo(() => {
        const result = LEVELS.slice(1).map((level, index) => {

            return {
                id: level.id,
                name: level.name,
                amount: levelIncomes[index + 1]
                    ? formatEther(levelIncomes[index + 1])
                    : "0"
            };
        });
        return result;
    }, [levelIncomes]);

    const directCommission = useMemo(() => {
        const result = userStats?.directCommissionEarned ? userStats.directCommissionEarned : "0";
        return result;
    }, [userStats?.directCommissionEarned]);

    return (
        <div className="mt-4 lg:mt-8 w-full">
            <div className="rounded-lg drop-shadow-lg shadow bg-gradient">
                <div className="flex items-center space-x-2 text-lg font-bold px-4 lg:px-6 pt-4 pb-2 lg:pt-6">
                    <LuLandmark className="h-5 w-5" />
                    <span>Rank Reward</span>
                </div>
                <div className="p-4 lg:px-6 lg:pb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {isLoading ? (
                        <>
                            <Skeleton className="h-32 w-full" />
                            <Skeleton className="h-32 w-full" />
                            <Skeleton className="h-32 w-full" />
                            <Skeleton className="h-32 w-full" />
                            <Skeleton className="h-32 w-full" />
                            <Skeleton className="h-32 w-full" />
                        </>
                    ) : (
                        <>
                            <RankCard
                                title={LEVELS[0].name}
                                amount={formatEther(BigInt(directCommission))}
                            />
                            {formattedLevelIncomes.map((level) => (
                                <RankCard
                                    key={level.id}
                                    title={level.name}
                                    amount={level.amount}
                                />
                            ))}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
});

RankCard.displayName = 'RankCard';
RankIncome.displayName = 'RankIncome';

export default RankIncome; 