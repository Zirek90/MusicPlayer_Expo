import { HStack } from 'native-base';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import { PressableController } from '../PressableController';
import { SongStatus } from '@enums';
import { RootState } from '@store/store';
import { COLORS } from '@global';
import { useMusicContext } from '@context';

type PlayerControllersProps = {
  handleMusicPlayerPlay: () => Promise<void>;
  handleResume: () => Promise<void>;
  handlePause: () => Promise<void>;
  handleLoop: () => Promise<void>;
  handlePrevious: () => Promise<void>;
  handleNext: () => Promise<void>;
};

const withContext = (Component: React.FC<PlayerControllersProps>) => {
  const MemoComponent = memo(Component);

  return () => {
    const {
      handleResume,
      handlePause,
      handleLoop,
      handlePrevious,
      handleNext,
      handleMusicPlayerPlay,
    } = useMusicContext();
    return (
      <MemoComponent
        handleResume={handleResume}
        handlePause={handlePause}
        handleLoop={handleLoop}
        handlePrevious={handlePrevious}
        handleNext={handleNext}
        handleMusicPlayerPlay={handleMusicPlayerPlay}
      />
    );
  };
};

export const PlayerControllers = withContext(
  ({
    handleResume,
    handlePause,
    handleLoop,
    handlePrevious,
    handleNext,
    handleMusicPlayerPlay,
  }) => {
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
          <PressableController
            size={25}
            color="grey"
            name="playlist-plus"
            handleAction={() => {}}
          />
        </HStack>
      </HStack>
    );
  },
);
