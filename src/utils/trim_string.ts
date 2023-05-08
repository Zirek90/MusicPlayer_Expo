export const trimString = (value: string) => {
  const maxLength = 35;
  return value.length > maxLength ? `${value.substring(0, maxLength)} ... ` : value;
};
