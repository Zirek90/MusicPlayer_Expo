import { Pressable } from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { memo } from 'react';

type PressableControllerProps = {
  name: keyof typeof MaterialCommunityIcons.glyphMap;
  color?: string;
  size?: number;
  handleAction: () => void;
};

export const PressableController = memo(
  ({ color = 'grey', size = 30, name, handleAction }: PressableControllerProps) => {
    return (
      <Pressable onPress={handleAction}>
        <MaterialCommunityIcons name={name} size={size} color={color} />
      </Pressable>
    );
  },
);
