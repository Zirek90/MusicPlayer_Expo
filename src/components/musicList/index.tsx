import { useCallback } from 'react';
import { FlatList } from 'native-base';
import { Asset } from 'expo-media-library';
import { useMusicList } from './hook/useMusicList';
import { Accordion } from '../Accordion';
import { AccordionItem } from '../AccordionItem';

export const MusicList = () => {
  const { music, openedDirectories, handleToggleExpand } = useMusicList();

  const renderSongItem = useCallback(
    ({ item }: { item: Asset }) => <AccordionItem data={item} />,
    [],
  );

  const songKeyExtractor = useCallback((item: Asset) => item.id, []);

  return (
    <FlatList
      data={music}
      renderItem={({ item }) => {
        const title = Object.keys(item)[0]; // array has only one element so that's why we always grab first one
        return (
          <Accordion
            key={title}
            title={title}
            toggleExpand={() => handleToggleExpand(title)}
            expandAll={openedDirectories.includes(title)}>
            {!!openedDirectories.includes(title) &&
              Object.values(item).map((musicFiles, index) => (
                <FlatList
                  key={index} // there will be no deletion or creation of elements so index would do
                  data={musicFiles}
                  keyExtractor={songKeyExtractor}
                  renderItem={renderSongItem}
                />
              ))}
          </Accordion>
        );
      }}
    />
  );
};
