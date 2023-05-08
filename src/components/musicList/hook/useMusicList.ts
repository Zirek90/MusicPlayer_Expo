import { useEffect, useState } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { getDirectory, getExtension } from '@utils';
import { AMOUNT_OF_FILES, AVAILABLE_EXTENSIONS, DURATION } from '@constants';
import { MusicFileList } from '@types';

export type useMusicListOutput = {
  music: MusicFileList[];
  openedDirectories: string[];
  handleToggleExpand: (key: string) => void;
};

export const useMusicList = (): useMusicListOutput => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [music, setMusic] = useState<MusicFileList[]>([]);
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
    const musicFilesArray = convertIntoArray(assignedMusicFiles);

    setMusic(musicFilesArray);
  };

  const assignFilesToDirectories = (files: MediaLibrary.Asset[]) => {
    return files.reduce((acc: MusicFileList, file) => {
      const directory = getDirectory(file.uri);
      if (!acc[directory]) {
        acc[directory] = [file];
      } else {
        acc[directory].push(file);
      }
      return acc;
    }, {});
  };

  const convertIntoArray = (files: MusicFileList) => {
    const formattedOutput = [];

    for (const key in files) {
      if (files.hasOwnProperty(key)) {
        const newObject: MusicFileList = {};
        newObject[key] = files[key];
        formattedOutput.push(newObject);
      }
    }
    return formattedOutput;
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

  return { music, openedDirectories, handleToggleExpand };
};
