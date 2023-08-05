import { useEffect, useRef, useState } from 'react';
import { Box, HStack, Text, Slider } from 'native-base';
import { calculateCurrentTime, durationToTime } from '@utils';
import { withMusicContext } from '@hoc';
import { INITIAL_MUSIC_POSITION } from '@constants';

type SongProgressProps = {
  songProgress: number;
  duration: number;
  handleSongProgress: (progress: number) => Promise<void>;
};

const SongProgressComponent = ({
  songProgress,
  handleSongProgress,
  duration,
}: SongProgressProps) => {
  const [currentValue, setCurrentValue] = useState(0);
  const [isDragActive, setIsDragActive] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const currentTimePositionRef = useRef(INITIAL_MUSIC_POSITION);

  useEffect(() => {
    if (isDragActive) return;
    setCurrentValue(songProgress);
  }, [songProgress, isDragActive]);

  useEffect(() => {
    if (!duration) return;
    currentTimePositionRef.current = calculateCurrentTime(duration, songProgress);
  }, [songProgress, duration]);

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
        <Text fontSize="lg">{duration ? durationToTime(duration) : INITIAL_MUSIC_POSITION}</Text>
      </HStack>
    </Box>
  );
};

export const SongProgress = withMusicContext(SongProgressComponent, {
  songProgress: data => data.songProgress,
  handleSongProgress: data => data.handleSongProgress,
  duration: data => data.currentSong.duration,
});
