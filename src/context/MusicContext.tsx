import { PropsWithChildren, useState, createContext, useContext, useEffect } from 'react';
import { Audio } from 'expo-av';
import { useDispatch } from 'react-redux';
import { SongStatus } from '@enums';
import { pauseSong, playSong, stopSong, resumeSong, loopSong } from '@store/reducers';
import { calculateSongPosition } from '@utils';
import { Album } from '@types';
import { MusicService, StorageService } from '@service';

interface ContextState {
  songProgress: number;
  songDetails: {
    title: string;
    album: string;
  };
  handleSongProgress: (progress: number) => Promise<void>;
  handleCurrentAlbum: (album: Album) => void;
  handleSongIndex: (index: number) => void;
  handleMusicPlayerPlay: () => Promise<void>;
  handlePlay: (
    songStatus: SongStatus,
    id: string,
    filename: string,
    uri: string,
    duration: number,
  ) => Promise<void>;
  handleResume: () => Promise<void>;
  handleStop: () => Promise<void>;
  handlePause: () => Promise<void>;
  handleLoop: () => Promise<void>;
  handlePrevious: () => Promise<void>;
  handleNext: () => Promise<void>;
}

const MusicContext = createContext<ContextState>({} as ContextState);

export const MusicContextProvider = ({ children }: PropsWithChildren) => {
  const [song, setSong] = useState<Audio.Sound>();
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const [currentAlbum, setCurrentAlbum] = useState<Album | undefined>(undefined);
  const [songDetails, setSongDetails] = useState({
    title: '',
    album: '',
  });
  const [currentSongDuration, setCurrentSongDuration] = useState(0);
  const [songProgress, setSongProgress] = useState(0);
  const dispatch = useDispatch();

  const handlePlay = async (
    songStatus: SongStatus,
    id: string,
    filename: string,
    uri: string,
    duration: number,
  ) => {
    if (song) {
      await MusicService.stop(song);
    }
    const sound = await MusicService.play(uri, setSongProgress);

    setCurrentSongDuration(duration);
    dispatch(playSong({ id, filename, uri, songStatus, duration }));
    setSong(sound);
  };

  const handleResume = async () => {
    if (!song) return;

    await MusicService.resume(song);
    dispatch(resumeSong());
  };

  const handleStop = async () => {
    if (!song) return;

    await MusicService.stop(song);
    dispatch(stopSong({ songStatus: SongStatus.STOP }));
    setSongProgress(0);
    setSong(undefined);
  };

  const handlePause = async () => {
    if (!song) return;

    await MusicService.pause(song);
    dispatch(pauseSong({ songStatus: SongStatus.PAUSE }));
  };

  const handleLoop = async () => {
    if (!song) return;

    await MusicService.loop(song);
    dispatch(loopSong());
  };

  const handlePrevious = async () => {
    const previousIndex = currentSongIndex === 0 ? 0 : currentSongIndex - 1;
    const previousSong = currentAlbum?.items[previousIndex]!;
    setCurrentSongIndex(previousIndex);

    const { id, filename, uri, duration } = previousSong;
    await handlePlay(SongStatus.PLAY, id, filename, uri, duration);
  };

  const handleNext = async () => {
    const albumLength = currentAlbum!.items.length - 1;
    const nextIndex = currentSongIndex === albumLength ? 0 : currentSongIndex + 1;
    setCurrentSongIndex(nextIndex);
    const nextSong = currentAlbum?.items[nextIndex]!;

    const { id, filename, uri, duration } = nextSong;
    await handlePlay(SongStatus.PLAY, id, filename, uri, duration);
  };

  const handleMusicPlayerPlay = async () => {
    const currentSong = currentAlbum?.items[currentSongIndex]!;
    handlePlay(
      SongStatus.PLAY,
      currentSong.id,
      currentSong.filename,
      currentSong.uri,
      currentSong.duration,
    );
  };

  const handleSongProgress = async (progress: number) => {
    if (song) {
      const currentPositon = calculateSongPosition(progress, currentSongDuration);
      await song.setPositionAsync(currentPositon);
    }
  };

  const handleCurrentAlbum = (album: Album) => setCurrentAlbum(album);

  const handleSongIndex = (index: number) => setCurrentSongIndex(index);

  const manageStorage = async () => {
    await StorageService.set('album', currentAlbum!);
    await StorageService.set('songIndex', currentSongIndex!);
  };

  useEffect(() => {
    if (!currentAlbum) return;
    const currentSong = currentAlbum.items[currentSongIndex];
    setSongDetails({
      title: currentSong.filename,
      album: currentAlbum.album,
    });
    manageStorage();
  }, [currentAlbum, currentSongIndex]);

  useEffect(() => {
    const fetchStoredData = async () => {
      const { album, songIndex } = await StorageService.get();
      if (!album) return;
      setCurrentAlbum(album);
      setCurrentSongIndex(songIndex);
    };
    fetchStoredData();
  }, []);

  useEffect(() => {
    // toDo debug why next song in case of last one is wrongly calculated
    console.log({ currentSongIndex }, { length: currentAlbum?.items.length });
  }, [currentSongIndex, currentAlbum]);

  return (
    <MusicContext.Provider
      value={{
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
        handleCurrentAlbum,
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
