import { Box, HStack, Text } from 'native-base';
import { useSelector } from 'react-redux';
import { RootState } from '@store/store';
import { Asset } from 'expo-media-library';
import { LinearGradient } from 'expo-linear-gradient';
import { durationToTime, trimString } from '@utils';
import { COLORS } from '@global';
import { SongStatus } from '@enums';
import { useSongContext } from '@context';
import { AccordionItemController } from '../AccordionItemController';

export const AccordionItem = ({ data }: { data: Asset }) => {
  const { songProgress, handleSong } = useSongContext();
  const currentSong = useSelector((state: RootState) => state.song);
  const sameId = currentSong.id === data.id;

  return (
    <Box
      ml={3}
      p={1}
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      bgColor={COLORS.album_file_background}
      borderColor="gray.300"
      borderWidth={1}>
      {sameId && (
        <LinearGradient
          colors={['#61ae5c', '#195614']}
          start={[0.7, 0.5]}
          end={[1, 0]}
          style={{ position: 'absolute', top: 0, height: 5, width: `${songProgress}%` }}
        />
      )}

      <Text color="white">
        {trimString(data.filename)} - {durationToTime(data.duration)}
      </Text>

      <HStack>
        {!currentSong.id ||
          (sameId && (
            <>
              <AccordionItemController
                color="red"
                name="stop"
                handleAction={() => handleSong(SongStatus.STOP)}
              />

              {currentSong.songStatus !== SongStatus.PAUSE && (
                <AccordionItemController
                  color="red"
                  name="pause"
                  handleAction={() => handleSong(SongStatus.PAUSE)}
                />
              )}

              <AccordionItemController
                color={currentSong.songStatus !== SongStatus.PAUSE ? 'green' : 'white'}
                name="play"
                handleAction={() => handleSong(SongStatus.RESUME)}
              />
            </>
          ))}
        {!sameId && (
          <AccordionItemController
            color="white"
            name="play"
            handleAction={() => handleSong(SongStatus.PLAY, data.id, data.filename, data.uri)}
          />
        )}
      </HStack>
    </Box>
  );
};
