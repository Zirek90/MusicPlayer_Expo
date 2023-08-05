import 'expo-dev-client';
import 'expo-router/entry';
import 'react-native-gesture-handler';
import { LogBox } from 'react-native';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';

LogBox.ignoreLogs([
  'In React 18, SSRProvider is not necessary and is a noop. You can remove it from your app.',
]);

ReactNativeForegroundService.register();
