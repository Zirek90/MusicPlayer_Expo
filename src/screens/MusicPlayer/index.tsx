import { Box } from 'native-base';
import { COLORS } from '@global';
import { MusicPlayerHeader, SongProgress, PlayerControllers } from '@components';

export const MusicPlayer = () => {
  return (
    <Box
      bgColor={COLORS.background_primary}
      p={1}
      borderRadius={10}
      position="absolute"
      bottom={0}
      right={2}
      left={2}>
      <MusicPlayerHeader />
      <SongProgress />
      <PlayerControllers />
    </Box>
  );
};
