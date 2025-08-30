import { invoke } from "@tauri-apps/api/core";
import { Expence } from "../../utils/dataTypes";
import { useEffect, useState } from "react";
import isValidDate from "../../utils/isValidDate";
const SaveExpence = () => {
  /*
   *****************************************************
   *変数宣言
   *****************************************************
   */
  const [form, setForm] = useState({
    date: "",
    category: "",
    amount: 0,
    description: "",
    account: "",
    member: "",
    uuid: crypto.randomUUID(),
  } as Expence);
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
    if (!isDateValid || Object.values(form).includes("") || form.amount <= 0) {
      console.error("invalid input");
      return;
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
      <h2>支出</h2>
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
export default SaveExpence;
