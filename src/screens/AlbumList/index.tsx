import { useCallback } from 'react';
import { FlatList } from 'native-base';
import { Asset } from 'expo-media-library';
import { Album } from '@types';
import { useAlbumList } from './hook/useAlbumList';
import { Accordion, AccordionItem } from '@components';

export const AlbumList = () => {
  const { albumList, openedDirectories, handleToggleExpand } = useAlbumList();

  const renderSongItem = useCallback(
    (item: Asset, album: Album, index: number) => (
      <AccordionItem data={item} album={album} index={index} />
    ),
    [],
  );

  const songKeyExtractor = useCallback((item: Asset) => item.id, []);

  const albumKeyExtractor = useCallback((item: Album) => item.album, []);

  const renderAlbumItem = useCallback(
    ({ item: albumItem }: { item: Album }) => (
      <Accordion
        key={albumItem.album}
        title={albumItem.album}
        toggleExpand={() => handleToggleExpand(albumItem.album)}
        expandAll={openedDirectories.includes(albumItem.album)}>
        {openedDirectories.includes(albumItem.album) && (
          <FlatList
            data={albumItem.items}
            keyExtractor={songKeyExtractor}
            renderItem={({ item, index }) => renderSongItem(item, albumItem, index)}
          />
        )}
      </Accordion>
    ),
    [openedDirectories],
  );

  return (
    <FlatList data={albumList} keyExtractor={albumKeyExtractor} renderItem={renderAlbumItem} />
  );
};
