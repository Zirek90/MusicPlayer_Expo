import { HStack } from 'native-base';
import { useSelector } from 'react-redux';
import { PressableController } from '../PressableController';
import { SongStatus } from '@enums';
import { RootState } from '@store/store';
import { COLORS } from '@global';
import { useMusicContext } from '@context';

export const PlayerControllers = () => {
  const {
    handleResume,
    handlePause,
    handleLoop,
    handlePrevious,
    handleNext,
    handleMusicPlayerPlay,
  } = useMusicContext();
  const currentSongStatus = useSelector((state: RootState) => state.song.songStatus);
  const isLooping = useSelector((state: RootState) => state.song.isLooping);

  return (
    <HStack justifyContent="space-between" alignItems="center" px={1}>
      <HStack alignItems="center">
        <PressableController
          size={25}
          color={isLooping ? COLORS.control_play_active : COLORS.control_play_inactive}
          name="repeat"
          handleAction={handleLoop}
        />
        <PressableController
          size={45}
          color="grey"
          name="skip-previous-circle-outline"
          handleAction={handlePrevious}
        />
      </HStack>
      <HStack>
        <PressableController
          size={60}
          color={
            currentSongStatus === SongStatus.PAUSE
              ? COLORS.control_pause
              : COLORS.control_play_inactive
          }
          name="pause-circle-outline"
          handleAction={handlePause}
        />
        <PressableController
          size={60}
          color={
            currentSongStatus === SongStatus.PLAY
              ? COLORS.control_play_active
              : COLORS.control_play_inactive
          }
          name="play-circle-outline"
          handleAction={() =>
            currentSongStatus === SongStatus.STOP ? handleMusicPlayerPlay() : handleResume()
          }
        />
      </HStack>
      <HStack alignItems="center">
        <PressableController
          size={45}
          color="grey"
          name="skip-next-circle-outline"
          handleAction={handleNext}
        />
        <PressableController size={25} color="grey" name="playlist-plus" handleAction={() => {}} />
      </HStack>
    </HStack>
  );
};
