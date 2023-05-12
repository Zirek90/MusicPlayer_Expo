import { useCallback } from 'react';
import { FlatList } from 'native-base';
import { Asset } from 'expo-media-library';
import { Album } from '@types';
import { useAlbumList } from './hook/useAlbumList';
import { Accordion, AccordionItem } from '@components';

export const AlbumList = () => {
  const { albumList, openedDirectories, handleToggleExpand } = useAlbumList();

  const renderSongItem = useCallback(
    ({ item }: { item: Asset }) => <AccordionItem data={item} />,
    [],
  );

  const songKeyExtractor = useCallback((item: Asset) => item.id, []);

  const albumKeyExtractor = useCallback((item: Album) => item.album, []);

  const renderAlbumItem = useCallback(
    ({ item }: { item: Album }) => (
      <Accordion
        key={item.album}
        title={item.album}
        toggleExpand={() => handleToggleExpand(item.album)}
        expandAll={openedDirectories.includes(item.album)}>
        {openedDirectories.includes(item.album) && (
          <FlatList data={item.items} keyExtractor={songKeyExtractor} renderItem={renderSongItem} />
        )}
      </Accordion>
    ),
    [openedDirectories],
  );

  return (
    <FlatList data={albumList} keyExtractor={albumKeyExtractor} renderItem={renderAlbumItem} />
  );
};
