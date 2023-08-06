import { useCallback } from 'react';
import { Box, FlatList, Text } from 'native-base';
import { Asset } from 'expo-media-library';
import { SongItem } from '../SongItem';
import { useAlbumsContext } from '@context';

const SONG_HEIGHT = 45;

export const AlbumSongs = () => {
  const { activeAlbum, currentlyPlayedAlbum } = useAlbumsContext();
  const albumSource = activeAlbum || currentlyPlayedAlbum;

  const getSongLayout = useCallback(
    (_data: Asset[] | null | undefined, index: number) => ({
      length: SONG_HEIGHT,
      offset: SONG_HEIGHT * index,
      index,
    }),
    [],
  );

  const renderSongItem = useCallback(
    ({ item, index }: { item: Asset; index: number }) => <SongItem data={item} index={index} />,
    [],
  );

  const songKeyExtractor = useCallback((item: Asset) => item.id, []);

  if (!albumSource) return null;

  return (
    <Box>
      <Text fontSize="2xl" my={3}>
        {albumSource.album}
      </Text>
      <FlatList
        data={albumSource.items}
        keyExtractor={songKeyExtractor}
        renderItem={renderSongItem}
        getItemLayout={getSongLayout}
        removeClippedSubviews // Unmount components when outside of window
        updateCellsBatchingPeriod={100} // Increase time between renders
        maxToRenderPerBatch={10}
      />
    </Box>
  );
};
