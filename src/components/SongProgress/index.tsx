import { useEffect, useRef, useState } from 'react';
import { Box, HStack, Text, Slider } from 'native-base';
import { calculateCurrentTime, durationToTime } from '@utils';
import { withMusicContext } from '@hoc';

type SongProgressProps = {
  songProgress: number;
  currentSongDuration: number;
  handleSongProgress: (progress: number) => Promise<void>;
};

const SongProgressComponent = ({
  songProgress,
  handleSongProgress,
  currentSongDuration,
}: SongProgressProps) => {
  const [currentValue, setCurrentValue] = useState(0);
  const [isDragActive, setIsDragActive] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const currentTimePositionRef = useRef('0:00');

  useEffect(() => {
    if (isDragActive) return;
    setCurrentValue(songProgress);
  }, [songProgress, isDragActive]);

  useEffect(() => {
    if (!currentSongDuration) return;
    currentTimePositionRef.current = calculateCurrentTime(currentSongDuration, songProgress);
  }, [songProgress, currentSongDuration]);

  const handleSliderChange = (value: number, isOnEnd?: boolean) => {
    setCurrentValue(value);
    if (isOnEnd) {
      handleSongProgress(value);
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
        <Text fontSize="lg">
          {currentSongDuration ? durationToTime(currentSongDuration) : '0:00'}
        </Text>
      </HStack>
    </Box>
  );
};

export const SongProgress = withMusicContext(SongProgressComponent, {
  songProgress: data => data.songProgress,
  handleSongProgress: data => data.handleSongProgress,
  currentSongDuration: data => data.currentSongDuration,
});
