import { Box, HStack, Text } from 'native-base';
import { Asset } from 'expo-media-library';
import { durationToTime, trimString } from '@utils';
import { COLORS } from '@global';
import { PressableController } from '../PressableController';
import { SongItemProgress } from '../SongItemProgress';
import { SongItemControllers } from '../SongItemControllers';
import { withMusicContext } from '@hoc';

type SongItemProps = {
  data: Asset;
  index: number;
  id: string;
};
const SongItemComponent = ({ data, index, id }: SongItemProps) => {
  const sameId = id === data.id;

  const handleAction = () => {};
  return (
    <Box
      mx={3}
      p={1}
      h={45}
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
          handleAction={handleAction}
        />
        <Text ml={2}>
          {trimString(data.filename)} - ({durationToTime(data.duration)})
        </Text>
      </HStack>

      <SongItemControllers data={data} index={index} />
    </Box>
  );
};

export const SongItem = withMusicContext(SongItemComponent, {
  id: data => data.currentSong.id,
});
