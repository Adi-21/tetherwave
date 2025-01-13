import { memo } from 'react';

interface TierProgressBarProps {
    label: string;
    progress: number;
    value: number;
    required: number;
    className: string;
}

const TierProgressBar = memo(({ label, progress, value, required, className }: TierProgressBarProps) => (
    <div className="space-y-2">
        <div className="flex justify-between">
            <span className="text-sm font-medium">{label}</span>
            <span>{value}/{required}</span>
        </div>
        <div className="w-full bg-gray-300 dark:bg-gray-200 rounded-full h-2.5">
            <div
                className={`${className} h-2.5 rounded-full transition-all duration-300`}
                style={{ width: `${progress}%` }}
            />
        </div>
    </div>
));

TierProgressBar.displayName = 'TierProgressBar';

export default TierProgressBar; 