import { Box } from 'native-base';
import { COLORS } from '@global';
import { MusicPlayerHeader } from '../MusicPlayerHeader';
import { SongProgress } from '../SongProgress';
import { PlayerControllers } from '../PlayerControllers';

export const MusicPlayer = () => {
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
      <SongProgress />
      <PlayerControllers />
    </Box>
  );
};
