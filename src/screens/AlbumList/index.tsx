import { useCallback } from 'react';
import { Box, FlatList, Heading, Pressable, Text } from 'native-base';
import { Asset } from 'expo-media-library';
import { Album } from '@types';
import { useAlbumList } from './hook/useAlbumList';
import { SongItem } from '@components';
import { COLORS } from '@global';
import { useMusicContext } from '@context';

export const AlbumList = () => {
  const { albumList, displayedSongs, activeAlbum, handleSetAlbum } = useAlbumList();
  const { handleCurrentAlbum } = useMusicContext();

  const handleAlbum = useCallback((item: Album) => {
    handleSetAlbum(item);
    handleCurrentAlbum(item);
  }, []);

  const renderSongItem = useCallback(
    ({ item, index }: { item: Asset; index: number }) => <SongItem data={item} index={index} />,
    [],
  );

  const songKeyExtractor = useCallback((item: Asset) => item.id, []);

  const albumKeyExtractor = useCallback((item: Album) => item.album, []);

  const renderAlbumItem = useCallback(
    ({ item }: { item: Album }) => {
      const isActive = item.album === activeAlbum;
      return (
        <Pressable
          p={2}
          bgColor={isActive ? COLORS.white : 'transparent'}
          onPress={() => handleAlbum(item)}>
          <Text
            fontWeight={isActive ? 'bold' : 'medium'}
            fontSize="sm"
            color={isActive ? COLORS.black : COLORS.white}>
            {item.album}
          </Text>
        </Pressable>
      );
    },
    [activeAlbum],
  );

  return (
    <Box>
      {activeAlbum && (
        <Heading size="md" my={3}>
          {activeAlbum}
        </Heading>
      )}

      <Box bgColor={COLORS.background_content_primary}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={albumList}
          keyExtractor={albumKeyExtractor}
          renderItem={renderAlbumItem}
        />
      </Box>

      <FlatList data={displayedSongs} keyExtractor={songKeyExtractor} renderItem={renderSongItem} />
    </Box>
  );
};

// export const AlbumList = () => {
//   const { albumList, openedDirectories, handleToggleExpand } = useAlbumList();

//   const renderSongItem = useCallback(
//     (item: Asset, album: Album, index: number) => (
//       <AccordionItem data={item} album={album} index={index} />
//     ),
//     [],
//   );

//   const songKeyExtractor = useCallback((item: Asset) => item.id, []);

//   const albumKeyExtractor = useCallback((item: Album) => item.album, []);

//   const renderAlbumItem = useCallback(
//     ({ item: albumItem }: { item: Album }) => (
//       <Accordion
//         key={albumItem.album}
//         title={albumItem.album}
//         toggleExpand={() => handleToggleExpand(albumItem.album)}
//         expandAll={openedDirectories.includes(albumItem.album)}>
//         {openedDirectories.includes(albumItem.album) && (
//           <FlatList
//             data={albumItem.items}
//             keyExtractor={songKeyExtractor}
//             renderItem={({ item, index }) => renderSongItem(item, albumItem, index)}
//           />
//         )}
//       </Accordion>
//     ),
//     [openedDirectories],
//   );

//   return (
//     <FlatList data={albumList} keyExtractor={albumKeyExtractor} renderItem={renderAlbumItem} />
//   );
// };
