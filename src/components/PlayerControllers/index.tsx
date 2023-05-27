import { HStack } from 'native-base';
import { useSelector } from 'react-redux';
import { SongStatus } from '@enums';
import { RootState } from '@store/store';
import { COLORS } from '@global';
import { withMusicContext } from '@hoc';
import { PressableController } from '../PressableController';

type PlayerControllersProps = {
  handleMusicPlayerPlay: () => Promise<void>;
  handleResume: () => Promise<void>;
  handlePause: () => Promise<void>;
  handleLoop: () => Promise<void>;
  handlePrevious: () => Promise<void>;
  handleNext: () => Promise<void>;
};

const PlayerControllersComponent = ({
  handleResume,
  handlePause,
  handleLoop,
  handlePrevious,
  handleNext,
  handleMusicPlayerPlay,
}: PlayerControllersProps) => {
  const currentSongStatus = useSelector((state: RootState) => state.song.songStatus);
  const isLooping = useSelector((state: RootState) => state.song.isLooping);
  return (
    <HStack justifyContent="space-between" alignItems="center" px={1}>
      <HStack alignItems="center">
        <PressableController
          size={25}
          color={isLooping ? COLORS.active : COLORS.inactive}
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
          color={currentSongStatus === SongStatus.PAUSE ? COLORS.hold : COLORS.inactive}
          name="pause-circle-outline"
          handleAction={handlePause}
        />
        <PressableController
          size={60}
          color={currentSongStatus === SongStatus.PLAY ? COLORS.active : COLORS.inactive}
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

export const PlayerControllers = withMusicContext(PlayerControllersComponent, {
  handleResume: data => data.handleResume,
  handlePause: data => data.handlePause,
  handleLoop: data => data.handleLoop,
  handlePrevious: data => data.handlePrevious,
  handleNext: data => data.handleNext,
  handleMusicPlayerPlay: data => data.handleMusicPlayerPlay,
});
