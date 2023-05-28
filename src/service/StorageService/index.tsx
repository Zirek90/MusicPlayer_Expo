import AsyncStorage from '@react-native-async-storage/async-storage';
import { Album } from '@types';

export const StorageService = {
  get: async () => {
    const stringifiedAlbum = await AsyncStorage.getItem('album');
    const stringifiedSongIndex = await AsyncStorage.getItem('songIndex');
    const stringifiedSongProgress = await AsyncStorage.getItem('songProgress');
    const stringifiedSongDuration = await AsyncStorage.getItem('songDuration');

    const album = stringifiedAlbum ? JSON.parse(stringifiedAlbum) : null;
    const songIndex = stringifiedSongIndex ? JSON.parse(stringifiedSongIndex) : null;
    const songProgress = stringifiedSongProgress ? JSON.parse(stringifiedSongProgress) : null;
    const songDuration = stringifiedSongDuration ? JSON.parse(stringifiedSongDuration) : null;

    return { album, songIndex, songProgress, songDuration };
  },
  set: async (key: string, item: Album | number) => {
    const stringifiedItem = JSON.stringify(item);
    await AsyncStorage.setItem(key, stringifiedItem);
  },
};
