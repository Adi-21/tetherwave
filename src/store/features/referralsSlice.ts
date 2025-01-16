import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getContracts } from '@/lib/constants/contracts';
import type { ReferralData } from '@/types/contract';

interface ReferralsState {
  referralData: ReferralData[];
  totalCount: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: ReferralsState = {
  referralData: [],
  totalCount: 0,
  currentPage: 1,
  isLoading: false,
  error: null
};

export const fetchReferralData = createAsyncThunk(
  'referrals/fetchData',
  async ({ address, page, itemsPerPage }: { address: string, page: number, itemsPerPage: number }) => {
    const { tetherWave } = getContracts();
    const data = await tetherWave.publicClient.readContract({
      ...tetherWave,
      functionName: 'getDirectReferralDataPaginated',
      args: [address as `0x${string}`, BigInt((page - 1) * itemsPerPage), BigInt(itemsPerPage)]
    }) as [ReferralData[], bigint];

    return {
      referralData: data[0],
      totalCount: Number(data[1])
    };
  }
);

const referralsSlice = createSlice({
  name: 'referrals',
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReferralData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchReferralData.fulfilled, (state, action) => {
        state.referralData = action.payload.referralData;
        state.totalCount = action.payload.totalCount;
        state.isLoading = false;
      })
      .addCase(fetchReferralData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch referral data';
      });
  }
});

export const { setCurrentPage } = referralsSlice.actions;
export default referralsSlice.reducer; 