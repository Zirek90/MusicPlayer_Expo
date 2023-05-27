import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@global';
import { withMusicContext } from '@hoc';

type SongItemProgressProps = {
  songProgress: number;
};

const SongItemProgressComponent = ({ songProgress }: SongItemProgressProps) => {
  return (
    <LinearGradient
      colors={[COLORS.progress_bar_start, COLORS.progress_bar_end]}
      start={[0.7, 0.5]}
      end={[1, 0]}
      style={{ position: 'absolute', top: 0, height: 5, width: `${songProgress}%` }}
    />
  );
};

export const SongItemProgress = withMusicContext(SongItemProgressComponent, {
  songProgress: data => data.songProgress,
});
