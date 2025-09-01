import { invoke } from "@tauri-apps/api/core";
import { Expence, Income, Transfer } from "../../utils/dataTypes";
import { useEffect, useState } from "react";
import isValidDate from "../../utils/isValidDate";

type SaveType = "expence" | "income" | "transfer";
const FormForSaveNewRecord = ({ saveType }: { saveType: SaveType }) => {
  /*
   *****************************************************
   *変数宣言
   *****************************************************
   */

  let initForm: Expence | Income | Transfer;
  if (saveType === "expence") {
    initForm = {
      date: "",
      category: "",
      amount: 0,
      description: "",
      account: "",
      member: "",
      uuid: crypto.randomUUID(),
    } as Expence;
  } else if (saveType === "income") {
    initForm = {
      date: "",
      category: "",
      amount: 0,
      description: "",
      account: "",
      member: "",
      uuid: crypto.randomUUID(),
      savetype: saveType,
    } as Income;
  } else {
    initForm = {
      date: "",
      from_account: "",
      to_account: "",
      from_amount: 0,
      to_amount: 0,
      description: "",
      uuid: crypto.randomUUID(),
    } as Transfer;
  }
  const [form, setForm] = useState(initForm);

  useEffect(() => {
    setForm(initForm);
  }, [saveType]);

  const [date, setDate] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  });
  const [isDateValid, setIsDateValid] = useState(true);

  /*
   ****************************************************
   * 処理定義
   ****************************************************
   */

  useEffect(() => {
    setIsDateValid(isValidDate(date));
    setForm({ ...form, date: `${date.year}-${date.month}-${date.day}` });
  }, [date]);

  const save = async () => {
    if (!isDateValid || Object.values(form).includes("")) {
      console.error("invalid input");
      return;
    }
    if ("amount" in form) {
      if (form.amount <= 0) {
        console.error("invalid input");
        return;
      }
    }
    setForm({ ...form, uuid: crypto.randomUUID() }); // uuid付けるのはrustにお願いしていいのでは？
    console.log(await invoke(`save_expence`, { expence: form }));
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
        <p>
          value:{date.year}-{date.month}-{date.day}
        </p>
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
          if (key === "date" || key === "uuid") {
            return;
          }
          return (
            <div key={key}>
              <label htmlFor={key}>{key}</label>
              <input
                id={key}
                type={key === "amount" ? "number" : "text"}
                value={value}
                onChange={(e) =>
                  setForm({
                    ...form,
                    [key]:
                      key === "amount"
                        ? parseInt(e.target.value)
                        : e.target.value,
                  })
                }
                required={true}
              />
            </div>
          );
        })}
      </form>
      <button type="submit" onClick={save}>
        Submit!
      </button>
    </>
  );
};
export default FormForSaveNewRecord;
