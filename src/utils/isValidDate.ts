const isValidDate = (inputDate: {
  year: number;
  month: number;
  day: number;
}) => {
  const { year, month, day } = inputDate;
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

export default isValidDate;
