import { useContractRead } from 'wagmi';
import { formatUnits } from 'viem';
import USDT_ABI from '@/lib/abis/USDT.json';

const USDT_ADDRESS = '0xe6Ad72C499ce626b10De645E25BbAb40C5A34C9f' as const;

export const useUSDTBalance = (address: `0x${string}` | undefined) => {
    const { data: balance, isError, isLoading, refetch } = useContractRead({
        address: USDT_ADDRESS,
        abi: USDT_ABI,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
    });

    return {
        balance: balance as bigint,
        formatted: balance ? formatUnits(balance as bigint, 18) : '0',
        isError,
        isLoading,
        refetch
    };
}; 