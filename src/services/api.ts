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
        } catch (error) {
            console.error('Registration API Error:', error);
            throw error;
        }
    },

    async  registerWithReferral(walletAddress: string, referredBy: string) {
        try {
            console.log('Registration Request:', {
                wallet_address: walletAddress,
                referred_by: referredBy
            });
            const response = await api.post('/register-referred', {
                wallet_address: walletAddress,
                referred_by: referredBy
            });
            console.log('Registration Response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Registration API Error:', error);
            throw error;
        }
    },

    // User Data APIs
    async getUserProfile(walletAddress: string): Promise<UserProfileData> {
        try {
            const response = await api.get(`/user/${walletAddress}`);
            return response.data;
        } catch (error) {
            console.error('User Profile API Error:', error);
            throw error;
        }
    },

    async bulkLookupWallets(addresses: string[]) {
        try {
            const response = await api.post('/bulk-lookup', {
                wallet_addresses: addresses
            });
            return response.data;
        } catch (error) {
            console.error('Bulk Lookup API Error:', error);
            throw error;
        }
    },

    // Referral APIs
    async getReferralInfo(referralCode: string) {
        try {
            const response = await api.get(`/referral/${referralCode}`);
            return response.data;
        } catch (error) {
            console.error('Referral Info API Error:', error);
            throw error;
        }
    }
};

// Error handling middleware
api.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error);
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
); 