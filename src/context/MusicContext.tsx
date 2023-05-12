import { PropsWithChildren, useState, createContext, useContext } from 'react';
import { Audio } from 'expo-av';
import { useDispatch } from 'react-redux';
import { SongStatus } from '@enums';
import { pauseSong, playSong, stopSong, resumeSong } from '@store/reducers';
import { calculateSongPosition, calculateTimeLeft } from '@utils';

interface ContextState {
  song?: Audio.Sound;
  songProgress: number;
  handleSong: (songStatus: SongStatus, id?: string, filename?: string, uri?: string) => void;
  handleSongProgress: (progress: number) => void;
}

const MusicContext = createContext<ContextState>({} as ContextState);

export const MusicContextProvider = ({ children }: PropsWithChildren) => {
  const [song, setSong] = useState<Audio.Sound>();
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
        song && song?.unloadAsync();
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
        song?.playAsync();
        dispatch(resumeSong());
        break;
      case SongStatus.STOP:
        song?.unloadAsync();
        dispatch(stopSong({ songStatus }));
        setSongProgress(0);
        setSong(undefined);
        break;
      case SongStatus.PAUSE:
        song?.pauseAsync();
        dispatch(pauseSong({ songStatus }));
        break;
      default:
        break;
    }
  };

  const handleSongProgress = (progress: number) => {
    if (song) {
      const currentPositon = calculateSongPosition(progress, currentSongDuration);
      song.setPositionAsync(currentPositon);
    }
  };

  return (
    <MusicContext.Provider value={{ song, songProgress, handleSong, handleSongProgress }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusicContext = () => {
  return useContext(MusicContext);
};
