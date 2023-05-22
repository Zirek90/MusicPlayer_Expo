import { useEffect, useRef, useState } from 'react';
import { Box, HStack, Text, Slider } from 'native-base';
import { useSelector } from 'react-redux';
import { RootState } from '@store/store';
import { calculateCurrentTime, durationToTime } from '@utils';

type SongProgresProps = {
  songProgress: number;
  handleSongProgress: (progress: number) => Promise<void>;
};

export const SongProgress = ({ songProgress, handleSongProgress }: SongProgresProps) => {
  const [currentValue, setCurrentValue] = useState(songProgress);
  const [isDragActive, setIsDragActive] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const currentTimePositionRef = useRef('0:00');
  const duration = useSelector((state: RootState) => state.song.duration);

  // toDo optimize this code as it still seems not so responsive
  useEffect(() => {
    if (isDragActive) return;
    setCurrentValue(songProgress);
  }, [songProgress, isDragActive]);

  useEffect(() => {
    if (!duration) return;
    currentTimePositionRef.current = calculateCurrentTime(duration, songProgress);
  }, [songProgress, duration]);

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
        <Text fontSize="lg">{currentTimePositionRef.current}</Text>
        <Text fontSize="lg">{duration ? durationToTime(duration) : '0:00'}</Text>
      </HStack>
    </Box>
  );
};
