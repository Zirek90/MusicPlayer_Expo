import { useEffect, useState } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { getDirectory, getExtension } from '@utils';
import { AVAILABLE_EXTENSIONS, DURATION } from '@constants';
import type { Album } from '@types';

export type useAlbumListOutput = {
  albumList: Album[];
  activeAlbum: string;
  displayedSongs: MediaLibrary.Asset[];
  handleSetAlbum: (element: Album) => void;
};

export const useAlbumList = (): useAlbumListOutput => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [albumList, setAlbumList] = useState<Album[]>([]);
  const [activeAlbum, setActiveAlbum] = useState<string>('');
  const [displayedSongs, setDisplayedSongs] = useState<MediaLibrary.Asset[]>([]);

  useEffect(() => {
    const getPermission = async () => {
      const permission = await MediaLibrary.requestPermissionsAsync();
      setPermissionGranted(permission.granted);
    };
    getPermission();
  }, []);

  const scanMusicFiles = async () => {
    let media = await MediaLibrary.getAssetsAsync({
      mediaType: MediaLibrary.MediaType.audio,
    });

    media = await MediaLibrary.getAssetsAsync({
      first: media.totalCount,
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

  const handleSetAlbum = (element: Album) => {
    setActiveAlbum(element.album);
    setDisplayedSongs(element.items);
  };

  useEffect(() => {
    if (!permissionGranted) return;
    scanMusicFiles();
  }, [permissionGranted]);

  return {
    albumList,
    activeAlbum,
    displayedSongs,
    handleSetAlbum,
  };
};
