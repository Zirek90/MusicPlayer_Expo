import { useCallback } from 'react';
import { Box, FlatList, Pressable, Text } from 'native-base';
import { Asset } from 'expo-media-library';
import { Album } from '@types';
import { SongItem } from '@components';
import { COLORS } from '@global';
import { useAlbumsContext } from '@context';

export const AlbumList = () => {
  const { albumList, activeAlbum, handleActiveAlbum } = useAlbumsContext();

  const handleAlbum = useCallback((item: Album) => {
    handleActiveAlbum(item);
  }, []);

  const renderSongItem = useCallback(
    ({ item, index }: { item: Asset; index: number }) => <SongItem data={item} index={index} />,
    [],
  );

  const songKeyExtractor = useCallback((item: Asset) => item.id, []);

  const albumKeyExtractor = useCallback((item: Album) => item.album, []);

  const renderAlbumItem = useCallback(
    ({ item }: { item: Album }) => {
      const isActive = item.album === activeAlbum?.album;
      return (
        <Pressable
          p={2}
          bgColor={isActive ? COLORS.white : 'transparent'}
          onPress={() => handleAlbum(item)}>
          <Text fontSize="sm" color={isActive ? COLORS.black : COLORS.white}>
            {item.album}
          </Text>
        </Pressable>
      );
    },
    [activeAlbum],
  );

  return (
    <Box>
      <Box bgColor={COLORS.background_content_primary}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={albumList}
          keyExtractor={albumKeyExtractor}
          renderItem={renderAlbumItem}
        />
      </Box>

      {activeAlbum && (
        <>
          <Text fontSize="2xl" my={3}>
            {activeAlbum.album}
          </Text>
          <FlatList
            data={activeAlbum.items}
            keyExtractor={songKeyExtractor}
            renderItem={renderSongItem}
          />
        </>
      )}
    </Box>
  );
};
