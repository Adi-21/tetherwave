import { memo, useMemo } from "react";
import { LuBoxes } from "react-icons/lu";
import { LEVELS } from "@/lib/constants/levels";
import type { PackagesProps } from "@/types/contract";

interface PackageCardProps {
  levelInfo: typeof LEVELS[number];
  currentLevelNum: number;
  handleUpgrade: (level: number, amount: number) => Promise<void>;
  isLoading: boolean;
}

const PackageCard = memo(({
  levelInfo,
  currentLevelNum,
  handleUpgrade,
  isLoading
}: PackageCardProps) => {
  const levelNum = Number(levelInfo.level);
  const isNextLevel = levelNum === currentLevelNum + 1;
  const isCompleted = levelNum <= currentLevelNum;

  return (
    <div className="relative flex flex-col items-center rounded-md transition-all duration-300">
      <div className="flex justify-center items-center w-full h-full z-0 p-0.5 shimmer">
        <button
          type="button"
          onClick={() => handleUpgrade(levelNum, levelInfo.amount)}
          disabled={!isNextLevel || isLoading}
          className={`relative flex flex-col justify-center items-center min-w-48 px-4 py-2.5 rounded-md w-full z-50 text-black
          drop-shadow-md overflow-hidden shadow-[#FFFFFF80_0px_2px_4px_1px_inset,#3423AA50_0px_-2px_2px_1px_inset]
          ${
            isCompleted
              ? 'bg-gradient-to-br from-[#FF9D23] via-[#E7BE5E] to-[#FF9D23]'
              : 'bg-gradient-to-br from-gray-400 via-gray-300 to-gray-400'
          }
          ${
            isNextLevel && !isLoading
              ? 'cursor-pointer'
              : 'cursor-not-allowed opacity-70 text-opacity-90'
          }
        `}
        >
          {!isCompleted && isNextLevel && !isLoading && (
            <div className="absolute top-1 left-[-75%] w-full h-full bg-gradient-to-l from-white/40 via-white/10 to-transparent transition-all duration-[2000ms] -rotate-45 z-20 animate-shimmer-slide" />
          )}
          <div className="flex justify-between items-center w-full z-20">
            <p className="font-bold text-3d dark:text-3d-dark text-3d">
              Level {levelInfo.level}
            </p>
            {isCompleted && (
              <span className="absolute top-2 right-2 flex justify-center items-center text-xs shadow drop-shadow lg:text-sm font-bold text-white bg-green-500 rounded-full p-1 w-6 lg:w-7 h-6 lg:h-7 z-20">
                ✓
              </span>
            )}
          </div>
          <div className="z-20 pb-2 pt-2">
            <p className="text-lg lg:text-2xl font-bold text-3d dark:text-3d-dark">
              {levelInfo.name}
            </p>
            <p className="text-sm lg:text-lg font-bold text-center w-full text-3d dark:text-3d-dark">
              ${levelInfo.amount}
            </p>
          </div>
        </button>
      </div>
    </div>
  );
});

const Packages = memo(({ currentLevel, handleUpgrade, isLoading }: PackagesProps) => {
  const packages = useMemo(() => {
    const result = LEVELS.slice(0);
    return result;
  }, []);

  return (
    <div className="mt-4 lg:mt-8 rounded-lg drop-shadow-lg shadow bg-gradient w-full">
      <div className="flex items-center space-x-2 text-lg font-bold px-4 lg:px-6 pt-4 lg:pt-6">
        <LuBoxes className="h-5 w-5" />
        <span>Packages (Current Level: {currentLevel})</span>
      </div>
      <div className="p-4 lg:px-6 lg:pb-6 flex lg:grid lg:grid-cols-5 gap-4 lg:gap-6 overflow-auto w-full text-nowrap">
        {packages.map((levelInfo) => (
          <PackageCard
            key={levelInfo.id}
            levelInfo={levelInfo}
            currentLevelNum={currentLevel}
            handleUpgrade={handleUpgrade}
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  );
});

PackageCard.displayName = "PackageCard";
Packages.displayName = "Packages";

export default Packages;
