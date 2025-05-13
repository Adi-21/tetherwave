import { createPublicClient, createWalletClient, http, custom } from 'viem';
import type { Chain } from 'viem';
import { siteConfig } from '../config/site';
import TetherWaveABI from '../abis/Tether.json';
import USDTABI from '../abis/USDT.json';
import RoyaltyABI from '../abis/Royalty.json';
// Define opBNB testnet chain
// export const opBNBTestnet: Chain = {
//     id: 5611,
//     name: 'opBNB Testnet',
//     nativeCurrency: {
//         decimals: 18,
//         name: 'tBNB',
//         symbol: 'tBNB',
//     },
//     rpcUrls: {
//         default: {
//             http: ['https://opbnb-testnet-rpc.bnbchain.org']
//         },
//         public: {
//             http: ['https://opbnb-testnet-rpc.bnbchain.org']
//         }
//     },
//     blockExplorers: {
//         default: {
//             name: 'opBNBScan',
//             url: 'https://opbnb-testnet.bscscan.com'
//         }
//     },
//     testnet: true
// };

export const opBNB: Chain = {
    id: 204,
    name: 'opBNB Mainnet',
    nativeCurrency: {
        decimals: 18,
        name: 'BNB',
        symbol: 'BNB',
    },
    rpcUrls: {
        default: {
            http: ['https://opbnb-mainnet-rpc.bnbchain.org']
        },
        public: {
            http: ['https://opbnb-mainnet-rpc.bnbchain.org']
        }
    },
    blockExplorers: {
        default: {
            name: 'opBNBScan',
            url: 'http://opbnbscan.com/'
        }
    }
}

export const publicClient = createPublicClient({
    chain: opBNB,
    transport: http()
});

export const getContracts = () => {
    if (!window.ethereum) throw new Error('No ethereum provider found');

    const walletClient = createWalletClient({
        chain: opBNB,
        transport: custom(window.ethereum)
    });

    return {
        tetherWave: {
            address: siteConfig.contracts.TetherWave as `0x${string}`,
            abi: TetherWaveABI,
            publicClient,
            walletClient
        },
        usdt: {
            address: siteConfig.contracts.USDT as `0x${string}`,
            abi: USDTABI,
            publicClient,
            walletClient
        },
        royalty: {
            address: siteConfig.contracts.Royalty as `0x${string}`,
            abi: RoyaltyABI,
            publicClient,
            walletClient
        }
    };
}; 