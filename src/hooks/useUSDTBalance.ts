import { useContractRead } from 'wagmi';
import { formatUnits } from 'viem';
import USDT_ABI from '@/lib/abis/USDT.json';

// const USDT_ADDRESS = '0xe6Ad72C499ce626b10De645E25BbAb40C5A34C9f' as const;
const opBNB_USDT_ADDRESS = '0x9e5aac1ba1a2e6aed6b32689dfcf62a509ca96f3' as const;

export const useUSDTBalance = (address: `0x${string}` | undefined) => {
    const { data: balance, isError, isLoading, refetch } = useContractRead({
        address: opBNB_USDT_ADDRESS,
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