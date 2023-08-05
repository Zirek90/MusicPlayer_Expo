import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
import { ImageSourcePropType } from 'react-native';
import { DARK_BG_PATHS } from '@global';

type BackgroundProviderState = {
  background: ImageSourcePropType;
};

const BackgroundContext = createContext<BackgroundProviderState>({
  background: require('../../assets/backgrounds/black_bg_1.png'),
});

export const BackgroundProvider = ({ children }: PropsWithChildren) => {
  const [background, setBackground] = useState<ImageSourcePropType>(
    require('../../assets/backgrounds/black_bg_1.png'),
  );

  useEffect(() => {
    setBackground(DARK_BG_PATHS[Math.floor(Math.random() * DARK_BG_PATHS.length)].path);
  }, []);

  return <BackgroundContext.Provider value={{ background }}>{children}</BackgroundContext.Provider>;
};

export const useBackgroundContext = () => {
  const state = useContext(BackgroundContext);
  if (state === null) {
    throw new Error('State is still null');
  } else if (state === undefined) {
    throw new Error('Attempt to access from outside of context');
  }
  return state;
};
