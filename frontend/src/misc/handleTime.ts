export function stringToSeconds(time: string) {
  const [minutes, seconds] = time.split(':').map(Number);
  return minutes * 60 + seconds;
};

export function secondsToString(timeInSeconds: number) {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};