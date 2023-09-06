import 'react-native-gesture-handler/jestSetup';
import mockAsyncStorage from './__mocks__/asyncStorage';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);
