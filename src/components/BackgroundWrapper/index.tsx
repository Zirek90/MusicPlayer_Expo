import { PropsWithChildren } from 'react';
import { View, Box } from 'native-base';
import { ImageBackground } from 'react-native';
import { COLORS } from '@global';
import { useBackgroundContext } from '@context';

export const BackgroundWrapper = ({ children }: PropsWithChildren) => {
  const { background } = useBackgroundContext();

  return (
    <View flex={1} bgColor={COLORS.black}>
      <ImageBackground
        source={background}
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
