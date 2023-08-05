import { SplashScreen, Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { NativeBaseProvider } from 'native-base';
import {
  AlbumsContextProvider,
  MusicContextProvider,
  PermissionContextProvider,
  ForeroundActivityProvider,
  BackgroundProvider,
} from '@context';
import { ThemeConfig } from '@configs';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  const [loaded] = useFonts({
    Kegina: require('../assets/fonts/Kegina.otf'),
  });

  if (!loaded) return <SplashScreen />;

  return (
    <BackgroundProvider>
      <PermissionContextProvider>
        <AlbumsContextProvider>
          <MusicContextProvider>
            <ForeroundActivityProvider>
              <NativeBaseProvider theme={ThemeConfig}>
                <RootLayoutNav />
              </NativeBaseProvider>
            </ForeroundActivityProvider>
          </MusicContextProvider>
        </AlbumsContextProvider>
      </PermissionContextProvider>
    </BackgroundProvider>
  );
}

function RootLayoutNav() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
