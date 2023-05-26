import { LinearGradient } from 'expo-linear-gradient';
import { useMusicContext } from '@context';
import { COLORS } from '@global';

export const SongItemProgress = () => {
  const { songProgress } = useMusicContext();
  return (
    <LinearGradient
      colors={[COLORS.progress_bar_start, COLORS.progress_bar_end]}
      start={[0.7, 0.5]}
      end={[1, 0]}
      style={{ position: 'absolute', top: 0, height: 5, width: `${songProgress}%` }}
    />
  );
};
