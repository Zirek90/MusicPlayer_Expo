import { Avatar, HStack, Text, VStack, Heading } from 'native-base';
import { COLORS } from '@global';

export const MusicPlayerHeader = () => {
  return (
    <HStack alignItems="center">
      <Avatar
        size="xl"
        bgColor={COLORS.mode_content_background}
        source={require('../../assets/backgrounds/black_bg_2.png')}
      />
      <VStack ml={5}>
        <Heading size="md">Title: Django some song</Heading>
        <Text>Album: inne</Text>
      </VStack>
    </HStack>
  );
};
