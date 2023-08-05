import { Box } from 'native-base';
import { AlbumSongs, AlbumTitles } from '@components';

export const AlbumList = () => {
  return (
    <Box>
      <AlbumTitles />
      <AlbumSongs />
    </Box>
  );
};
