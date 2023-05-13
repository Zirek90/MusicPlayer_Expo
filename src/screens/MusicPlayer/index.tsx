import { Box } from 'native-base';
import { COLORS } from '@global';
import { MusicPlayerHeader, SongProgress, PlayerControllers } from '@components';
import { useMusicContext } from '@context';

export const MusicPlayer = () => {
  const { songProgress, handleSongProgress, handleSong } = useMusicContext();
  return (
    <Box
      bgColor={COLORS.mode_background}
      p={1}
      borderRadius={10}
      position="absolute"
      bottom={0}
      right={2}
      left={2}>
      <MusicPlayerHeader />
      <SongProgress songProgress={songProgress} handleSongProgress={handleSongProgress} />
      <PlayerControllers handleSong={handleSong} />
    </Box>
  );
};
