import {
  PropsWithChildren,
  useState,
  createContext,
  useContext,
  useEffect,
  useCallback,
} from 'react';
import { AppState } from 'react-native';
import { Audio } from 'expo-av';
import { useDispatch, useSelector } from 'react-redux';
import { SongStatus } from '@enums';
import { pauseSong, playSong, stopSong, resumeSong, loopSong } from '@store/reducers';
import { calculateSongPosition } from '@utils';
import { MusicService, StorageService, ForewardService } from '@service';
import { useAlbumsContext } from '../AlbumContext';
import { RootState } from '@store/store';

export interface MusicContextState {
  currentSongDuration: number;
  songProgress: number;
  songDetails: {
    title: string;
    album: string;
  };
  handleSongProgress: (progress: number) => Promise<void>;
  handleSongIndex: (index: number) => void;
  handleMusicPlayerPlay: () => Promise<void>;
  handlePlay: (
    songStatus: SongStatus,
    id: string,
    filename: string,
    uri: string,
    duration: number,
    isReactivated?: boolean,
  ) => Promise<void>;
  handleResume: () => Promise<void>;
  handleStop: () => Promise<void>;
  handlePause: () => Promise<void>;
  handleLoop: () => Promise<void>;
  handlePrevious: () => Promise<void>;
  handleNext: () => Promise<void>;
}

const MusicContext = createContext<MusicContextState>({} as MusicContextState);

export const MusicContextProvider = ({ children }: PropsWithChildren) => {
  const [song, setSong] = useState<Audio.Sound>();
  const [songDetails, setSongDetails] = useState({
    title: '',
    album: '',
  });
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const [currentSongDuration, setCurrentSongDuration] = useState(0);
  const [songProgress, setSongProgress] = useState(0);
  const [isSongDone, setIsSongDone] = useState(false);
  const { activeAlbum } = useAlbumsContext();
  const dispatch = useDispatch();
  const isLooping = useSelector((state: RootState) => state.song.isLooping);

  const handlePlay = useCallback(
    async (
      songStatus: SongStatus,
      id: string,
      filename: string,
      uri: string,
      duration: number,
      isReactivated?: boolean,
    ) => {
      if (song) {
        MusicService.stop(song);
      }
      const sound = await MusicService.play(
        uri,
        setSongProgress,
        setIsSongDone,
        songProgress,
        currentSongDuration,
        isReactivated,
      );

      dispatch(playSong({ id, filename, uri, songStatus }));
      setCurrentSongDuration(duration);
      setSong(sound);
      StorageService.set('songDuration', duration);
    },
    [song, songProgress, currentSongDuration],
  );

  const handleResume = useCallback(async () => {
    if (!song) return;

    await MusicService.resume(song);
    dispatch(resumeSong());
  }, [song]);

  const handleStop = useCallback(async () => {
    if (!song) return;

    await MusicService.stop(song);
    dispatch(stopSong({ songStatus: SongStatus.STOP }));
    setSongProgress(0);
    setSong(undefined);
  }, [song]);

  const handlePause = useCallback(async () => {
    if (!song) return;

    await MusicService.pause(song);
    dispatch(pauseSong({ songStatus: SongStatus.PAUSE }));
  }, [song]);

  const handleLoop = useCallback(async () => {
    if (!song) return;

    await MusicService.loop(song);
    dispatch(loopSong());
  }, [song]);

  const handlePrevious = useCallback(async () => {
    if (!activeAlbum) return;

    if (isLooping) {
      handleLoop();
    }

    const previousIndex = currentSongIndex === 0 ? 0 : currentSongIndex - 1;
    const previousSong = activeAlbum.items[previousIndex]!;
    setCurrentSongIndex(previousIndex);

    const { id, filename, uri, duration } = previousSong;
    await handlePlay(SongStatus.PLAY, id, filename, uri, duration);
  }, [activeAlbum, currentSongIndex, handlePlay]);

  const handleNext = useCallback(async () => {
    if (!activeAlbum) return;

    if (isLooping) {
      handleLoop();
    }

    const albumLength = activeAlbum.items.length - 1;
    const nextIndex = currentSongIndex === albumLength ? 0 : currentSongIndex + 1;
    setCurrentSongIndex(nextIndex);
    const nextSong = activeAlbum.items[nextIndex];

    const { id, filename, uri, duration } = nextSong;
    await handlePlay(SongStatus.PLAY, id, filename, uri, duration);
  }, [activeAlbum, currentSongIndex, handlePlay]);

  const handleMusicPlayerPlay = useCallback(async () => {
    if (!activeAlbum) return;

    const currentSong = activeAlbum.items[currentSongIndex];
    handlePlay(
      SongStatus.PLAY,
      currentSong.id,
      currentSong.filename,
      currentSong.uri,
      currentSong.duration,
      true,
    );
  }, [activeAlbum]);

  const handleSongProgress = useCallback(
    async (progress: number) => {
      if (song) {
        const currentPositon = calculateSongPosition(progress, currentSongDuration);
        await song.setPositionAsync(currentPositon);
      }
    },
    [song, currentSongDuration],
  );

  const handleSongIndex = useCallback((index: number) => setCurrentSongIndex(index), []);

  const manageStorage = useCallback(async () => {
    await StorageService.set('album', activeAlbum!);
    await StorageService.set('songIndex', currentSongIndex!);
  }, [activeAlbum, currentSongIndex]);

  useEffect(() => {
    if (!isSongDone) return;
    handleNext();
  }, [isSongDone]);

  useEffect(() => {
    if (!activeAlbum) return;
    const currentSong = activeAlbum.items[currentSongIndex];
    if (!currentSong) return;

    setSongDetails({
      title: currentSong.filename,
      album: activeAlbum.album,
    });
    manageStorage();
  }, [activeAlbum, currentSongIndex]);

  useEffect(() => {
    const fetchStoredIndex = async () => {
      const { songIndex, songDuration, songProgress: progress } = await StorageService.get();

      songIndex && setCurrentSongIndex(songIndex);
      songDuration && setCurrentSongDuration(Number(songDuration));
      progress && setSongProgress(Number(progress));
    };
    fetchStoredIndex();
  }, []);

  const handleForegroundServiceStart = useCallback(() => {
    ForewardService.startTask(songDetails.title);
  }, [songDetails]);

  useEffect(() => {
    const appStateListener = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'background') {
        handleForegroundServiceStart();
      } else if (nextAppState === 'active') {
        ForewardService.stopTask();
      }
    });

    return () => {
      appStateListener.remove();
      ForewardService.removeTasks();
    };
  }, [handleForegroundServiceStart]);

  return (
    <MusicContext.Provider
      value={{
        currentSongDuration,
        songProgress,
        songDetails,
        handlePlay,
        handlePause,
        handleResume,
        handleStop,
        handleLoop,
        handleNext,
        handlePrevious,
        handleSongProgress,
        handleSongIndex,
        handleMusicPlayerPlay,
      }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusicContext = () => {
  return useContext(MusicContext);
};
