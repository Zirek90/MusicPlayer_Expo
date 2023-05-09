const get2Digits = (duration: number) => {
  return duration <= 9 ? '0' + duration : duration;
};

export const durationToTime = (duration: number) => {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration - minutes * 60);
  return `( ${minutes}:${get2Digits(seconds)} )`;
};
