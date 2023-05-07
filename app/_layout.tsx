import { Stack } from 'expo-router';
import { NativeBaseProvider } from 'native-base';
import { Provider, useDispatch } from 'react-redux';
import { store } from '../src/store/store';
import { useEffect } from 'react';
import { setBackground } from '@store/reducers/backgroundReducer';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  return (
    <Provider store={store}>
      <NativeBaseProvider>
        {/* {!loaded && <SplashScreen />} */}
        <RootLayoutNav />
      </NativeBaseProvider>
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
