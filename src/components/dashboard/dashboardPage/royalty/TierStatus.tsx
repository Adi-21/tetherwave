import { memo } from 'react';
import { LuCircleCheck, LuBan } from 'react-icons/lu';

interface TierStatusProps {
    isQualified: boolean;
    isAchieved: boolean;
}

const TierStatus = memo(({ isQualified, isAchieved }: TierStatusProps) => {
    if (isQualified && !isAchieved) {
        return (
            <div className="flex justify-start items-center gap-1 mt-2 text-sm text-gray-600 dark:text-gray-400">
                <LuCircleCheck className="h-4 lg:h-5 w-4 lg:w-4" />
                <span>Qualified for registration</span>
            </div>
        );
    }

    if (!isQualified && !isAchieved) {
        return (
            <div className="flex justify-start items-center gap-1 mt-2 text-sm text-gray-600 dark:text-gray-400">
                <LuBan className="h-4 lg:h-5 w-4 lg:w-4" />
                <span>Not qualified for this tier</span>
            </div>
        );
    }

    return null;
});

TierStatus.displayName = 'TierStatus';

export default TierStatus; 