import { Box, HStack, Pressable, Text } from 'native-base';
import { Asset } from 'expo-media-library';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { durationToTime, trimString } from '@utils';
import { COLORS } from '@global';

export const AccordionItem = ({ data }: { data: Asset }) => {
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
        <Pressable>
          <MaterialCommunityIcons name="stop" size={30} color="white" />
        </Pressable>
        <Pressable>
          <MaterialCommunityIcons name="play" size={30} color="white" />
        </Pressable>
      </HStack>
    </Box>
  );
};
