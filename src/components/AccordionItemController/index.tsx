import { Pressable } from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type AccordionItemControllerProps = {
  color: string;
  name: keyof typeof MaterialCommunityIcons.glyphMap;
  handleAction: () => void;
};

export const AccordionItemController = ({
  color,
  name,
  handleAction,
}: AccordionItemControllerProps) => {
  return (
    <Pressable onPress={handleAction}>
      <MaterialCommunityIcons name={name} size={30} color={color} />
    </Pressable>
  );
};
