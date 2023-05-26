import { PropsWithChildren } from 'react';
import { View, Box } from 'native-base';
import { ImageBackground, ImageSourcePropType } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@store/store';
import { COLORS } from '@global';

export const BackgroundWrapper = ({ children }: PropsWithChildren) => {
  const background = useSelector((state: RootState) => state.background.bgImage);

  return (
    <View flex={1} bgColor={COLORS.black}>
      <ImageBackground
        source={
          (background?.path as ImageSourcePropType) ||
          require('../../assets/backgrounds/black_bg_1.png') // as fallback
        }
        resizeMode="cover"
        style={{
          flex: 1,
          width: '100%',
        }}>
        <Box bgColor={COLORS.background_primary} p={2} flex={1}>
          {children}
        </Box>
      </ImageBackground>
    </View>
  );
};
