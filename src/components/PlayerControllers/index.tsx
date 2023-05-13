import { HStack } from 'native-base';
import { useSelector } from 'react-redux';
import { PressableController } from '../PressableController';
import { SongStatus } from '@enums';
import { RootState } from '@store/store';
import { COLORS } from '@global';

type PlayerControllersProps = {
  handleSong: (songStatus: SongStatus) => Promise<void>;
};

export const PlayerControllers = ({ handleSong }: PlayerControllersProps) => {
  const currentSongStatus = useSelector((state: RootState) => state.song.songStatus);

  return (
    <HStack justifyContent="space-between" alignItems="center" px={1}>
      <PressableController
        size={45}
        color="grey"
        name="skip-previous-circle-outline"
        handleAction={() => {}}
      />
      <HStack>
        <PressableController
          size={60}
          color={
            currentSongStatus === SongStatus.PAUSE
              ? COLORS.control_pause
              : COLORS.control_play_inactive
          }
          name="pause-circle-outline"
          handleAction={() => handleSong(SongStatus.PAUSE)}
        />
        <PressableController
          size={60}
          color={
            currentSongStatus === SongStatus.PLAY
              ? COLORS.control_play_active
              : COLORS.control_play_inactive
          }
          name="play-circle-outline"
          handleAction={() => handleSong(SongStatus.RESUME)}
        />
      </HStack>
      <PressableController
        size={45}
        color="grey"
        name="skip-next-circle-outline"
        handleAction={() => {}}
      />
    </HStack>
  );
};
