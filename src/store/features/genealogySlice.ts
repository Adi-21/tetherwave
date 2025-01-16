import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getContracts } from '@/lib/constants/contracts';

interface GenealogyState {
    currentAddress: string | null;
    downlines: string[];
    currentDepth: number;
    isLoading: boolean;
    error: string | null;
}

const initialState: GenealogyState = {
    currentAddress: null,
    downlines: [],
    currentDepth: 1,
    isLoading: false,
    error: null
};

export const fetchGenealogyData = createAsyncThunk(
    'genealogy/fetchData',
    async (address: string) => {
        const { tetherWave } = getContracts();
        const data = await tetherWave.publicClient.readContract({
            ...tetherWave,
            functionName: 'getDownlineByDepthPaginated',
            args: [address as `0x${string}`, 1, BigInt(0), BigInt(3)]
        }) as [string[], string[], number[], number[], bigint];

        return {
            downlines: data[0],
            currentAddress: address
        };
    }
);

const genealogySlice = createSlice({
    name: 'genealogy',
    initialState,
    reducers: {
        setCurrentAddress: (state, action) => {
            state.currentAddress = action.payload;
        },
        setCurrentDepth: (state, action) => {
            state.currentDepth = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGenealogyData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchGenealogyData.fulfilled, (state, action) => {
                state.downlines = action.payload.downlines;
                state.currentAddress = action.payload.currentAddress;
                state.isLoading = false;
            })
            .addCase(fetchGenealogyData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch genealogy data';
            });
    }
});

export const { setCurrentAddress, setCurrentDepth } = genealogySlice.actions;
export default genealogySlice.reducer; 