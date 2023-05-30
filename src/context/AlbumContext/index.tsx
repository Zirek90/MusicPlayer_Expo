import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { usePermissionContext } from '../PermissionContext';
import { Album } from '@types';
import { getDirectory, getExtension } from '@utils';
import { AVAILABLE_EXTENSIONS, DURATION } from '@constants';
import { StorageService } from '@service';

interface ContextState {
  albumList: Album[];
  activeAlbum: Album | null;
  handleActiveAlbum: (album: Album) => void;
}

const AlbumsContext = createContext<ContextState>({} as ContextState);

export const AlbumsContextProvider = ({ children }: PropsWithChildren) => {
  const [albumList, setAlbumList] = useState<Album[]>([]);
  const [activeAlbum, setActiveAlbum] = useState<Album | null>(null);

  const { permissionGranted } = usePermissionContext();

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

  const handleActiveAlbum = (album: Album) => {
    setActiveAlbum(album);
  };

  useEffect(() => {
    const fetchStoredAlbum = async () => {
      const { album } = await StorageService.get();
      if (!album) return;
      setActiveAlbum(album);
    };
    fetchStoredAlbum();
  }, []);

  useEffect(() => {
    if (!permissionGranted) return;
    scanMusicFiles();
  }, [permissionGranted]);

  useEffect(() => {
    const enableAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          interruptionModeIOS: InterruptionModeIOS.DoNotMix,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
          shouldDuckAndroid: false,
        });
      } catch {}
    };
    enableAudio();
  }, []);

  return (
    <AlbumsContext.Provider value={{ albumList, activeAlbum, handleActiveAlbum }}>
      {children}
    </AlbumsContext.Provider>
  );
};

export const useAlbumsContext = () => {
  return useContext(AlbumsContext);
};
