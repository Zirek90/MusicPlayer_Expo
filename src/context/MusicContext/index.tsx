import {
  PropsWithChildren,
  useState,
  createContext,
  useContext,
  useEffect,
  useCallback,
} from 'react';
import { Audio } from 'expo-av';
import { SongStatus } from '@enums';
import { calculateSongPosition } from '@utils';
import { MusicService, StorageService } from '@service';
import { CurrentSong } from '@types';
import { useAlbumsContext } from '../AlbumContext';

export interface MusicContextState {
  currentSong: CurrentSong;
  songProgress: number;
  songDetails: {
    title: string;
    album: string;
  };
  handleSongProgress: (progress: number) => Promise<void>;
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
  const { activeAlbum, currentlyPlayedAlbum, handleCurrentlyPlayedAlbum } = useAlbumsContext();

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
        currentSong.duration,
        isReactivated,
      );

      setCurrentSong(prev => ({ ...prev, id, filename, duration, songStatus, index }));
      setSong(sound);

      if (activeAlbum && activeAlbum?.album !== currentlyPlayedAlbum?.album) {
        handleCurrentlyPlayedAlbum(activeAlbum);
      }
    },
    [song, currentSong.duration],
  );

  const handleResume = useCallback(async () => {
    if (song) {
      await MusicService.resume(song);
      setCurrentSong(prev => ({ ...prev, songStatus: SongStatus.PLAY }));
      return;
    }

    if (!currentlyPlayedAlbum) return;
    //* in case we don't have active song, we get it from active album

    const activeSong = currentlyPlayedAlbum.items[currentSong.index];
    handlePlay(
      SongStatus.PLAY,
      activeSong.id,
      activeSong.filename,
      activeSong.uri,
      activeSong.duration,
      currentSong.index,
      true,
    );
  }, [song, currentlyPlayedAlbum, currentSong.index]);

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
    if (!currentlyPlayedAlbum) return;

    if (currentSong.isLooping) {
      handleLoop();
    }

    const previousIndex = currentSong.index === 0 ? 0 : currentSong.index - 1;
    const previousSong = currentlyPlayedAlbum.items[previousIndex]!;

    const { id, filename, uri, duration } = previousSong;
    await handlePlay(SongStatus.PLAY, id, filename, uri, duration, previousIndex);
  }, [currentlyPlayedAlbum, currentSong, handlePlay]);

  const handleNext = useCallback(async () => {
    if (!currentlyPlayedAlbum) return;

    if (currentSong.isLooping) {
      handleLoop();
    }

    const albumLength = currentlyPlayedAlbum.items.length - 1;
    const nextIndex = currentSong.index === albumLength ? 0 : currentSong.index + 1;

    const nextSong = currentlyPlayedAlbum.items[nextIndex];

    const { id, filename, uri, duration } = nextSong;
    await handlePlay(SongStatus.PLAY, id, filename, uri, duration, nextIndex);
  }, [currentlyPlayedAlbum, currentSong, handlePlay]);

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
    await StorageService.set('album', currentlyPlayedAlbum!);
    await StorageService.set('currentSong', currentSong);
  }, [currentlyPlayedAlbum, currentSong]);

  useEffect(() => {
    if (!currentSong.isSongDone) return;
    handleNext();
  }, [currentSong.isSongDone]);

  useEffect(() => {
    if (!currentlyPlayedAlbum) return;
    const activeSong = currentlyPlayedAlbum.items[currentSong.index];

    if (!activeSong) return;
    if (
      currentSong.songStatus === SongStatus.PLAY &&
      currentSong.filename !== activeSong.filename
    ) {
      return;
    }

    setSongDetails({
      title: activeSong.filename,
      album: currentlyPlayedAlbum.album,
    });
    manageStorage();
  }, [currentlyPlayedAlbum, currentSong.index]);

  useEffect(() => {
    const fetchStoredIndex = async () => {
      const { currentSong: songValue, songProgress: progress } = await StorageService.getAll();

      songValue && setCurrentSong(songValue);
      progress && setSongProgress(Number(progress));
    };
    fetchStoredIndex();
  }, []);

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
