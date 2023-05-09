export const calculateTimeLeft = (duration: number, currentTime: number) => {
  return Number(((currentTime / duration) * 100).toFixed(2));
};
