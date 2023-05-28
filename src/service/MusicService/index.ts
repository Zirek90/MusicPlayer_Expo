import { Audio } from 'expo-av';
import { calculateProgress } from '@utils';
import { StorageService } from '../StorageService';

export const MusicService = {
  play: async (
    uri: string,
    setProgress: (v: number) => void,
    setIsSongDone: (v: boolean) => void,
  ) => {
    setIsSongDone(false);
    const { sound } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: false },
      async status => {
        if (status.isLoaded) {
          if (!status.positionMillis) return;

          const totalDuration = status.durationMillis! / 1000;
          const currentPosition = status.positionMillis / 1000;
          const timeLeft = calculateProgress(totalDuration, currentPosition);
          setProgress(timeLeft);
          StorageService.set('songProgress', timeLeft);

          if (status.didJustFinish) {
            if (status.isLooping) return;
            setIsSongDone(true);
          }
        }
      },
    );
    return sound;
  },
  stop: async (soundObject: Audio.Sound) => {
    await soundObject.stopAsync();
    await soundObject.unloadAsync();
  },
  pause: async (soundObject: Audio.Sound) => {
    await soundObject.pauseAsync();
  },
  resume: async (soundObject: Audio.Sound) => {
    await soundObject.playAsync();
  },
  loop: async (soundObject: Audio.Sound) => {
    const currentSong = await soundObject.getStatusAsync();
    if (currentSong.isLoaded) {
      const isLooping = currentSong.isLooping;
      await soundObject.setIsLoopingAsync(!isLooping);
    }
  },
};
