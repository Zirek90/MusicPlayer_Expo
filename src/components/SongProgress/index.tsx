import { useEffect, useRef, useState } from 'react';
import { Box, HStack, Text, Slider } from 'native-base';
import { useSelector } from 'react-redux';
import { RootState } from '@store/store';
import { calculateCurrentTime, durationToTime } from '@utils';
import { withMusicContext } from '@hoc';

type SongProgressProps = {
  songProgress: number;
  handleSongProgress: (progress: number) => Promise<void>;
};

const SongProgressComponent = ({ songProgress, handleSongProgress }: SongProgressProps) => {
  const [currentValue, setCurrentValue] = useState(0);
  const [isDragActive, setIsDragActive] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const currentTimePositionRef = useRef('0:00');
  const duration = useSelector((state: RootState) => state.song.duration);

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

export const SongProgress = withMusicContext(SongProgressComponent, {
  songProgress: data => data.songProgress,
  handleSongProgress: data => data.handleSongProgress,
});
