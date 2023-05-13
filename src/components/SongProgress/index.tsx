import { useEffect, useRef, useState } from 'react';
import { Box, HStack, Text, Slider } from 'native-base';

type SongProgresProps = {
  songProgress: number;
  handleSongProgress: (progress: number) => void;
};

export const SongProgress = ({ songProgress, handleSongProgress }: SongProgresProps) => {
  const [currentValue, setCurrentValue] = useState(songProgress);
  const [isDragActive, setIsDragActive] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  // toDo optimize this code as it still seems not so responsive
  useEffect(() => {
    if (isDragActive) return;
    setCurrentValue(songProgress);
  }, [songProgress, isDragActive]);

  const handleSliderChange = (val: number, isOnEnd?: boolean) => {
    setCurrentValue(val);
    if (isOnEnd) {
      handleSongProgress(val);
      timer.current = setTimeout(() => setIsDragActive(false), 500); // to avoide effect of flickering
    }
  };

  useEffect(() => {
    return () => clearTimeout(timer.current);
  }, []);

  return (
    <Box px={5} my={2}>
      <Slider
        value={currentValue}
        colorScheme="emerald"
        onTouchStart={() => setIsDragActive(true)}
        onChange={handleSliderChange}
        onChangeEnd={v => handleSliderChange(v, true)}>
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
