import { HStack } from 'native-base';
import { PressableController } from '../PressableController';

export const PlayerControllers = () => {
  return (
    <HStack justifyContent="space-between" alignItems="center" px={1}>
      <PressableController
        size={45}
        color="grey"
        name="skip-previous-circle-outline"
        handleAction={() => {}}
      />
      <HStack>
        <PressableController
          size={60}
          color="grey"
          name="pause-circle-outline"
          handleAction={() => {}}
        />
        <PressableController
          size={60}
          color="grey"
          name="play-circle-outline"
          handleAction={() => {}}
        />
      </HStack>
      <PressableController
        size={45}
        color="grey"
        name="skip-next-circle-outline"
        handleAction={() => {}}
      />
    </HStack>
  );
};
