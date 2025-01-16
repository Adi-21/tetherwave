import { useState, useCallback, useEffect } from 'react';

export const useMetaMask = () => {
    const [account, setAccount] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [chainId, setChainId] = useState<string>('');

    const connectWallet = useCallback(async () => {
        if (!window.ethereum) {
            setError('Please install MetaMask!');
            return false;
        }

        try {
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            }) as string[];

            const chainId = await window.ethereum.request({
                method: 'eth_chainId'
            }) as string;

            if (accounts?.[0]) {
                setAccount(accounts[0]);
                setChainId(chainId);
                return true;
            }
        } catch (err) {
            setError('Failed to connect wallet');
            console.error(err);
        }
        return false;
    }, []);

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts: unknown) => {
                if (Array.isArray(accounts) && accounts[0]) {
                    setAccount(accounts[0]);
                } else {
                    setAccount('');
                }
            });

            window.ethereum.on('chainChanged', (chainId: unknown) => {
                if (typeof chainId === 'string') {
                    setChainId(chainId);
                }
            });
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', () => {});
                window.ethereum.removeListener('chainChanged', () => {});
            }
        };
    }, []);

    return { account, chainId, error, connectWallet };
}; 