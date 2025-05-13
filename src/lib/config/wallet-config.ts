"use client";

import '@rainbow-me/rainbowkit/styles.css';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { createConfig, http } from 'wagmi';
import { opBNB } from 'wagmi/chains';
import {
    metaMaskWallet,
    walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';

const transport = http();
const chains = [opBNB];
const projectId = '733d24cd8005c14baf78ac6defd5c2f9';

const connectors = connectorsForWallets([{
    groupName: 'Popular',
    wallets: [
        metaMaskWallet,
        walletConnectWallet
    ]
}], { projectId, appName: 'tetherwave' });

export const wagmiConfig = createConfig({
    chains: [ opBNB],
    connectors,
    transports: {
        // [opBNBTestnet.id]: transport,
        [opBNB.id]: transport
    }
});

export { chains }; 