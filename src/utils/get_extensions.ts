export const getExtension = (filename: string) => {
  return filename.substring(filename.lastIndexOf('.') + 1);
};
