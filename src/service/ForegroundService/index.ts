import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import { COLORS } from '@global';

export const ForewardService = {
  startTask: (songTitle: string) => {
    ReactNativeForegroundService.start({
      id: 1244,
      title: 'Music Player',
      message: `${songTitle} is playing`,
      icon: 'ic_launcher',
      color: COLORS.background_secondary, //accept only hex
    });
  },
  stopTask: () => {
    return ReactNativeForegroundService.stop();
  },
  removeTasks: () => {
    return ReactNativeForegroundService.remove_all_tasks();
  },
};
