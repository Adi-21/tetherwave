import { memo } from "react";
import { LEVELS } from "@/lib/constants";
import { FrontendIdDisplay } from "../../FrontendIdDisplay";

interface IncomeRowProps {
    address: string;
    level: number;
    amount: string;
    timestamp: number;
}

const IncomeRow = memo(({
    address,
    level,
    amount,
    timestamp,
}: IncomeRowProps) => (
    <tr className="hover:bg-white/20 dark:hover:bg-white/10">
        <td className="py-2 px-4">
            <FrontendIdDisplay address={address} isRegistered={level > 0} />
        </td>
        <td className="py-2 px-4 text-green-600">
            +{amount} USDT
        </td>
        <td className="py-2 px-4">
            {LEVELS[level - 1]?.name ?? `Level ${level}`}
        </td>
        <td className="py-2 px-4">Level {level}</td>
        <td className="py-2 px-4">
            {new Date(timestamp * 1000).toLocaleDateString()}
        </td>
    </tr>
));

IncomeRow.displayName = "IncomeRow";

export default IncomeRow; 