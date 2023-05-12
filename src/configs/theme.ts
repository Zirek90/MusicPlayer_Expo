import { extendTheme } from 'native-base';
import { COLORS } from '@global';

export const ThemeConfig = extendTheme({
  components: {
    Text: {
      baseStyle: () => {
        return {
          color: COLORS.white,
        };
      },
    },
    Heading: {
      baseStyle: () => {
        return {
          color: COLORS.white,
        };
      },
    },
  },
});
