import { Box, HStack, Text, VStack } from 'native-base';
import { useSelector } from 'react-redux';
import { RootState } from '@store/store';
import { Asset } from 'expo-media-library';
import { LinearGradient } from 'expo-linear-gradient';
import { durationToTime, trimString } from '@utils';
import { COLORS } from '@global';
import { SongStatus } from '@enums';
import { useMusicContext } from '@context';
import { PressableController } from '../PressableController';

type SongItemProps = {
  data: Asset;
  index: number;
};

export const SongItem = ({ data, index }: SongItemProps) => {
  const { songProgress, handlePlay, handleResume, handleStop, handlePause, handleSongIndex } =
    useMusicContext();
  const currentSong = useSelector((state: RootState) => state.song);
  const sameId = currentSong.id === data.id;

  const handlePlaySong = () => {
    handleSongIndex(index);
    handlePlay(SongStatus.PLAY, data.id, data.filename, data.uri, data.duration);
  };

  return (
    <Box
      mx={3}
      p={1}
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      bgColor={sameId ? COLORS.background_content_secondary : COLORS.background_content_primary}
      borderColor="gray.600"
      borderBottomWidth={2}>
      {sameId && (
        <LinearGradient
          colors={[COLORS.progress_bar_start, COLORS.progress_bar_end]}
          start={[0.7, 0.5]}
          end={[1, 0]}
          style={{ position: 'absolute', top: 0, height: 5, width: `${songProgress}%` }}
        />
      )}

      <HStack alignItems="center">
        <PressableController
          size={15}
          color={COLORS.inactive}
          name="playlist-plus"
          handleAction={() => {}}
        />
        <Text ml={2} fontWeight="bold">
          {trimString(data.filename)} - ({durationToTime(data.duration)})
        </Text>
      </HStack>

      <HStack>
        {!currentSong.id ||
          (sameId && (
            <>
              <PressableController color={COLORS.hold} name="stop" handleAction={handleStop} />

              {currentSong.songStatus !== SongStatus.PAUSE && (
                <PressableController color={COLORS.hold} name="pause" handleAction={handlePause} />
              )}

              <PressableController
                color={
                  currentSong.songStatus !== SongStatus.PAUSE ? COLORS.active : COLORS.inactive
                }
                name="play"
                handleAction={handleResume}
              />
            </>
          ))}
        {!sameId && (
          <PressableController color={COLORS.inactive} name="play" handleAction={handlePlaySong} />
        )}
      </HStack>
    </Box>
  );
};
