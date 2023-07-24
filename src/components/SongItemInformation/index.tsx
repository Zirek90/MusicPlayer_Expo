import { HStack, Text } from 'native-base';
import { Asset } from 'expo-media-library';
import { durationToTime, trimString } from '@utils';
import { COLORS } from '@global';
import { PressableController } from '../PressableController';

type SongItemInformationProps = {
  data: Asset;
};

export const SongItemInformation = ({ data }: SongItemInformationProps) => {
  const handleAction = () => {};

  return (
    <HStack alignItems="center">
      <PressableController
        size={15}
        color={COLORS.inactive}
        name="playlist-plus"
        handleAction={handleAction}
      />
      <Text ml={2}>
        {trimString(data.filename)} - ({durationToTime(data.duration)})
      </Text>
    </HStack>
  );
};
