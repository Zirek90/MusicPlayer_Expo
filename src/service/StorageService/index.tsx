import AsyncStorage from '@react-native-async-storage/async-storage';
import { Album, CurrentSong } from '@types';

export const StorageService = {
  getProgress: async () => {
    const stringifiedSongProgress = await AsyncStorage.getItem('songProgress');
    const songProgress = stringifiedSongProgress ? JSON.parse(stringifiedSongProgress) : null;
    return songProgress;
  },
  getAll: async () => {
    const stringifiedAlbum = await AsyncStorage.getItem('album');
    const stringifiedSongProgress = await AsyncStorage.getItem('songProgress');
    const stringifiedcurrentSong = await AsyncStorage.getItem('currentSong');

    const album = stringifiedAlbum ? JSON.parse(stringifiedAlbum) : null;
    const songProgress = stringifiedSongProgress ? JSON.parse(stringifiedSongProgress) : null;
    const currentSong = stringifiedcurrentSong ? JSON.parse(stringifiedcurrentSong) : null;

    return { album, songProgress, currentSong };
  },
  set: async (key: string, item: Album | CurrentSong | number) => {
    const stringifiedItem = JSON.stringify(item);
    await AsyncStorage.setItem(key, stringifiedItem);
  },
};
