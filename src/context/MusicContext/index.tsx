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
import { SongStatus } from '@enums';
import { calculateSongPosition } from '@utils';
import { MusicService, StorageService } from '@service';
import { useAlbumsContext } from '../AlbumContext';

type CurrentSong = {
  id: string;
  filename: string;
  isLooping: boolean;
  songStatus: SongStatus | null;
  isSongDone: boolean;
  duration: number;
  index: number;
};

export interface MusicContextState {
  currentSong: CurrentSong;
  songProgress: number;
  songDetails: {
    title: string;
    album: string;
  };
  handleSongProgress: (progress: number) => Promise<void>;
  handleMusicPlayerPlay: () => Promise<void>;
  handlePlay: (
    songStatus: SongStatus,
    id: string,
    filename: string,
    uri: string,
    duration: number,
    index: number,
    isReactivated?: boolean,
  ) => Promise<void>;
  handleResume: () => Promise<void>;
  handlePause: () => Promise<void>;
  handleLoop: () => Promise<void>;
  handlePrevious: () => Promise<void>;
  handleNext: () => Promise<void>;
}

const MusicContext = createContext<MusicContextState | null>(null);

export const MusicContextProvider = ({ children }: PropsWithChildren) => {
  const [song, setSong] = useState<Audio.Sound>();
  const [songDetails, setSongDetails] = useState({
    title: '',
    album: '',
  });
  const [songProgress, setSongProgress] = useState(0);
  const [currentSong, setCurrentSong] = useState<CurrentSong>({
    id: '',
    filename: '',
    isLooping: false,
    songStatus: null,
    isSongDone: false,
    duration: 0,
    index: 0,
  });
  const { activeAlbum } = useAlbumsContext();

  const handlePlay = useCallback(
    async (
      songStatus: SongStatus,
      id: string,
      filename: string,
      uri: string,
      duration: number,
      index: number,
      isReactivated?: boolean,
    ) => {
      if (song) {
        MusicService.stop(song);
      }
      const sound = await MusicService.play(
        uri,
        setSongProgress,
        setCurrentSong,
        songProgress,
        currentSong.duration,
        isReactivated,
      );

      setCurrentSong(prev => ({ ...prev, id, filename, duration, songStatus, index }));
      setSong(sound);
      StorageService.set('songDuration', duration);
    },
    [song, songProgress, currentSong.duration],
  );

  const handleResume = useCallback(async () => {
    if (!song) return;

    await MusicService.resume(song);
    setCurrentSong(prev => ({ ...prev, songStatus: SongStatus.PLAY }));
  }, [song]);

  // const handleStop = useCallback(async () => {
  //   if (!song) return;

  //   await MusicService.stop(song);
  //   setCurrentSong(prev => ({ ...prev, songStatus: SongStatus.STOP }));

  //   setSongProgress(0);
  //   setSong(undefined);
  // }, [song]);

  const handlePause = useCallback(async () => {
    if (!song) return;

    await MusicService.pause(song);
    setCurrentSong(prev => ({ ...prev, songStatus: SongStatus.PAUSE }));
  }, [song]);

  const handleLoop = useCallback(async () => {
    if (!song) return;

    await MusicService.loop(song);
    setCurrentSong(prev => ({ ...prev, isLooping: !prev.isLooping }));
  }, [song]);

  const handlePrevious = useCallback(async () => {
    if (!activeAlbum) return;

    if (currentSong.isLooping) {
      handleLoop();
    }

    const previousIndex = currentSong.index === 0 ? 0 : currentSong.index - 1;
    const previousSong = activeAlbum.items[previousIndex]!;

    const { id, filename, uri, duration } = previousSong;
    await handlePlay(SongStatus.PLAY, id, filename, uri, duration, previousIndex);
  }, [activeAlbum, currentSong, handlePlay]);

  const handleNext = useCallback(async () => {
    if (!activeAlbum) return;

    if (currentSong.isLooping) {
      handleLoop();
    }

    const albumLength = activeAlbum.items.length - 1;
    const nextIndex = currentSong.index === albumLength ? 0 : currentSong.index + 1;

    const nextSong = activeAlbum.items[nextIndex];

    const { id, filename, uri, duration } = nextSong;
    await handlePlay(SongStatus.PLAY, id, filename, uri, duration, nextIndex);
  }, [activeAlbum, currentSong, handlePlay]);

  const handleMusicPlayerPlay = useCallback(async () => {
    if (!activeAlbum) return;

    const activeSong = activeAlbum.items[currentSong.index];
    handlePlay(
      SongStatus.PLAY,
      activeSong.id,
      activeSong.filename,
      activeSong.uri,
      activeSong.duration,
      currentSong.index,
      true,
    );
  }, [activeAlbum, currentSong.index]);

  const handleSongProgress = useCallback(
    async (progress: number) => {
      if (song) {
        const currentPositon = calculateSongPosition(progress, currentSong.duration);
        await song.setPositionAsync(currentPositon);
      }
    },
    [song, currentSong.duration],
  );

  const manageStorage = useCallback(async () => {
    await StorageService.set('album', activeAlbum!);
    await StorageService.set('songIndex', currentSong.index!);
  }, [activeAlbum, currentSong.index]);

  useEffect(() => {
    if (!currentSong.isSongDone) return;
    handleNext();
  }, [currentSong.isSongDone]);

  useEffect(() => {
    if (!activeAlbum) return;
    const activeSong = activeAlbum.items[currentSong.index];

    // toDo this require fix, change song in music player even when change only albm tab
    if (!activeSong) return;

    setSongDetails({
      title: activeSong.filename,
      album: activeAlbum.album,
    });
    manageStorage();

    // //* to handle background song changes
    // if (AppState.currentState === 'background') {
    //   ForewardService.updateTask(activeSong.filename);
    // }
  }, [activeAlbum, currentSong.index]);

  useEffect(() => {
    const fetchStoredIndex = async () => {
      const { songIndex, songDuration, songProgress: progress } = await StorageService.get();

      songIndex && setCurrentSong(prev => ({ ...prev, index: songIndex }));
      songDuration && setCurrentSong(prev => ({ ...prev, duration: Number(songDuration) }));
      progress && setSongProgress(Number(progress));
    };
    fetchStoredIndex();
  }, []);

  // const handleForegroundServiceStart = useCallback(() => {
  //   if (currentSong.songStatus !== SongStatus.PLAY) return;

  //   // ForewardService.startTask(songDetails.title);
  // }, [songDetails, currentSong.songStatus]);

  // useEffect(() => {
  //   const appStateListener = AppState.addEventListener('change', nextAppState => {
  //     if (nextAppState === 'background') {
  //       handleForegroundServiceStart();
  //     } else if (nextAppState === 'active') {
  //       // ForewardService.stopTask();
  //     }
  //   });

  //   return () => {
  //     appStateListener.remove();
  //     // ForewardService.removeTasks();
  //   };
  // }, [handleForegroundServiceStart]);

  return (
    <MusicContext.Provider
      value={{
        currentSong,
        songProgress,
        songDetails,
        handlePlay,
        handlePause,
        handleResume,
        handleLoop,
        handleNext,
        handlePrevious,
        handleSongProgress,
        handleMusicPlayerPlay,
      }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusicContext = () => {
  const state = useContext(MusicContext);
  if (state === null) {
    throw new Error('State is still null');
  } else if (state === undefined) {
    throw new Error('Attempt to access from outside of context');
  }
  return state;
};
