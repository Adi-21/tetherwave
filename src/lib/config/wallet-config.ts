"use client";

import '@rainbow-me/rainbowkit/styles.css';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { createConfig, http } from 'wagmi';
import { opBNBTestnet } from 'wagmi/chains';
import {
    metaMaskWallet,
    walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';

const transport = http();
const chains = [opBNBTestnet];
const projectId = '85ea157b5dd90e1472df0fbb28950fef';

const connectors = connectorsForWallets([{
    groupName: 'Popular',
    wallets: [
        metaMaskWallet,
        walletConnectWallet
    ]
}], { projectId, appName: 'tetherwave' });

export const wagmiConfig = createConfig({
    chains: [opBNBTestnet],
    connectors,
    transports: {
        [opBNBTestnet.id]: transport
    }
});

export { chains }; 