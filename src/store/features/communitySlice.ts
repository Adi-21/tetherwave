import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getContracts } from '@/lib/constants/contracts';

interface CommunityState {
  downlineData: {
    downlineAddresses: string[];
    sponsorAddresses: string[];
    directReferralsCount: number[];
    currentLevels: number[];
    totalCount: number;
  };
  selectedLevel: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: CommunityState = {
  downlineData: {
    downlineAddresses: [],
    sponsorAddresses: [],
    directReferralsCount: [],
    currentLevels: [],
    totalCount: 0
  },
  selectedLevel: 1,
  currentPage: 1,
  isLoading: false,
  error: null
};

export const fetchDownlineData = createAsyncThunk(
  'community/fetchData',
  async ({ address, level, page, itemsPerPage }: { address: string, level: number, page: number, itemsPerPage: number }) => {
    const { tetherWave } = getContracts();
    const data = await tetherWave.publicClient.readContract({
      ...tetherWave,
      functionName: 'getDownlineByDepthPaginated',
      args: [address as `0x${string}`, level, BigInt((page - 1) * itemsPerPage), BigInt(itemsPerPage)]
    }) as [string[], string[], number[], number[], bigint];

    const [downlineAddresses, sponsorAddresses, directReferralsCount, currentLevels, totalCount] = data;
    
    return {
      downlineAddresses,
      sponsorAddresses,
      directReferralsCount,
      currentLevels,
      totalCount: Number(totalCount)
    };
  }
);

const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    setSelectedLevel: (state, action) => {
      state.selectedLevel = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDownlineData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDownlineData.fulfilled, (state, action) => {
        state.downlineData = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchDownlineData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch downline data';
      });
  }
});

export const { setSelectedLevel, setCurrentPage } = communitySlice.actions;
export default communitySlice.reducer; 