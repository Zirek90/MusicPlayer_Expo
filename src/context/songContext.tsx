import { PropsWithChildren, useState, createContext, useContext } from 'react';
import { Audio } from 'expo-av';
import { SongStatus } from '@enums';
import { useDispatch } from 'react-redux';
import { pauseSong, playSong, stopSong, resumeSong } from '@store/reducers';
import { calculateTimeLeft } from '@utils';

interface ContextState {
  song?: Audio.Sound;
  songProgress: number;
  handleSong: (songStatus: SongStatus, id?: string, filename?: string, uri?: string) => void;
}

const SongContext = createContext<ContextState>({} as ContextState);

export const SongContextProvider = ({ children }: PropsWithChildren) => {
  const [song, setSong] = useState<Audio.Sound>();
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

  return (
    <SongContext.Provider value={{ song, songProgress, handleSong }}>
      {children}
    </SongContext.Provider>
  );
};

export const useSongContext = () => {
  return useContext(SongContext);
};