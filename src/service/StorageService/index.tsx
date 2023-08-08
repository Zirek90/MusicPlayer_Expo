import AsyncStorage from '@react-native-async-storage/async-storage';
import { Album, CurrentSong } from '@types';

type StorageServiceGetAllOutput = {
  album: Album;
  currentSong: CurrentSong;
  songProgress: string;
  songIndex: string;
  songDuration: string;
};

export const StorageService = {
  get: async (key: string) => {
    const stringifiedItem = await AsyncStorage.getItem(key);
    return stringifiedItem ? JSON.parse(stringifiedItem) : null;
  },
  getAll: async () => {
    const keys = await AsyncStorage.getAllKeys();
    const result = await AsyncStorage.multiGet(keys);
    const output = result
      .map(item => ({
        [item[0]]: item[1] ? JSON.parse(item[1]) : null,
      }))
      .reduce((acc, item) => ({ ...acc, ...item }), {}); // I need object here instead of array so transform it to needed shape
    return output as StorageServiceGetAllOutput;
  },
  set: async (key: string, item: Album | CurrentSong | number) => {
    const stringifiedItem = JSON.stringify(item);
    await AsyncStorage.setItem(key, stringifiedItem);
  },
};
