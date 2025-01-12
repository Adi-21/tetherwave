import { useEffect, useState, useCallback, useMemo, memo } from 'react';
import { LuBan, LuBookmarkPlus, LuCircleCheck, LuHandCoins, LuSquareArrowRight } from 'react-icons/lu';
import type { LegProgress, RoyaltyInfo, TierCardProps } from '@/types/contract';

// const POLLING_INTERVAL = 60000; // 60 seconds
const ERROR_TIMEOUT = 5000; // 5 seconds

const isFullyRegistered = (info: RoyaltyInfo | null): boolean => {
  return !!info?.achievedTiers?.every(tier => tier)|| false;
};

const TierProgressBar = memo(({ progress, className }: { progress: number; className: string }) => (
  <div className="w-full bg-gray-300 dark:bg-gray-200 rounded-full h-2.5">
    <div
      className={`${className} h-2.5 rounded-full transition-all duration-300`}
      style={{ width: `${progress}%` }}
    />
  </div>
));

TierProgressBar.displayName = 'TierProgressBar';

const TierStats = ({ 
  index, 
  parsedRoyaltyInfo, 
  calculateTotalPoolAmount 
}: { 
  index: number; 
  parsedRoyaltyInfo: RoyaltyInfo | null;
  calculateTotalPoolAmount: (index: number) => string;
}) => {
  const totalEarned = useMemo(() => {
    if (!parsedRoyaltyInfo?.totalEarned[index]) return '0.00 USDT';
    // return `+${formatUnits(parsedRoyaltyInfo.totalEarned[index], 18)} USDT`;
    return `+${parsedRoyaltyInfo.totalEarned[index], 18} USDT`;
  }, [parsedRoyaltyInfo?.totalEarned, index]);

  const poolAmount = useMemo(() => 
    `${calculateTotalPoolAmount(index)} USDT`, 
    [calculateTotalPoolAmount, index]
  );

  return (
    <div className="flex justify-between items-center gap-1 bg-white/40 dark:bg-white/5 backdrop-blur-md rounded-lg p-3 lg:p-4 drop-shadow-lg shadow">
      <div className="flex flex-col justify-between items-start">
        <h3 className="text-sm lg:text-lg font-semibold text-start">Total Earned</h3>
        <p className="text-xl lg:text-2xl font-bold text-green-600">{totalEarned}</p>
      </div>
      <div className="flex flex-col justify-between items-end">
        <h3 className="text-sm lg:text-lg font-semibold text-end lg:text-start">Total Pool Amount</h3>
        <p className="text-xl lg:text-2xl font-bold text-green-600">{poolAmount}</p>
      </div>
    </div>
  );
};

TierStats.displayName = 'TierStats';

const TierCard = memo(({ 
  slab, 
  index, 
  data,
  parsedRoyaltyInfo,
  calculateTotalPoolAmount,
  calculateStrongLegProgress,
  calculateWeakLegProgress 
}: TierCardProps) => {
  const tier = useMemo(() => {
    const tiers = {
      0: data.legProgress.tier1,
      1: data.legProgress.tier2,
      2: data.legProgress.tier3,
      3: data.legProgress.tier4
    };
    return tiers[index as keyof typeof tiers];
  }, [data.legProgress, index]);

  const strongLegProgress = useMemo(() => 
    calculateStrongLegProgress(tier), 
    [calculateStrongLegProgress, tier]
  );

  const weakLegProgress = useMemo(() => 
    calculateWeakLegProgress(tier), 
    [calculateWeakLegProgress, tier]
  );

  const isAchieved = parsedRoyaltyInfo?.achievedTiers[index];
  const isQualified = data.qualifiedTiers[index] && !isAchieved;

  return (
    <div className={`relative drop-shadow shadow-md px-4 lg:px-8 py-4 min-h-32 rounded-md overflow-hidden transition-all duration-300 ${slab.bg}`}>
      <div className="flex justify-between items-center mb-3">
        <div className='flex justify-center items-center gap-2'>
          <h3 className="text-lg font-semibold">{slab.title}</h3>
          <div className={`w-3 h-3 rounded-full animate-pulse ${parsedRoyaltyInfo?.achievedTiers[index] ? "bg-green-400" : "bg-red-500"}`} />
        </div>
        <div className="flex gap-2">
          {data.qualifiedTiers[index] && !parsedRoyaltyInfo?.achievedTiers[index] && (
            <span className="bg-gradient-button-green text-white px-2 py-1 rounded text-sm">
              Qualified
            </span>
          )}
          {parsedRoyaltyInfo?.achievedTiers[index] && (
            <span className="bg-gradient-button text-white px-2 py-1 rounded text-sm">
              Registered
            </span>
          )}
        </div>
      </div>

      <div className="mt-2 space-y-2">
        <div className="space-y-4">
          {/* Strong Leg Progress */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Strong Leg</span>
              <span>
                {index === 0 && `${Number(data.legProgress.tier1.strongLeg)}/${data.legProgress.tier1.requiredStrong}`}
                {index === 1 && `${Number(data.legProgress.tier2.strongLeg)}/${data.legProgress.tier2.requiredStrong}`}
                {index === 2 && `${Number(data.legProgress.tier3.strongLeg)}/${data.legProgress.tier3.requiredStrong}`}
                {index === 3 && `${Number(data.legProgress.tier4.strongLeg)}/${data.legProgress.tier4.requiredStrong}`}
              </span>
            </div>
            <TierProgressBar
              progress={strongLegProgress}
              className="bg-green-600"
            />
          </div>

          {/* Weak Leg Progress */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Weak Leg</span>
              <span>
                {index === 0 && `${Number(data.legProgress.tier1.weakLeg1 + data.legProgress.tier1.weakLeg2)}/${data.legProgress.tier1.requiredStrong}`}
                {index === 1 && `${Number(data.legProgress.tier2.weakLeg1 + data.legProgress.tier2.weakLeg2)}/${data.legProgress.tier2.requiredStrong}`}
                {index === 2 && `${Number(data.legProgress.tier3.weakLeg1 + data.legProgress.tier3.weakLeg2)}/${data.legProgress.tier3.requiredStrong}`}
                {index === 3 && `${Number(data.legProgress.tier4.weakLeg1 + data.legProgress.tier4.weakLeg2)}/${data.legProgress.tier4.requiredStrong}`}
              </span>
            </div>
            <TierProgressBar
              progress={weakLegProgress}
              className="bg-blue"
            />
          </div>
        </div>

        {parsedRoyaltyInfo?.achievedTiers[index] ? (
          <>
            <div className="flex justify-between items-center">
              <div className='flex justify-start items-center gap-1 text-gray-600 dark:text-gray-400'>
                <LuHandCoins className="w-4 h-4" />
                <span className="text-sm">Paid Days:</span>
              </div>
              <span className="font-medium">
                {Number(parsedRoyaltyInfo.paidDays[index])}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className='flex justify-start items-center gap-1 text-gray-600 dark:text-gray-400'>
                <LuBookmarkPlus className="w-4 h-4" />
                <span className="text-sm">Days Remaining:</span>
              </div>
              <span className="font-semibold text-red-500 ">
                {Number(parsedRoyaltyInfo.daysRemaining[index])}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className='flex justify-start items-center gap-1 text-gray-600 dark:text-gray-400'>
                <LuSquareArrowRight className="w-4 h-4" />
                <span className="text-sm">Next Claim:</span>
              </div>
              <span className="font-medium">
                {parsedRoyaltyInfo.nextClaimTime[index]
                  ? new Date(Number(parsedRoyaltyInfo.nextClaimTime[index]) * 1000).toLocaleDateString()
                  : 'N/A'
                }
              </span>
            </div>
            <TierStats
              index={index}
              parsedRoyaltyInfo={parsedRoyaltyInfo}
              calculateTotalPoolAmount={calculateTotalPoolAmount}
            />
          </>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <div className='flex justify-start items-center gap-1 text-gray-600 dark:text-gray-400'>
                <LuHandCoins className="w-4 h-4" />
                <span className="text-sm">Paid Days:</span>
              </div>
              <span className="font-medium">0</span>
            </div>
            <div className="flex justify-between items-center">
              <div className='flex justify-start items-center gap-1 text-gray-600 dark:text-gray-400'>
                <LuBookmarkPlus className="w-4 h-4" />
                <span className="text-sm">Days Remaining:</span>
              </div>
              <span className="font-semibold text-red-500">0</span>
            </div>
            <div className="flex justify-between items-center">
              <div className='flex justify-start items-center gap-1 text-gray-600 dark:text-gray-400'>
                <LuSquareArrowRight className="w-4 h-4" />
                <span className="text-sm">Next Claim:</span>
              </div>
              <span className="font-medium">N/A</span>
            </div>
            <TierStats
              index={index}
              parsedRoyaltyInfo={parsedRoyaltyInfo}
              calculateTotalPoolAmount={calculateTotalPoolAmount}
            />
          </>
        )}
      </div>

      {isQualified && !parsedRoyaltyInfo?.achievedTiers[index] && (
        <div className="flex justify-start items-center gap-1 mt-2 text-sm text-gray-600 dark:text-gray-400">
          <LuCircleCheck className="h-4 lg:h-5 w-4 lg:w-4" />
          <span>Qualified for registration</span>
        </div>
      )}

      {!data.qualifiedTiers[index] && !parsedRoyaltyInfo?.achievedTiers[index] && (
        <div className="flex justify-start items-center gap-1 mt-2 text-sm text-gray-600 dark:text-gray-400">
          <LuBan className="h-4 lg:h-5 w-4 lg:w-4" />
          <span>Not qualified for this tier</span>
        </div>
      )}
    </div>
  );
}, (prevProps: TierCardProps, nextProps: TierCardProps) => 
  prevProps.data.royaltyInfo === nextProps.data.royaltyInfo &&
  prevProps.data.qualifiedTiers[prevProps.index] === nextProps.data.qualifiedTiers[nextProps.index] &&
  prevProps.data.legProgress === nextProps.data.legProgress
);

TierCard.displayName = 'TierCard';

const RoyaltySlab = () => {
  // Memoize static data
  const slabs = useMemo(() => [
    { title: 'FFR1', description: 'Royalty Slab 1', bg: "bg-gradient" },
    { title: 'FFR2', description: 'Royalty Slab 2', bg: "bg-gradient" },
    { title: 'FFR3', description: 'Royalty Slab 3', bg: "bg-gradient" },
    { title: 'FFR4', description: 'Royalty Slab 4', bg: "bg-gradient" },
  ], []);

  const tierAmounts = useMemo(() => [
    BigInt('5000000000000000000'),
    BigInt('10000000000000000000'),
    BigInt('25000000000000000000'),
    BigInt('50000000000000000000')
  ], []);

  // const address = 0 


  const [state, setState] = useState({
    qualifiedTiers: [] as boolean[],
    royaltyInfo: null as RoyaltyInfo | null,
    error: null as string | null,
    legProgress: {
      tier1: { total: 6, requiredStrong: 3, strongLeg: BigInt(0), weakLeg1: BigInt(0), weakLeg2: BigInt(0), requiredLevel: 2 },
      tier2: { total: 8, requiredStrong: 4, strongLeg: BigInt(0), weakLeg1: BigInt(0), weakLeg2: BigInt(0), requiredLevel: 3 },
      tier3: { total: 10, requiredStrong: 5, strongLeg: BigInt(0), weakLeg1: BigInt(0), weakLeg2: BigInt(0), requiredLevel: 4 },
      tier4: { total: 12, requiredStrong: 6, strongLeg: BigInt(0), weakLeg1: BigInt(0), weakLeg2: BigInt(0), requiredLevel: 5 }
    }
  });

  // Memoize calculation functions
  const calculateTotalPoolAmount = useCallback((tierIndex: number): string => {
    const totalDays = BigInt(500);
    const poolAmount = tierAmounts[tierIndex] * totalDays;
    // return formatUnits(poolAmount, 18);
    return poolAmount.toString();
  }, [tierAmounts]);

  const calculateStrongLegProgress = useCallback((tier: LegProgress): number => {
    const strongLegValue = Number(tier.strongLeg);
    const requiredValue = tier.requiredStrong;
    const percentage = (strongLegValue / requiredValue) * 100;
    return strongLegValue >= requiredValue ? 100 : Math.min(percentage, 100);
  }, []);

  const calculateWeakLegProgress = useCallback((tier: LegProgress): number => {
    const weakLegTotal = Number(tier.weakLeg1 + tier.weakLeg2);
    const requiredValue = tier.requiredStrong;
    const percentage = (weakLegTotal / requiredValue) * 100;
    return weakLegTotal >= requiredValue ? 100 : Math.min(percentage, 100);
  }, []);

  // Memoize parseRoyaltyInfo
  const parseRoyaltyInfo = useCallback((info: RoyaltyInfo | [boolean[], bigint[], bigint[], bigint[], bigint[], boolean[]] | null) => {
    if (!info || !Array.isArray(info)) return null;

    try {
      const calculatedTotalEarned = (info[1] as bigint[]).map((days, index) =>
        (info[0] as boolean[])[index] ? days * tierAmounts[index] : BigInt(0)
      );

      return {
        achievedTiers: info[0] || [],
        paidDays: info[1] || [],
        daysRemaining: info[2] || [],
        nextClaimTime: info[3] || [],
        totalEarned: calculatedTotalEarned,
        qualifiedNewTiers: info[5] || []
      };
    } catch {
      return null;
    }
  }, [tierAmounts]);



  // Clear error after timeout
  useEffect(() => {
    if (state.error) {
      const timer = setTimeout(() => {
        setState(prev => ({ ...prev, error: null }));
      }, ERROR_TIMEOUT);
      return () => clearTimeout(timer);
    }
  }, [state.error]);

  // Memoize parsed royalty info
  const parsedRoyaltyInfo = useMemo(() => parseRoyaltyInfo(state.royaltyInfo), [state.royaltyInfo, parseRoyaltyInfo]);

  // Add this after the parsedRoyaltyInfo memo
  const isAllTiersRegistered = useMemo(() => 
    isFullyRegistered(parsedRoyaltyInfo), 
    [parsedRoyaltyInfo]
  );

  // Use it to prevent unnecessary renders
  const renderedSlabs = useMemo(() => 
    !isAllTiersRegistered && slabs.map((slab, index) => (
      <TierCard
        key={`${index+1}`}
        slab={slab}
        index={index}
        data={state}
        parsedRoyaltyInfo={parsedRoyaltyInfo}
        calculateTotalPoolAmount={calculateTotalPoolAmount}
        calculateStrongLegProgress={calculateStrongLegProgress}
        calculateWeakLegProgress={calculateWeakLegProgress}
      />
    )), 
    [slabs, state, parsedRoyaltyInfo, calculateTotalPoolAmount, calculateStrongLegProgress, calculateWeakLegProgress, isAllTiersRegistered]
  );

  return (
    <>
      {state.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 animate-fade-out">
          {state.error}
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {renderedSlabs}
      </div>
    </>
  );
};

export default RoyaltySlab;
