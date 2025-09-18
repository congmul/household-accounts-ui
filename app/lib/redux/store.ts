import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import calendarReducer from './reducers/calendarSlice';
import refreshReducer from './reducers/refreshSlice';
import accountBookReducer from './reducers/accountBookSlice';

export const store = configureStore({
  reducer: {
    calendar: calendarReducer,
    refresh: refreshReducer,
    accountBook: accountBookReducer,
  },
  devTools: process.env.NODE_ENV !== 'production'
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export a hook that can be reused to resolve types
export const useAppDispatch: () => AppDispatch = useDispatch;
