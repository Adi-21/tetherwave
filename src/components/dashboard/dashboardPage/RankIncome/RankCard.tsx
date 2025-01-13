import { memo } from 'react';

interface RankCardProps {
    title: string;
    amount: string;
}

const RankCard = memo(({ title, amount }: RankCardProps) => (
    <div className="rounded-lg px-4 py-3 drop-shadow-md shadow-inner bg-white/40 dark:bg-white/5 backdrop-blur-md">
        <div className="flex justify-between items-center">
            <span className="font-semibold">{title}</span>
            <span className="bg-gradient-button text-white overflow-hidden px-2 py-1 rounded font-medium">
                {amount} USDT
            </span>
        </div>
    </div>
));

RankCard.displayName = 'RankCard';

export default RankCard; 