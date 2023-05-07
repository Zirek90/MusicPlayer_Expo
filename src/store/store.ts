import { configureStore } from '@reduxjs/toolkit';
import backgroundReducer from './reducers/backgroundReducer';

export const store = configureStore({
  reducer: {
    background: backgroundReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
