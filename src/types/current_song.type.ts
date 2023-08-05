import { SongStatus } from '@enums';

export type CurrentSong = {
  id: string;
  filename: string;
  isLooping: boolean;
  songStatus: SongStatus | null;
  isSongDone: boolean;
  duration: number;
  index: number;
};
