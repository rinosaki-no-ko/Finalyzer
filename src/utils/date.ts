const isValidDate = (year: number, month: number, day: number) => {
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
  const dayOfWeek = dateObject.getDay();

  return [year, month, day, dayOfWeek];
};
const yearMonthDayToYyyymmdd = (year: number, month: number, day: number) =>
  year * 10000 + month * 100 + day;

const getDaysInMonth = (year: number, month: number) => {
  const date = new Date(year, month + 1, 0); // 翌月1日の前日の日付
  return date.getDate();
};

const createCalenderList = (year: number, month: number) => {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const calenderList: number[][] = [];
  calenderList.push(new Array(7).fill(0));
  let [weekIndex, dayIndex] = [0, firstDayOfWeek];
  for (let i = 1; i <= daysInMonth; i++) {
    if (i != 1 && dayIndex === 0) {
      calenderList.push(new Array(7).fill(0));
      weekIndex++;
    }
    calenderList[weekIndex][dayIndex] = i;
    dayIndex === 6 ? (dayIndex = 0) : dayIndex++;
  }

  return calenderList;
};

export {
  isValidDate,
  yyyymmddToYearMonthDayDayofweek,
  yearMonthDayToYyyymmdd,
  getDaysInMonth,
  createCalenderList,
};
