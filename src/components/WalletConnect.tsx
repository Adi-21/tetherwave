"use client";

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { Button } from './ui/Button';
import { useEffect } from 'react';

export const WalletConnect = () => {
    const { isConnected } = useAccount();
    const router = useRouter();

    useEffect(() => {
        if (isConnected) {
            router.push('/dashboard');
        }
    }, [isConnected, router]);

    return (
        <ConnectButton.Custom>
            {({
                account,
                chain,
                openChainModal,
                openConnectModal,
                mounted,
            }) => {
                const ready = mounted;
                const connected = ready && account && chain;

                return (
                    <div>
                        {(() => {
                            if (!connected) {
                                return (
                                    <Button
                                        onClick={openConnectModal}
                                        variant="default"
                                        className="bg-[#f3ba2f] text-black hover:bg-[#f3ba2f]/90 shadow-[4px_4px_12px_#f3ba2f90,-4px_-4px_12px_#f3ba2f90] h-10 font-semibold transition-all duration-300"
                                    >
                                        Connect Wallet    
                                    </Button>
                                );
                            }

                            if (chain?.unsupported) {
                                return (
                                    <Button
                                        onClick={openChainModal}
                                        variant="default"
                                        className="bg-red-500 hover:bg-red-600 text-white shadow-[4px_4px_12px_#ef444450,-4px_-4px_12px_#ef444450] h-10 font-semibold transition-all duration-300"
                                    >
                                        Wrong Network
                                    </Button>
                                );
                            }

                            return null;
                        })()}
                    </div>
                );
            }}
        </ConnectButton.Custom>
    );
};