import { PropsWithChildren } from 'react';
import { Box, HStack, Text, Pressable } from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '@global';

interface AccordionProps extends PropsWithChildren {
  title: string;
  toggleExpand: () => void;
  expandAll: boolean;
}

export const Accordion = ({ title, toggleExpand, expandAll, children }: AccordionProps) => (
  <Box m={1}>
    <Pressable onPress={toggleExpand}>
      <HStack alignItems="center">
        {expandAll ? (
          <MaterialCommunityIcons name="arrow-down" size={20} color={COLORS.white} />
        ) : (
          <MaterialCommunityIcons name="arrow-up" size={20} color={COLORS.white} />
        )}
        <Text fontWeight="bold" color="red.500" fontSize="md">
          {title}
        </Text>
      </HStack>
    </Pressable>
    {children}
  </Box>
);
