import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
import * as MediaLibrary from 'expo-media-library';

interface PermissionContextState {
  permissionGranted: boolean;
}

const PermissionContext = createContext<PermissionContextState>({ permissionGranted: false });

export const PermissionContextProvider = ({ children }: PropsWithChildren) => {
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    const getPermission = async () => {
      const permission = await MediaLibrary.requestPermissionsAsync();
      setPermissionGranted(permission.granted);
    };
    getPermission();
  }, []);

  return (
    <PermissionContext.Provider value={{ permissionGranted }}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissionContext = () => {
  const state = useContext(PermissionContext);
  if (state === undefined) {
    throw new Error('Attempt to access from outside of context');
  }
  return state;
};
