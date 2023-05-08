import { Box, HStack, Pressable, Text } from 'native-base';
import { Asset } from 'expo-media-library';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '@store/store';
import { durationToTime, trimString } from '@utils';
import { COLORS } from '@global';
import { SongStatus } from '@enums';

export const AccordionItem = ({
  data,
  handleSong,
}: {
  data: Asset;
  handleSong: (id: string, filename: string, uri: string, status: SongStatus) => Promise<void>;
}) => {
  const currentSongId = useSelector((state: RootState) => state.song.id);

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
      <Text color="white">
        {trimString(data.filename)} - {durationToTime(data.duration)}
      </Text>
      <HStack>
        {!currentSongId ||
          (currentSongId === data.id && (
            <Pressable>
              <MaterialCommunityIcons
                name="stop"
                size={30}
                color="red"
                onPress={() => handleSong(data.id, data.filename, data.uri, SongStatus.STOP)}
              />
            </Pressable>
          ))}
        <Pressable>
          <MaterialCommunityIcons
            name="play"
            size={30}
            color={currentSongId === data.id ? 'green' : 'white'}
            onPress={() => handleSong(data.id, data.filename, data.uri, SongStatus.PLAY)}
          />
        </Pressable>
      </HStack>
    </Box>
  );
};
