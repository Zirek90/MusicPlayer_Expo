export const getDirectory = (filename: string) => {
  const path = filename.substring(0, filename.lastIndexOf('/'));
  const directoryName = path.substring(path.lastIndexOf('/') + 1);
  return directoryName;
};
