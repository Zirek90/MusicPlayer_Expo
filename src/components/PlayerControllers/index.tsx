import { HStack } from 'native-base';
import { SongStatus } from '@enums';
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
  songStatus: SongStatus | null;
  isLooping: boolean;
};

const PlayerControllersComponent = ({
  handleResume,
  handlePause,
  handleLoop,
  handlePrevious,
  handleNext,
  handleMusicPlayerPlay,
  songStatus,
  isLooping,
}: PlayerControllersProps) => {
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
          color={songStatus === SongStatus.PAUSE ? COLORS.hold : COLORS.inactive}
          name="pause-circle-outline"
          handleAction={handlePause}
        />
        <PressableController
          size={60}
          color={songStatus === SongStatus.PLAY ? COLORS.active : COLORS.inactive}
          name="play-circle-outline"
          handleAction={() =>
            songStatus === SongStatus.PAUSE ? handleResume() : handleMusicPlayerPlay()
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
  songStatus: data => data.currentSong.songStatus,
  isLooping: data => data.currentSong.isLooping,
});
