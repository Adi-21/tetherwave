import axios from 'axios';
import type { UserProfileData } from '@/types/contract';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const dashboardAPI = {
    // Registration APIs
    async register(walletAddress: string) {
        try {
            const response = await api.post('/register', {
                wallet_address: walletAddress
            });
            return response.data;
        } catch {
            throw new Error('Registration API Error');
        }
    },

    async  registerWithReferral(walletAddress: string, referredBy: string) {
        try {
            const response = await api.post('/register-referred', {
                wallet_address: walletAddress,
                referred_by: referredBy
            });
            return response.data;
        } catch {
            throw new Error('Registration API Error');
        }
    },

    // User Data APIs
    async getUserProfile(walletAddress: string): Promise<UserProfileData> {
        try {
            const response = await api.get(`/user/${walletAddress}`);
            return response.data;
        } catch {
            throw new Error('User Profile API Error');
        }
    },

    async bulkLookupWallets(addresses: string[]) {
        try {
            const response = await api.post('/bulk-lookup', {
                wallet_addresses: addresses.map(addr => addr)
            });

            const transformedData: Record<string, string> = {};
            for (const address of addresses) {
                const addr = address;
                if (response.data.mapping?.[addr]) {
                    transformedData[addr.toLowerCase()] = response.data.mapping[addr];
                }
            }
            return transformedData;
        } catch {
            throw new Error('Bulk Lookup API Error');
        }
    },

    // Referral APIs
    async getReferralInfo(referralCode: string) {
        try {
            const response = await api.get(`/referral/${referralCode}`);
            return response.data;
        } catch {
            throw new Error('Referral Info API Error');
        }
    }
};

// Error handling middleware
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
); 