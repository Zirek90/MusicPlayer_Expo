import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as MediaLibrary from 'expo-media-library';
import { Audio } from 'expo-av';
import { getDirectory, getExtension } from '@utils';
import { AMOUNT_OF_FILES, AVAILABLE_EXTENSIONS, DURATION } from '@constants';
import type { MusicFileList } from '@types';
import { playSong, stopSong } from '@store/reducers';
import { SongStatus } from '@enums';

export type useMusicListOutput = {
  music: MusicFileList[];
  openedDirectories: string[];
  handleToggleExpand: (key: string) => void;
  handleSong: (id: string, filename: string, uri: string, status: SongStatus) => Promise<void>;
};

export const useMusicList = (): useMusicListOutput => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [music, setMusic] = useState<MusicFileList[]>([]);
  const [openedDirectories, setOpenedDirectories] = useState<string[]>([]);
  const [currentSong, setCurrentSong] = useState<Audio.Sound>();
  const dispatch = useDispatch();

  // toDo move it to redux store
  const handleSong = async (id: string, filename: string, uri: string, status: SongStatus) => {
    if (status === SongStatus.STOP) {
      currentSong?.unloadAsync();
      dispatch(stopSong({ id, filename, uri, status }));
      setCurrentSong(undefined);
    } else {
      if (currentSong) {
        currentSong?.unloadAsync();
      }
      const { sound: playbackObject } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true },
      );
      dispatch(playSong({ id, filename, uri, status }));
      setCurrentSong(playbackObject);
    }
  };

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

  return { music, openedDirectories, handleToggleExpand, handleSong };
};
