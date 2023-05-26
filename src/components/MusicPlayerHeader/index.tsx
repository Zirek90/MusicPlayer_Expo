import { Avatar, HStack, Text, VStack, Heading } from 'native-base';
import { COLORS } from '@global';
import { useMusicContext } from '@context';
import { memo } from 'react';

type MusicPlayerHeaderProps = {
  songDetails: {
    title: string;
    album: string;
  };
};

const withContext = (Component: React.FC<MusicPlayerHeaderProps>) => {
  const MemoComponent = memo(Component);

  return () => {
    const { songDetails } = useMusicContext();
    return <MemoComponent songDetails={songDetails} />;
  };
};

export const MusicPlayerHeader = withContext(({ songDetails }) => {
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
});
