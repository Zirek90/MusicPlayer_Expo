import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { NativeBaseProvider } from 'native-base';
import { Provider, useDispatch } from 'react-redux';
import { store } from '@store/store';
import { setBackground } from '@store/reducers/backgroundReducer';
import { AlbumsContextProvider, MusicContextProvider, PermissionContextProvider } from '@context';
import { ThemeConfig } from '@configs';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PermissionContextProvider>
        <AlbumsContextProvider>
          <MusicContextProvider>
            <NativeBaseProvider theme={ThemeConfig}>
              {/* {!loaded && <SplashScreen />} */}
              <RootLayoutNav />
            </NativeBaseProvider>
          </MusicContextProvider>
        </AlbumsContextProvider>
      </PermissionContextProvider>
    </Provider>
  );
}

function RootLayoutNav() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setBackground());
  }, []);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
