import { Avatar, HStack, Text, VStack, Heading } from 'native-base';
import { COLORS } from '@global';
import { withMusicContext } from '@hoc';

type MusicPlayerHeaderProps = {
  songDetails: {
    title: string;
    album: string;
  };
};

const MusicPlayerHeaderComponent = ({ songDetails }: MusicPlayerHeaderProps) => {
  return (
    <HStack alignItems="center">
      <Avatar
        size="xl"
        bgColor={COLORS.background_content_primary}
        source={require('../../assets/backgrounds/black_bg_2.png')}
      />
      <VStack ml={5} flexShrink={1}>
        <Heading size="md">Title: {songDetails.title}</Heading>
        <Text>Album: {songDetails.album}</Text>
      </VStack>
    </HStack>
  );
};

export const MusicPlayerHeader = withMusicContext(MusicPlayerHeaderComponent, {
  songDetails: data => data.songDetails,
});
