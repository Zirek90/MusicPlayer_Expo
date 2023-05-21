export const calculateProgress = (duration: number, currentTime: number) => {
  return Number(((currentTime / duration) * 100).toFixed(2));
};
