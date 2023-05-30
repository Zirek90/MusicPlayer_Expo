import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
import * as MediaLibrary from 'expo-media-library';

interface ContextState {
  permissionGranted: boolean;
}

const PermissionContext = createContext<ContextState>({} as ContextState);

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
  return useContext(PermissionContext);
};
