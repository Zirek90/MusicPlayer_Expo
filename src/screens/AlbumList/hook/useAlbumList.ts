import { useEffect, useState } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { getDirectory, getExtension } from '@utils';
import { AMOUNT_OF_FILES, AVAILABLE_EXTENSIONS, DURATION } from '@constants';
import type { Album } from '@types';

export type useAlbumListOutput = {
  albumList: Album[];
  openedDirectories: string[];
  handleToggleExpand: (key: string) => void;
};

export const useAlbumList = (): useAlbumListOutput => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [albumList, setAlbumList] = useState<Album[]>([]);
  const [openedDirectories, setOpenedDirectories] = useState<string[]>([]);

  useEffect(() => {
    const getPermission = async () => {
      const permission = await MediaLibrary.requestPermissionsAsync();
      setPermissionGranted(permission.granted);
    };
    getPermission();
  }, []);

  const scanMusicFiles = async () => {
    const media = await MediaLibrary.getAssetsAsync({
      first: AMOUNT_OF_FILES,
      mediaType: MediaLibrary.MediaType.audio,
    });

    const filterWrongFiles = media.assets.filter(
      file =>
        file.duration > DURATION && AVAILABLE_EXTENSIONS.includes(getExtension(file.filename)),
    );

    const assignedMusicFiles = assignFilesToDirectories(filterWrongFiles);

    setAlbumList(assignedMusicFiles);
  };

  const assignFilesToDirectories = (files: MediaLibrary.Asset[]) => {
    return files.reduce((acc: Album[], file) => {
      const directory = getDirectory(file.uri);
      const foundDirectory = acc.find(a => a.album === directory);

      if (foundDirectory) {
        return acc.map(el => {
          if (el.album === directory) {
            return {
              ...el,
              items: [...el.items, file],
            };
          }
          return el;
        });
      }
      return [
        ...acc,
        {
          album: directory,
          items: [file],
        },
      ];
    }, []);
  };

  const handleToggleExpand = (key: string) => {
    const copyOpenedDirectories = [...openedDirectories];

    if (!copyOpenedDirectories.includes(key)) {
      copyOpenedDirectories.push(key);
    } else {
      copyOpenedDirectories.splice(copyOpenedDirectories.indexOf(key), 1);
    }

    setOpenedDirectories(copyOpenedDirectories);
  };

  useEffect(() => {
    if (!permissionGranted) return;
    scanMusicFiles();
  }, [permissionGranted]);

  return { albumList, openedDirectories, handleToggleExpand };
};
