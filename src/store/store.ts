import { configureStore } from '@reduxjs/toolkit';
import { backgroundSlice, songSlice } from './reducers';

export const store = configureStore({
  reducer: {
    background: backgroundSlice.reducer,
    song: songSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

// toDo unused if project done and still no need for redux then remove the store and redux libraries
