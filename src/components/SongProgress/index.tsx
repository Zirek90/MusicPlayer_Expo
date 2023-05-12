import { useState } from 'react';
import { Box, HStack, Text, Slider } from 'native-base';

export const SongProgress = () => {
  const [currentValue, setCurrentValue] = useState(0);

  const handleCurrentValue = (val: number) => setCurrentValue(val);

  return (
    <Box px={5} my={2}>
      <Slider
        value={currentValue}
        colorScheme="emerald"
        onChange={handleCurrentValue}
        onChangeEnd={v => console.log({ v })}>
        <Slider.Track>
          <Slider.FilledTrack />
        </Slider.Track>
        <Slider.Thumb />
      </Slider>
      <HStack justifyContent="space-between">
        <Text fontSize="lg">0:00</Text>
        <Text fontSize="lg">3:51</Text>
      </HStack>
    </Box>
  );
};
