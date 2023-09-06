import { COLORS } from '@global';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';

import { ForewardService } from '../ForegroundService';

describe('ForewardService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should start a task', () => {
    const songTitle = 'Song';
    ForewardService.startTask(songTitle);

    expect(ReactNativeForegroundService.start).toHaveBeenCalledWith({
      id: 1,
      title: 'Music Player',
      message: `${songTitle} is playing`,
      icon: 'ic_launcher',
      color: COLORS.background_secondary,
    });
  });

  it('should stop a task', () => {
    ForewardService.stopTask();

    expect(ReactNativeForegroundService.stop).toHaveBeenCalled();
  });

  it('should remove all tasks', () => {
    ForewardService.removeTasks();

    expect(ReactNativeForegroundService.remove_all_tasks).toHaveBeenCalled();
  });

  it('should update a task', () => {
    const songTitle = 'Updated Song';
    ForewardService.updateTask(songTitle);

    expect(ReactNativeForegroundService.update).toHaveBeenCalledWith({
      id: 1,
      title: 'Music Player',
      message: `${songTitle} is playing`,
      icon: 'ic_launcher',
      color: COLORS.background_secondary,
    });
  });
});
