import { invoke } from "@tauri-apps/api/core";
import { Expence, Income, Transfer } from "../../../utils/dataTypes";
import { useEffect, useState } from "react";
import { isValidDate } from "../../../utils/date";
import { Record } from "../../../utils/dataTypes";

type SaveType = "expence" | "income" | "transfer";
const FormForSaveNewRecords = ({ saveType }: { saveType: SaveType }) => {
  /*
   *****************************************************
   *変数宣言
   *****************************************************
   */

  const [date, setDate] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  });
  const [isDateValid, setIsDateValid] = useState(true);

  let initForm: Record;
  if (saveType === "expence") {
    initForm = {
      record_type: "expence",
      date: date.year * 10000 + date.month * 100 + date.day,
      category: "",
      amount: 0,
      description: "",
      account: "",
      member: "",
      uuid: "X",
    } as Expence;
  } else if (saveType === "income") {
    initForm = {
      record_type: "income",
      date: date.year * 10000 + date.month * 100 + date.day,
      category: "",
      amount: 0,
      description: "",
      account: "",
      member: "",
      uuid: "X",
    } as Income;
  } else {
    initForm = {
      record_type: "transfer",
      date: date.year * 10000 + date.month * 100 + date.day,
      from_account: "",
      to_account: "",
      amount: 0,
      commission: 0,
      description: "",
      uuid: "X",
    } as Transfer;
  }
  const [form, setForm] = useState(initForm);

  useEffect(() => {
    setForm(initForm);
  }, [saveType]);

  useEffect(() => {
    setIsDateValid(isValidDate(date.year, date.month, date.year));
    setForm({
      ...form,
      date: date.year * 10000 + date.month * 100 + date.day,
    });
  }, [date]);
  /*
   ****************************************************
   * 処理定義
   ****************************************************
   */

  const save = async () => {
    if (Object.values(form).includes("")) {
      Object.entries(form)
        .filter(([_key, val]) => val === "")
        .map(([key, val]) => console.error(`invalid input ${key}:${val}`));

      return;
    }
    if (!isDateValid) {
      console.error("invalid date type");
      return;
    }
    if ("amount" in form) {
      if (form.amount <= 0) {
        console.error("invalid input :amount must be a positive integer ");
        return;
      }
    }

    try {
      let message = await invoke(`save_${saveType}`, {
        [saveType]: { ...form, uuid: crypto.randomUUID() },
      });
      console.log(message);
      setForm(initForm);
    } catch (e) {
      console.error(e);
    }
  };

  const createDateForm = () => {
    const chanveDate = (ev: React.ChangeEvent<HTMLInputElement>) => {
      const inputDate = {
        ...date,
        [ev.currentTarget.id]: parseInt(ev.currentTarget.value),
      };
      setDate(inputDate);
    };
    return (
      <div>
        <label htmlFor="year">
          <input
            type="number"
            id="year"
            value={date.year}
            onChange={chanveDate}
          />
        </label>
        <label htmlFor="month">
          <input
            type="number"
            id="month"
            value={date.month}
            onChange={chanveDate}
          />
        </label>
        <label htmlFor="day">
          <input
            type="number"
            id="day"
            value={date.day}
            onChange={chanveDate}
          />
        </label>
        <p>value:{date.year * 10000 + date.month * 100 + date.day}</p>
        <p>{String(isDateValid)}</p>
        {isDateValid || <p>無効な日付です</p>}
      </div>
    );
  };

  /*
   ****************************************************
   * コンポーネント本体
   ****************************************************
   */
  return (
    <>
      <h2>{saveType}</h2>
      <form>
        {createDateForm()}
        {Object.entries(form).map(([key, value]) => {
          if (key === "record_type" || key === "date" || key === "uuid") {
            return;
          }
          return (
            <div key={key}>
              <label htmlFor={key}>{key}</label>
              <input
                id={key}
                type={
                  key === "amount" || key === "commission" ? "number" : "text"
                }
                value={value}
                onChange={(e) =>
                  setForm({
                    ...form,
                    [key]:
                      key === "amount" || key === "commission"
                        ? parseInt(e.target.value)
                        : e.target.value,
                  })
                }
                required={true}
              />
            </div>
          );
        })}{" "}
        <button type="button" onClick={save}>
          Submit!
        </button>
      </form>
    </>
  );
};
export default FormForSaveNewRecords;
