export const trimString = (value: string) => {
  const maxLength = 20;
  return value.length > maxLength ? `${value.substring(0, maxLength)} ... ` : value;
};
