import { createSlice } from '@reduxjs/toolkit';
import { DARK_BG_PATHS } from '@global';
import { BackgroundPaths } from '@types';

type initialStateProps = {
  mode: string;
  bgImage: null | BackgroundPaths;
};

const initialState: initialStateProps = {
  mode: 'dark',
  bgImage: null,
};

export const backgroundSlice = createSlice({
  name: 'background',
  initialState,
  reducers: {
    // toDo later if light mode compareSpecificity, switch paths depends on mode
    setBackground: state => {
      state.bgImage = DARK_BG_PATHS[Math.floor(Math.random() * DARK_BG_PATHS.length)];
    },
  },
});

export const { setBackground } = backgroundSlice.actions;

export default backgroundSlice.reducer;
