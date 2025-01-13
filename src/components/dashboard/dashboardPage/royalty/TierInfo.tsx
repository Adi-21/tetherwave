import { memo } from 'react';

interface TierInfoProps {
    title: string;
    isAchieved: boolean;
    isQualified: boolean;
}

const TierInfo = memo(({ title, isAchieved, isQualified }: TierInfoProps) => {
    return (
        <div className="flex justify-between items-center mb-3">
            <div className='flex justify-center items-center gap-2'>
                <h3 className="text-lg font-semibold">{title}</h3>
                <div className={`w-3 h-3 rounded-full animate-pulse ${isAchieved ? "bg-green-400" : "bg-red-500"}`} />
            </div>
            <div className="flex gap-2">
                {isQualified && (
                    <span className="bg-gradient-button-green text-white px-2 py-1 rounded text-sm">
                        Qualified
                    </span>
                )}
                {isAchieved && (
                    <span className="bg-gradient-button text-white px-2 py-1 rounded text-sm">
                        Registered
                    </span>
                )}
            </div>
        </div>
    );
});

TierInfo.displayName = 'TierInfo';

export default TierInfo; 