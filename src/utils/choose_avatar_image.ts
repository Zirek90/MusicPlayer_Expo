import { AVATAR_IMAGES } from '@constants';

export const chooseAvatarImage = () => {
  return AVATAR_IMAGES[Math.floor(Math.random() * AVATAR_IMAGES.length)];
};
