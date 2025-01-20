import { useAccount, useBalance, useChainId } from 'wagmi'
import { useCallback, useEffect, useState } from 'react'
import { formatUnits } from 'viem'
import { siteConfig } from '@/lib/config/site'
import { useContract } from './useContract'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '@/store'
import { dashboardAPI } from '@/services/api'
import { fetchProfileData } from '@/store/features/dashboardSlice'

export function useWallet() {
    const { address, isConnected } = useAccount()
    const chainId = useChainId()
    const dispatch = useDispatch<AppDispatch>()
    const [isRegistered, setIsRegistered] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const { getUserStats } = useContract()
    const [currentLevel, setCurrentLevel] = useState(0)

    const { data: usdtBalance, refetch: refetchUsdtBalance } = useBalance({
        address,
        token: siteConfig.contracts.USDT as `0x${string}`,
    })

    const { data: nativeBalance } = useBalance({
        address,
    })

    const checkRegistrationStatus = useCallback(async () => {
        if (!address) {
            setIsRegistered(false);
            setIsLoading(false);
            return;
        }
    
        try {
            const stats = await getUserStats();
            const isBlockchainRegistered = (stats?.currentLevel ?? 0) > 0;
            setIsRegistered(isBlockchainRegistered);
    
            if (isBlockchainRegistered) {
                // Add retry mechanism for profile fetch
                let retryCount = 0;
                const maxRetries = 3;
                
                while (retryCount < maxRetries) {
                    try {
                        const profile = await dashboardAPI.getUserProfile(address);
                        if (profile.userid) {
                            await dispatch(fetchProfileData(address));
                            break;
                        }
                        // If no userid, try registration
                        await dashboardAPI.register(address);
                        // Wait longer between retries
                        await new Promise(resolve => setTimeout(resolve, 5000));
                        retryCount++;
                    } catch {
                        if (retryCount === maxRetries - 1) {
                            console.error('Failed to fetch/register user profile after retries');
                        }
                        await new Promise(resolve => setTimeout(resolve, 5000));
                        retryCount++;
                    }
                }
            }
        } catch {
            setIsRegistered(false);
        } finally {
            setIsLoading(false);
        }
    }, [address, getUserStats, dispatch]);

    const formattedBalances = {
        usdt: usdtBalance ? formatUnits(usdtBalance.value, usdtBalance.decimals) : '0',
        native: nativeBalance ? formatUnits(nativeBalance.value, nativeBalance.decimals) : '0',
    }

    useEffect(() => {
        checkRegistrationStatus()
    }, [checkRegistrationStatus])

    useEffect(() => {
        const fetchLevel = async () => {
            if (!address) return;
            const stats = await getUserStats();
            if (stats) setCurrentLevel(stats.currentLevel);
        };
        fetchLevel();
    }, [address, getUserStats]);

    return {
        address,
        isConnected,
        isRegistered,
        isLoading,
        chainId,
        balances: formattedBalances,
        currentLevel,
        checkRegistrationStatus,
        refetchUsdtBalance,
    }
}
