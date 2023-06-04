export const calculateSongPosition = (position: number, duration: number) => {
  return Number(((position * duration) / 100).toFixed(2)) * 1000; // we need miliseconds value here so times 1000
};
