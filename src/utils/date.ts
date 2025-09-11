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

const yyyymmddToYearMonthDayDayofweek = (date: number /* YYYYMMDD */) => {
  const year = Math.floor(date / 10000);
  const month = Math.floor(date / 100) % 100;
  const day = date % 100;
  const dateObject = new Date(`${year}-${month}-${day}`);
  const days = ["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat."];
  const dayOfWeek = days[dateObject.getDay()];

  return `${year}.${month}.${day} ${dayOfWeek}`;
};

export { isValidDate, yyyymmddToYearMonthDayDayofweek };
