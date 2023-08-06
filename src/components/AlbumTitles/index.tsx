import { useCallback } from 'react';
import { Box, FlatList, Pressable, Text } from 'native-base';
import { Album } from '@types';
import { COLORS } from '@global';
import { useAlbumsContext } from '@context';

export const AlbumTitles = () => {
  const { albumList, activeAlbum, currentlyPlayedAlbum, handleActiveAlbum } = useAlbumsContext();

  const renderAlbumItem = useCallback(
    ({ item }: { item: Album }) => {
      const isActive = item.album === (activeAlbum || currentlyPlayedAlbum)?.album;
      return (
        <Pressable
          p={2}
          bgColor={isActive ? COLORS.white : 'transparent'}
          onPress={() => handleActiveAlbum(item)}>
          <Text fontSize="sm" color={isActive ? COLORS.black : COLORS.white}>
            {item.album}
          </Text>
        </Pressable>
      );
    },
    [activeAlbum, currentlyPlayedAlbum, handleActiveAlbum],
  );

  const albumKeyExtractor = useCallback((item: Album) => item.album, []);

  return (
    <Box bgColor={COLORS.background_content_primary}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={albumList}
        keyExtractor={albumKeyExtractor}
        renderItem={renderAlbumItem}
      />
    </Box>
  );
};
