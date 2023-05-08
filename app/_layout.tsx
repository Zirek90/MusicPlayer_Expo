import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { NativeBaseProvider } from 'native-base';
import { SafeAreaView } from 'react-native';
import { Provider, useDispatch } from 'react-redux';
import { store } from '@store/store';
import { setBackground } from '@store/reducers/backgroundReducer';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  return (
    <Provider store={store}>
      <NativeBaseProvider>
        <SafeAreaView style={{ flex: 1 }}>
          {/* {!loaded && <SplashScreen />} */}
          <RootLayoutNav />
        </SafeAreaView>
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
