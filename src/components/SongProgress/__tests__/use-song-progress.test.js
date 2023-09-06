import { renderHook, act } from '@testing-library/react-native';

import { useSongProgress } from '../hook';

describe('useSongProgress', () => {
  jest.useFakeTimers();
  const songProgress = 0.5;
  const handleSongProgress = jest.fn();
  const duration = 300;
  const { result } = renderHook(() =>
    useSongProgress({ songProgress, handleSongProgress, duration }),
  );

  it('should initialize currentValue of provided songProgress', () => {
    expect(result.current.currentValue).toBe(songProgress);
  });

  it('should call handleSongProgress when handleSliderChange is NOT called with isOnEnd=false', () => {
    const newSongProgress = 0.7;
    act(() => {
      result.current.handleSliderChange(newSongProgress, false);
    });
    expect(handleSongProgress).not.toHaveBeenCalled();
  });

  it('should call handleSongProgress when handleSliderChange is called with isOnEnd=true', () => {
    const newSongProgress = 0.7;
    act(() => {
      result.current.handleSliderChange(newSongProgress, true);
    });
    expect(handleSongProgress).toHaveBeenCalledWith(newSongProgress);
  });

  it('should set isDragActive to false after a delay when handleSliderChange is called with isOnEnd=true', async () => {
    const newSongProgress = 0.7;
    const newDuration = 400;
    act(() => {
      result.current.handleSliderChange(newSongProgress, true);
    });

    result.current.currentTimePositionRef.current = (newSongProgress * newDuration) / 1000;

    jest.advanceTimersByTime(500);

    expect(result.current.isDragActive).toBeUndefined();

    const expectedPosition = newSongProgress * (newDuration / 1000);
    const parsedCurrentTimePosition = parseFloat(result.current.currentTimePositionRef.current);

    expect(parsedCurrentTimePosition).toBeCloseTo(expectedPosition, 2);
  });
});
