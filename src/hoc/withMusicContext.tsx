import { ComponentType, MemoExoticComponent, memo } from 'react';
import { useMusicContext, MusicContextState } from '@context';

export const withMusicContext = <TProps extends unknown, TValue extends unknown>(
  Component: ComponentType<TProps & Record<string, TValue>>,
  selectors: Record<string, (data: MusicContextState) => TValue>,
) => {
  const MemorisedComponent = memo(Component) as MemoExoticComponent<
    ComponentType<Record<string, TValue>>
  >;

  return (props: TProps & Record<string, TValue>) => {
    const data = useMusicContext();
    const contextProps = Object.keys(selectors).reduce((acc: Record<string, TValue>, key) => {
      acc[key] = selectors[key](data);
      return acc;
    }, {});

    return <MemorisedComponent {...props} {...contextProps} />;
  };
};
