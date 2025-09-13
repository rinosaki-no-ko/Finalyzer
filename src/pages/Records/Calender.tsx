import { useEffect, useState } from "react";
import { createCalenderList } from "../../utils/date";

const Calender = () => {
  const today = new Date();
  const [[year, month], setYearAndMonth] = useState([
    today.getFullYear(),
    today.getMonth(),
  ]);

  const [calenderList, setCalenderList] = useState(
    createCalenderList(year, month)
  );

  const handleCalender = (step: number) => {
    const newDate = new Date(year, month + step, 1);
    setYearAndMonth([newDate.getFullYear(), newDate.getMonth()]);
  };

  useEffect(() => {
    setCalenderList(createCalenderList(year, month));
  }, [year, month]);

  return (
    <div className="calender-container">
      <p>
        {year}.{month + 1}
      </p>
      <button
        type="button"
        onClick={() => {
          handleCalender(-1);
        }}
      >
        last month
      </button>
      <button
        type="button"
        onClick={() => {
          handleCalender(1);
        }}
      >
        next month
      </button>
      <table>
        <thead>
          <tr>
            {["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat."].map(
              (day) => (
                <th key={day}>{day}</th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {calenderList.map((week) => (
            <tr key={crypto.randomUUID()}>
              {week.map((day) => (
                <td key={crypto.randomUUID()}>{day === 0 || day}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default Calender;
