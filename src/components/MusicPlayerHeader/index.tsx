import { Avatar, HStack, Text, VStack, Heading } from 'native-base';
import { COLORS } from '@global';

type MusicPlayerHeaderProps = {
  title: string;
  album: string;
};

export const MusicPlayerHeader = ({ title, album }: MusicPlayerHeaderProps) => {
  return (
    <HStack alignItems="center">
      <Avatar
        size="xl"
        bgColor={COLORS.background_content_primary}
        source={require('../../assets/backgrounds/black_bg_2.png')}
      />
      <VStack ml={5} flexShrink={1}>
        <Heading size="md">Title: {title}</Heading>
        <Text>Album: {album}</Text>
      </VStack>
    </HStack>
  );
};
