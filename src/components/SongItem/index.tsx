import { Box, HStack, Text } from 'native-base';
import { useSelector } from 'react-redux';
import { RootState } from '@store/store';
import { Asset } from 'expo-media-library';
import { durationToTime, trimString } from '@utils';
import { COLORS } from '@global';
import { PressableController } from '../PressableController';
import { SongItemProgress } from '../SongItemProgress';
import { SongItemControllers } from '../SongItemControllers';

type SongItemProps = {
  data: Asset;
  index: number;
};

export const SongItem = ({ data, index }: SongItemProps) => {
  const currentSong = useSelector((state: RootState) => state.song);
  const sameId = currentSong.id === data.id;

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
      {sameId && <SongItemProgress />}

      <HStack alignItems="center">
        <PressableController
          size={15}
          color={COLORS.inactive}
          name="playlist-plus"
          handleAction={() => {}}
        />
        <Text ml={2}>
          {trimString(data.filename)} - ({durationToTime(data.duration)})
        </Text>
      </HStack>

      <SongItemControllers data={data} index={index} />
    </Box>
  );
};
