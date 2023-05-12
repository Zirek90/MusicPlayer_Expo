import { createSlice } from '@reduxjs/toolkit';
import { SongStatus } from '@enums';

type initialStateProps = {
  id: string | null;
  filename: string | null;
  uri: string | null;
  songStatus: SongStatus;
};

const initialState: initialStateProps = {
  id: null,
  filename: null,
  uri: null,
  songStatus: SongStatus.STOP,
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
      state.songStatus = action.payload.songStatus;
      state.id = null;
      state.filename = null;
      state.uri = null;
      return state;
    },
    pauseSong: (state, action) => {
      state.songStatus = action.payload.songStatus;
      return state;
    },
    resumeSong: state => {
      state.songStatus = SongStatus.PLAY;
      return state;
    },
  },
});

export const { playSong, stopSong, pauseSong, resumeSong } = songSlice.actions;
