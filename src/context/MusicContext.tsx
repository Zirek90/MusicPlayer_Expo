import { PropsWithChildren, useState, createContext, useContext, useEffect } from 'react';
import { Audio } from 'expo-av';
import { useDispatch } from 'react-redux';
import { SongStatus } from '@enums';
import { pauseSong, playSong, stopSong, resumeSong, loopSong } from '@store/reducers';
import { calculateSongPosition, calculateTimeLeft } from '@utils';
import { Album } from '@types';

interface ContextState {
  song?: Audio.Sound;
  songProgress: number;
  handleSong: (
    songStatus: SongStatus,
    id?: string,
    filename?: string,
    uri?: string,
  ) => Promise<void>;
  songDetails: {
    title: string;
    album: string;
  };
  handleSongProgress: (progress: number) => Promise<void>;
  handleCurrentAlbum: (album: Album) => void;
  handleSongIndex: (index: number) => void;
}

const MusicContext = createContext<ContextState>({} as ContextState);

export const MusicContextProvider = ({ children }: PropsWithChildren) => {
  const [song, setSong] = useState<Audio.Sound>();
  const [currentSongIndex, setSongIndex] = useState<number>(0);
  const [currentAlbum, setCurrentAlbum] = useState<Album | undefined>(undefined);
  const [songDetails, setSongDetails] = useState({
    title: '',
    album: '',
  });
  const [currentSongDuration, setCurrentSongDuration] = useState(0);
  const [songProgress, setSongProgress] = useState(0);
  const dispatch = useDispatch();

  const handleSong = async (
    songStatus: SongStatus,
    id?: string,
    filename?: string,
    uri?: string,
  ) => {
    switch (songStatus) {
      case SongStatus.PLAY:
        song && (await song?.unloadAsync());
        const { sound } = await Audio.Sound.createAsync(
          { uri: uri! },
          { shouldPlay: true },
          status => {
            if (status.isLoaded) {
              const duration = status.durationMillis! / 1000;
              const currentPosition = status.positionMillis / 1000;
              const timeLeft = calculateTimeLeft(duration, currentPosition);
              setCurrentSongDuration(duration);
              setSongProgress(timeLeft);
            }
          },
        );

        dispatch(playSong({ id, filename, uri, songStatus }));
        setSong(sound);
        break;
      case SongStatus.RESUME:
        await song?.playAsync();
        dispatch(resumeSong());
        break;
      case SongStatus.STOP:
        await song?.unloadAsync();
        dispatch(stopSong({ songStatus }));
        setSongProgress(0);
        setSong(undefined);
        break;
      case SongStatus.PAUSE:
        await song?.pauseAsync();
        dispatch(pauseSong({ songStatus }));
        break;
      case SongStatus.LOOP:
        const currentSong = await song?.getStatusAsync();
        if (currentSong?.isLoaded) {
          const isLooping = currentSong.isLooping;
          await song?.setIsLoopingAsync(!isLooping);
        }
        dispatch(loopSong());
        break;
      case SongStatus.PREVIOUS:
        const previousIndex = currentSongIndex === 0 ? 0 : currentSongIndex - 1;
        const previousSong = currentAlbum?.items[previousIndex]!;
        setSongIndex(previousIndex);

        handleSong(SongStatus.PLAY, previousSong.id, previousSong.filename, previousSong.uri);
        break;
      case SongStatus.NEXT:
        const nextIndex =
          currentSongIndex === currentAlbum!.items.length ? 0 : currentSongIndex + 1;
        const nextSong = currentAlbum?.items[nextIndex]!;
        setSongIndex(nextIndex);

        handleSong(SongStatus.PLAY, nextSong.id, nextSong.filename, nextSong.uri);
        break;
      default:
        break;
    }
  };

  const handleSongProgress = async (progress: number) => {
    if (song) {
      const currentPositon = calculateSongPosition(progress, currentSongDuration);
      await song.setPositionAsync(currentPositon);
    }
  };

  const handleCurrentAlbum = (album: Album) => setCurrentAlbum(album);

  const handleSongIndex = (index: number) => setSongIndex(index);

  useEffect(() => {
    if (!currentAlbum) return;
    const currentSong = currentAlbum.items[currentSongIndex];
    setSongDetails({
      title: currentSong.filename,
      album: currentAlbum.album,
    });
  }, [currentAlbum, currentSongIndex]);

  return (
    <MusicContext.Provider
      value={{
        song,
        songProgress,
        songDetails,
        handleSong,
        handleSongProgress,
        handleCurrentAlbum,
        handleSongIndex,
      }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusicContext = () => {
  return useContext(MusicContext);
};
