import { HStack } from 'native-base';
import { useSelector } from 'react-redux';
import { Asset } from 'expo-media-library';
import { RootState } from '@store/store';
import { COLORS } from '@global';
import { SongStatus } from '@enums';
import { withMusicContext } from '@hoc';
import { PressableController } from '../PressableController';

type SongItemControllersProps = {
  data: Asset;
  index: number;
  handlePlay: (
    songStatus: SongStatus,
    id: string,
    filename: string,
    uri: string,
    duration: number,
  ) => Promise<void>;
  handleSongIndex: (index: number) => void;
  handleResume: () => Promise<void>;
  handleStop: () => Promise<void>;
  handlePause: () => Promise<void>;
};

const SongItemControllersComponent = ({
  handlePlay,
  handleResume,
  handleStop,
  handlePause,
  handleSongIndex,
  data,
  index,
}: SongItemControllersProps) => {
  const currentSong = useSelector((state: RootState) => state.song);
  const sameId = currentSong.id === data.id;

  const handlePlaySong = () => {
    handleSongIndex(index);
    handlePlay(SongStatus.PLAY, data.id, data.filename, data.uri, data.duration);
  };

  return (
    <HStack>
      {!currentSong.id ||
        (sameId && (
          <>
            <PressableController color={COLORS.hold} name="stop" handleAction={handleStop} />

            {currentSong.songStatus !== SongStatus.PAUSE && (
              <PressableController color={COLORS.hold} name="pause" handleAction={handlePause} />
            )}

            <PressableController
              color={currentSong.songStatus !== SongStatus.PAUSE ? COLORS.active : COLORS.inactive}
              name="play"
              handleAction={handleResume}
            />
          </>
        ))}
      {!sameId && (
        <PressableController color={COLORS.inactive} name="play" handleAction={handlePlaySong} />
      )}
    </HStack>
  );
};

export const SongItemControllers = withMusicContext(SongItemControllersComponent, {
  handlePlay: data => data.handlePlay,
  handleResume: data => data.handleResume,
  handleStop: data => data.handleStop,
  handlePause: data => data.handlePause,
  handleSongIndex: data => data.handleSongIndex,
});
