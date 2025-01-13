import { memo } from "react";
import { LEVELS } from "@/lib/constants";
import { FrontendIdDisplay } from "../../FrontendIdDisplay";

interface IncomeRowProps {
    address: string;
    amount: bigint;
    levelNumber: number;
    timestamp: number;
    currentLevel: number;
}

const IncomeRow = memo(({
    address,
    amount,
    levelNumber,
    timestamp,
    currentLevel,
}: IncomeRowProps) => (
    <tr className="hover:bg-white/20 dark:hover:bg-white/10">
        <td className="py-2 px-4">
            <FrontendIdDisplay address={address} isRegistered={currentLevel > 0} />
        </td>
        <td className="py-2 px-4 text-green-600">
            +{amount.toString()} USDT
        </td>
        <td className="py-2 px-4">
            {LEVELS[levelNumber - 1]?.name ?? `Level ${levelNumber}`}
        </td>
        <td className="py-2 px-4">Level {levelNumber}</td>
        <td className="py-2 px-4">
            {new Date(timestamp * 1000).toLocaleDateString()}
        </td>
    </tr>
));

IncomeRow.displayName = "IncomeRow";

export default IncomeRow; 