import { HStack } from 'native-base';
import { Asset } from 'expo-media-library';
import { COLORS } from '@global';
import { SongStatus } from '@enums';
import { withMusicContext } from '@hoc';
import { PressableController } from '../PressableController';

type SongItemControllersProps = {
  data: Asset;
  index: number;
  id: string;
  songStatus: SongStatus | null;
  handlePlay: (
    songStatus: SongStatus,
    id: string,
    filename: string,
    uri: string,
    duration: number,
    index: number,
  ) => Promise<void>;
  handleResume: () => Promise<void>;
  handlePause: () => Promise<void>;
};

const SongItemControllersComponent = ({
  handlePlay,
  handleResume,
  handlePause,
  data,
  index,
  id,
  songStatus,
}: SongItemControllersProps) => {
  const sameId = id === data.id;

  const handlePlaySong = () => {
    handlePlay(SongStatus.PLAY, data.id, data.filename, data.uri, data.duration, index);
  };

  return (
    <HStack>
      {!id ||
        (sameId && (
          <>
            {songStatus !== SongStatus.PAUSE && (
              <PressableController color={COLORS.hold} name="pause" handleAction={handlePause} />
            )}

            <PressableController color={COLORS.active} name="play" handleAction={handleResume} />
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
  handlePause: data => data.handlePause,
  id: data => data.currentSong.id,
  songStatus: data => data.currentSong.songStatus,
});
