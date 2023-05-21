import { PropsWithChildren, useState, createContext, useContext, useEffect } from 'react';
import { Audio } from 'expo-av';
import { useDispatch } from 'react-redux';
import { SongStatus } from '@enums';
import { pauseSong, playSong, stopSong, resumeSong, loopSong } from '@store/reducers';
import { addToStorage, calculateSongPosition, calculateProgress, getFromStorage } from '@utils';
import { Album } from '@types';

interface ContextState {
  song?: Audio.Sound;
  songProgress: number;
  handleSong: (
    songStatus: SongStatus,
    id?: string,
    filename?: string,
    uri?: string,
    duration?: number,
  ) => Promise<void>;
  songDetails: {
    title: string;
    album: string;
  };
  handleSongProgress: (progress: number) => Promise<void>;
  handleCurrentAlbum: (album: Album) => void;
  handleSongIndex: (index: number) => void;
  handleMusicPlayerPlay: () => void;
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

  const handleSong = async (
    songStatus: SongStatus,
    id?: string,
    filename?: string,
    uri?: string,
    duration?: number,
  ) => {
    switch (songStatus) {
      case SongStatus.PLAY:
        song && (await song?.unloadAsync());
        const { sound } = await Audio.Sound.createAsync(
          { uri: uri! },
          { shouldPlay: true },
          status => {
            if (status.isLoaded) {
              const totalDuration = status.durationMillis! / 1000;
              const currentPosition = status.positionMillis / 1000;
              const timeLeft = calculateProgress(totalDuration, currentPosition);
              setSongProgress(timeLeft);

              if (status.didJustFinish) handleSong(SongStatus.NEXT);
            }
          },
        );

        setCurrentSongDuration(duration!);
        dispatch(playSong({ id, filename, uri, songStatus, duration }));
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
        setCurrentSongIndex(previousIndex);

        handleSong(
          SongStatus.PLAY,
          previousSong.id,
          previousSong.filename,
          previousSong.uri,
          previousSong.duration,
        );
        break;
      case SongStatus.NEXT:
        const nextIndex =
          currentSongIndex + 1 === currentAlbum!.items.length ? 0 : currentSongIndex + 1;
        setCurrentSongIndex(nextIndex);
        const nextSong = currentAlbum?.items[nextIndex]!;

        handleSong(
          SongStatus.PLAY,
          nextSong.id,
          nextSong.filename,
          nextSong.uri,
          nextSong.duration,
        );
        break;
      default:
        break;
    }
  };

  const handleMusicPlayerPlay = () => {
    const currentSong = currentAlbum?.items[currentSongIndex]!;
    handleSong(
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
    await addToStorage('album', currentAlbum!);
    await addToStorage('songIndex', currentSongIndex!);
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
      const { album, songIndex } = await getFromStorage();
      if (!album) return;
      setCurrentAlbum(album);
      setCurrentSongIndex(songIndex);
    };
    fetchStoredData();
  }, []);

  useEffect(() => {
    // toDo debug why next song in case of last one is wrongly calculated
    console.log({ currentSongIndex }, currentAlbum?.items.length);
  }, [currentSongIndex, currentAlbum]);

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
        handleMusicPlayerPlay,
      }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusicContext = () => {
  return useContext(MusicContext);
};
