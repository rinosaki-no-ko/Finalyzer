import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Record,
  IsExpence,
  IsIncome,
  IsTransfer,
} from "../../../utils/dataTypes";
import {
  isValidDate,
  yearMonthDayToYyyymmdd,
  yyyymmddToYearMonthDayDayofweek,
} from "../../../utils/date";

const Form = ({
  record,
  setRecord,
  onSubmit,
  submitButtonText,
}: {
  record: Record;
  setRecord: React.Dispatch<React.SetStateAction<Record>>;
  onSubmit: (record: Record) => void;
  submitButtonText: string;
}) => {
  const [ymdList, setYmdList] = useState(
    yyyymmddToYearMonthDayDayofweek(record.date)
  );

  const changeDate = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const newYmdList = [...ymdList];
    newYmdList[parseInt(ev.currentTarget.dataset.datatypeindex as string)] =
      parseInt(ev.currentTarget.value);
    const [newYear, newMonth, newDay] = newYmdList;
    const newDate = yearMonthDayToYyyymmdd(newYear, newMonth, newDay);
    setRecord({ ...record, date: newDate });
    setYmdList(newYmdList);
  };

  const { register, handleSubmit } = useForm({
    defaultValues: record,
    mode: "onSubmit",
  });

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <p>
          {["year", "month", "day"].map((val, index) => (
            <React.Fragment key={`form-${val}`}>
              <input
                type="number"
                data-datetypeindex={index}
                id={`form-${val}`}
                defaultValue={ymdList[index]}
              />
            </React.Fragment>
          ))}
        </p>

        {Object.entries(record).map(([key, defaultValue]) => {
          if (key === "record_type" || key === "date" || key === "uuid") {
            return;
          }
          return (
            <p key={`form-${key}`}>
              <label htmlFor={key}>{key}</label>
              <input
                id={key}
                type={
                  key === "amount" || key === "commission" ? "number" : "text"
                }
                value={defaultValue}
                onChange={(e) =>
                  setRecord({
                    ...record,
                    [key]:
                      key === "amount" || key === "commission"
                        ? parseInt(e.target.value)
                        : e.target.value,
                  })
                }
                required={true}
              />
            </p>
          );
        })}
        <button type="submit">{submitButtonText}</button>
      </form>
    </>
  );
};
export default Form;
