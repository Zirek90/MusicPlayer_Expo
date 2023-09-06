import 'react-native-gesture-handler/jestSetup';
import mockAsyncStorage from './mocks/asyncStorage';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);
