import { Box } from 'native-base';
import { Asset } from 'expo-media-library';
import { COLORS } from '@global';
import { SongItemProgress } from '../SongItemProgress';
import { SongItemControllers } from '../SongItemControllers';
import { withMusicContext } from '@hoc';
import { SongItemInformation } from '../SongItemInformation';

type SongItemProps = {
  data: Asset;
  index: number;
  id: string;
};
const SongItemComponent = ({ data, index, id }: SongItemProps) => {
  const sameId = id === data.id;

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

      <SongItemInformation data={data} />

      <SongItemControllers data={data} index={index} />
    </Box>
  );
};

export const SongItem = withMusicContext(SongItemComponent, {
  id: data => data.currentSong.id,
});
