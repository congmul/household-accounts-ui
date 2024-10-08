import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RefreshState {
    isCalenderPageRefresh: boolean;
    isHandleItemSlideRefresh: boolean;
    isAnalysisPageRefresh: boolean;
    isBudgetPageRefresh: boolean;
    isSettingPageRefresh: boolean;
}

const initialState: RefreshState = {
    isCalenderPageRefresh: false,
    isHandleItemSlideRefresh: false,
    isAnalysisPageRefresh: false,
    isBudgetPageRefresh: false,
    isSettingPageRefresh: false
};

const refreshSlice = createSlice({
  name: 'refresh',
  initialState,
  reducers: {
    setIsCalenderPageRefresh: (state, action: PayloadAction<boolean>) => {
      state.isCalenderPageRefresh = action.payload
    },
    setIsHandleItemSlideRefresh: (state, action: PayloadAction<boolean>) => {
      state.isHandleItemSlideRefresh = action.payload
    },
    setIsAnalysisPageRefresh: (state, action: PayloadAction<boolean>) => {
      state.isAnalysisPageRefresh = action.payload
    },
    setIsBudgetPageRefresh: (state, action: PayloadAction<boolean>) => {
      state.isBudgetPageRefresh = action.payload
    },
    setIsSettingPageRefresh: (state, action: PayloadAction<boolean>) => {
      state.isSettingPageRefresh = action.payload
    },
  },
});

export const refreshActions = refreshSlice.actions;

export default refreshSlice.reducer;
