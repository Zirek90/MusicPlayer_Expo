import { createSlice } from '@reduxjs/toolkit';
import { SongStatus } from '@enums';

type initialStateProps = {
  id: string | null;
  filename: string | null;
  uri: string | null;
  status: SongStatus;
};

const initialState: initialStateProps = {
  id: null,
  filename: null,
  uri: null,
  status: SongStatus.STOP,
};

export const songSlice = createSlice({
  name: 'song',
  initialState,
  reducers: {
    playSong: (state, action) => {
      state = action.payload;
      return state;
    },
    stopSong: (state, action) => {
      state.status = action.payload.status;
      state.id = null;
      return state;
    },
  },
});

export const { playSong, stopSong } = songSlice.actions;
