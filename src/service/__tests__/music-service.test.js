import { Audio } from 'expo-av';

import { MusicService } from '../MusicService';

jest.mock('../StorageService', () => ({
  get: jest.fn(),
  getAll: jest.fn(),
  set: jest.fn(),
}));

describe('MusicService', () => {
  const uri = 'test-audio-uri';
  const setProgress = jest.fn();
  const setCurrentSong = jest.fn();
  const currentSongDuration = 300;
  let soundObject;

  beforeEach(() => {
    soundObject = {
      stopAsync: jest.fn(),
      unloadAsync: jest.fn(),
      pauseAsync: jest.fn(),
      playAsync: jest.fn(),
      setStatusAsync: jest.fn(),
      getPositionAsync: jest.fn(),
      setPositionAsync: jest.fn(),
      getStatusAsync: jest.fn(),
    };
    const createAsyncMock = jest.spyOn(Audio.Sound, 'createAsync');
    createAsyncMock.mockReturnValue(Promise.resolve({ sound: soundObject }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('play', () => {
    it('should play audio with default options', async () => {
      await MusicService.play(uri, setProgress, setCurrentSong, currentSongDuration);
      expect(Audio.Sound.createAsync).toHaveBeenCalledWith(
        { uri },
        { shouldPlay: false },
        expect.any(Function),
      );
      expect(soundObject.playAsync).toHaveBeenCalled();
    });
  });

  describe('stop', () => {
    it('should stop and unload the sound object', async () => {
      await MusicService.stop(soundObject);
      expect(soundObject.stopAsync).toHaveBeenCalled();
      expect(soundObject.unloadAsync).toHaveBeenCalled();
    });
  });

  describe('pause', () => {
    it('should pause the sound object', async () => {
      await MusicService.pause(soundObject);
      expect(soundObject.pauseAsync).toHaveBeenCalled();
    });
  });

  describe('resume', () => {
    it('should resume playback of the sound object', async () => {
      await MusicService.resume(soundObject);
      expect(soundObject.playAsync).toHaveBeenCalled();
    });
  });

  describe('loop', () => {
    it('should toggle looping state of the sound object', async () => {
      const isLoopingInitial = false;
      soundObject.getStatusAsync.mockResolvedValue({ isLoaded: true, isLooping: isLoopingInitial });

      await MusicService.loop(soundObject);

      expect(soundObject.getStatusAsync).toHaveBeenCalled();
      expect(soundObject.setStatusAsync).toHaveBeenCalledWith({
        isLooping: !isLoopingInitial,
      });
    });
  });
});
