import { View, Box } from 'native-base';
import { PropsWithChildren, useEffect, useState } from 'react';
import { ImageBackground } from 'react-native';
import { DARK_BG_PATHS } from '@global';

export const BackgroundWrapper = ({ children }: PropsWithChildren) => {
  const [choosen, setChoosen] = useState(DARK_BG_PATHS[0]);

  // toDo move saving image to store to only generate it once and have same for all screens
  useEffect(() => {
    setChoosen(DARK_BG_PATHS[Math.floor(Math.random() * DARK_BG_PATHS.length)]);
  }, []);

  return (
    <View flex={1} bgColor="black">
      <ImageBackground
        source={choosen.path}
        resizeMode="cover"
        style={{
          flex: 1,
          width: '100%',
        }}>
        <Box bgColor="rgba(35, 35, 35, 0.5)" p={2}>
          {children}
        </Box>
      </ImageBackground>
    </View>
  );
};
