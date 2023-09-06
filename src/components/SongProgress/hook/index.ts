import { useEffect, useRef, useState } from 'react';
import { INITIAL_MUSIC_POSITION } from '@constants';
import { calculateCurrentTime } from '@utils';
import { SongProgressProps } from '../type/songProgress.type';

export const useSongProgress = ({
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

  return { currentValue, setIsDragActive, handleSliderChange, currentTimePositionRef };
};
