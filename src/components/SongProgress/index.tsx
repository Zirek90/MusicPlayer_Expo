import { Box, HStack, Text, Slider } from 'native-base';
import { durationToTime } from '@utils';
import { withMusicContext } from '@hoc';
import { INITIAL_MUSIC_POSITION } from '@constants';
import { useSongProgress } from './hook';
import { SongProgressProps } from './type/songProgress.type';

const SongProgressComponent = ({
  songProgress,
  handleSongProgress,
  duration,
}: SongProgressProps) => {
  const { currentValue, setIsDragActive, handleSliderChange, currentTimePositionRef } =
    useSongProgress({ songProgress, handleSongProgress, duration });

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
