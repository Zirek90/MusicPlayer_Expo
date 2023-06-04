import { AVATAR_IMAGES } from '@constants';
import { ImageSourcePropType } from 'react-native';

export const chooseAvatarImage = (): ImageSourcePropType => {
  return AVATAR_IMAGES[Math.floor(Math.random() * AVATAR_IMAGES.length)];
};
