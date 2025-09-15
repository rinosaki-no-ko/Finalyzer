import React, { useState } from "react";
import { FieldError, FieldErrors, useForm } from "react-hook-form";
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
  interface dateInfo {
    year: number;
    month: number;
    day: number;
  }
  const [year, month, day] = yyyymmddToYearMonthDayDayofweek(record.date);

  const formFormattedRecord = { year, month, day, ...record };

  // const changeDate = (ev: React.ChangeEvent<HTMLInputElement>) => {
  //   const newYmdList = [...ymdList];
  //   newYmdList[parseInt(ev.currentTarget.dataset.datatypeindex as string)] =
  //     parseInt(ev.currentTarget.value);
  //   const [newYear, newMonth, newDay] = newYmdList;
  //   const newDate = yearMonthDayToYyyymmdd(newYear, newMonth, newDay);
  //   setRecord({ ...record, date: newDate });
  //   setYmdList(newYmdList);
  // };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: formFormattedRecord,
    mode: "onSubmit",
  });
  const commonAttributes = {
    year: {
      type: "number",
      id: "record-form-year",
      defaultValue: formFormattedRecord.year,
      ...register("year", {
        required: true,
        validate: {
          dateCheck: (date) => {
            const [year, month, day] = yyyymmddToYearMonthDayDayofweek(date);
            return isValidDate(year, month, day);
          },
        },
      }),
    },
    month: {
      type: "number",
      id: "record-form-month",
      defaultValue: formFormattedRecord.month,
      ...register("month", {
        required: true,
        validate: {
          dateCheck: (date) => {
            const [year, month, day] = yyyymmddToYearMonthDayDayofweek(date);
            return isValidDate(year, month, day);
          },
        },
      }),
    },
    day: {
      type: "number",
      id: "record-form-day",
      defaultValue: formFormattedRecord.day,
      ...register("day", {
        required: true,
        validate: {
          dateCheck: (date) => {
            const [year, month, day] = yyyymmddToYearMonthDayDayofweek(date);
            return isValidDate(year, month, day);
          },
        },
      }),
    },
  };
  const a = {
    amount: {
      id: "record-form-amount",
      type: "number",
      ...register("amount", {
        required: true,
        valueAsNumber: true,
        min: 0,
      }),
    },
    category: {
      id: "record-form-category",
      type: "text",
      ...register("category", {
        required: true,
      }),
    },
    account: {
      id: "record-form-account",
      type: "text",
      ...register("account", {
        required: true,
      }),
    },
    member: {
      id: "record-form-member",
      type: "text",
      ...register("member", {
        required: true,
      }),
    },
    from_account: {
      // id: "record-form-from-account",
      // type: "text",
      // ...register("from_account", {
      //   required: true,
      // }),
    },
    to_account: {},
    commission: {},
    description: {},
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* <p>
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
        </p> */}
        <input
          type="number"
          disabled={true}
          id="form-expence-date"
          value={record.date}
          {...register("date", {
            required: true,
            validate: {
              dateCheck: (date) => {
                const [year, month, day] =
                  yyyymmddToYearMonthDayDayofweek(date);
                return isValidDate(year, month, day);
              },
            },
          })}
        />
        {record.date}
        {errors.date && <span>This field is required</span>}
        {IsExpence(record) && (
          <>
            <p>
              <label htmlFor="form-expence-date">date</label>
              <input
                id="form-expence-date"
                type="date"
                defaultValue={record.date}
                {...register("date", {
                  required: true,
                  valueAsDate: true,
                })}
              />
            </p>
            <p>
              <label htmlFor="form-expence-amount">amount</label>
              <input
                id="form-expence-amount"
                type="number"
                defaultValue={record.amount}
                {...register("amount", {
                  required: true,
                  valueAsNumber: true,
                  min: 0,
                })}
              />
            </p>
            <p>
              <label htmlFor="form-expence-category">category</label>
              <input
                id="form-expence-category"
                type="text"
                defaultValue={record.category}
                {...register("category", {
                  required: true,
                })}
              />
            </p>
          </>
        )}
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
                // onChange={(e) =>
                //   setRecord({
                //     ...record,
                //     [key]:
                //       key === "amount" || key === "commission"
                //         ? parseInt(e.target.value)
                //         : e.target.value,
                //   })
                // }
                {...register(key as keyof typeof record, {
                  required: "this field is required",
                })}
              />
              {errors[key as keyof typeof record] && (
                <span>This field is required</span>
              )}
            </p>
          );
        })}
        <button type="submit">{submitButtonText}</button>
      </form>
    </>
  );
};
export default Form;
