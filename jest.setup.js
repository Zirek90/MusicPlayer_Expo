import 'react-native-gesture-handler/jestSetup';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  getAllKeys: jest.fn(),
  multiGet: jest.fn(),
  setItem: jest.fn(),
}));

// Mock ForegroundService
jest.mock('@supersami/rn-foreground-service', () => ({
  start: jest.fn(),
  stop: jest.fn(),
  remove_all_tasks: jest.fn(),
  update: jest.fn(),
}));

// Mock Expo-av
jest.mock('expo-av', () => ({
  Audio: {
    Sound: {
      createAsync: jest.fn(),
    },
  },
}));
