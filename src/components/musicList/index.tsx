import { FlatList } from 'native-base';
import { Asset } from 'expo-media-library';
import { useMusicList } from './hook/useMusicList';
import { Accordion } from '../Accordion';
import { AccordionItem } from '../AccordionItem';

export const MusicList = () => {
  const { music, openedDirectories, handleToggleExpand } = useMusicList();

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
            {!!openedDirectories.includes(title) && (
              <FlatList
                data={Object.values(item)}
                renderItem={({ item: musicFiles }) => (
                  <>
                    {musicFiles.map((musicFile: Asset) => (
                      <AccordionItem key={musicFile.filename} data={musicFile} />
                    ))}
                  </>
                )}
              />
            )}
          </Accordion>
        );
      }}
    />
  );
};
