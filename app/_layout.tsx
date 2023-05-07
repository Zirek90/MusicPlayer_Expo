import { Stack } from 'expo-router';
import { NativeBaseProvider } from 'native-base';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  return (
    <NativeBaseProvider>
      {/* {!loaded && <SplashScreen />} */}
      <RootLayoutNav />
    </NativeBaseProvider>
  );
}

function RootLayoutNav() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
