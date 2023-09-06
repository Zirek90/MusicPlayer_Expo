export type SongProgressProps = {
  songProgress: number;
  duration: number;
  handleSongProgress: (progress: number) => Promise<void>;
};
