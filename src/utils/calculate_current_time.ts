import { durationToTime } from './duration_to_time';

export const calculateCurrentTime = (duation: number, progress: number) => {
  const currentTime = (duation * progress) / 100;
  return durationToTime(currentTime);
};
