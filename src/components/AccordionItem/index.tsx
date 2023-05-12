import { Box, HStack, Text } from 'native-base';
import { useSelector } from 'react-redux';
import { RootState } from '@store/store';
import { Asset } from 'expo-media-library';
import { LinearGradient } from 'expo-linear-gradient';
import { durationToTime, trimString } from '@utils';
import { COLORS } from '@global';
import { SongStatus } from '@enums';
import { useMusicContext } from '@context';
import { PressableController } from '../PressableController';

export const AccordionItem = ({ data }: { data: Asset }) => {
  const { songProgress, handleSong } = useMusicContext();
  const currentSong = useSelector((state: RootState) => state.song);
  const sameId = currentSong.id === data.id;

  return (
    <Box
      ml={3}
      p={1}
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      bgColor={COLORS.mode_content_background}
      borderColor="gray.300"
      borderWidth={1}>
      {sameId && (
        <LinearGradient
          colors={[COLORS.progress_bar_start, COLORS.progress_bar_end]}
          start={[0.7, 0.5]}
          end={[1, 0]}
          style={{ position: 'absolute', top: 0, height: 5, width: `${songProgress}%` }}
        />
      )}

      <Text>
        {trimString(data.filename)} - {durationToTime(data.duration)}
      </Text>

      <HStack>
        {!currentSong.id ||
          (sameId && (
            <>
              <PressableController
                color={COLORS.control_stop}
                name="stop"
                handleAction={() => handleSong(SongStatus.STOP)}
              />

              {currentSong.songStatus !== SongStatus.PAUSE && (
                <PressableController
                  color={COLORS.control_pause}
                  name="pause"
                  handleAction={() => handleSong(SongStatus.PAUSE)}
                />
              )}

              <PressableController
                color={
                  currentSong.songStatus !== SongStatus.PAUSE
                    ? COLORS.control_play_active
                    : COLORS.control_play_inactive
                }
                name="play"
                handleAction={() => handleSong(SongStatus.RESUME)}
              />
            </>
          ))}
        {!sameId && (
          <PressableController
            color={COLORS.control_play_inactive}
            name="play"
            handleAction={() => handleSong(SongStatus.PLAY, data.id, data.filename, data.uri)}
          />
        )}
      </HStack>
    </Box>
  );
};
