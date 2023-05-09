export const trimString = (value: string) => {
  const maxLength = 25;
  return value.length > maxLength ? `${value.substring(0, maxLength)} ... ` : value;
};
