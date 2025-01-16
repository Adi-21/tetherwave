import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from './features/dashboardSlice';
import referralsReducer from './features/referralsSlice';
import genealogyReducer from './features/genealogySlice';
import communityReducer from './features/communitySlice';
import royaltyReducer from './features/royaltySlice';
export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    referrals: referralsReducer,
    genealogy: genealogyReducer,
    community: communityReducer,
    royalty: royaltyReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 