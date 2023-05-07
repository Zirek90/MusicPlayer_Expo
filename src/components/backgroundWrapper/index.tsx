import { PropsWithChildren } from 'react';
import { View, Box } from 'native-base';
import { ImageBackground, ImageSourcePropType } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

export const BackgroundWrapper = ({ children }: PropsWithChildren) => {
  const background = useSelector((state: RootState) => state.background.bgImage);

  return (
    <View flex={1} bgColor="black">
      <ImageBackground
        source={background?.path as ImageSourcePropType}
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
