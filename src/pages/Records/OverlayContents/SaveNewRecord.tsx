import Form from "./Form";
import { useEffect, useState } from "react";
import { Record, Expence, Income, Transfer } from "../../../utils/dataTypes";
import { yearMonthDayToYyyymmdd } from "../../../utils/date";
import { invoke } from "@tauri-apps/api/core";
import { HandleOverlay } from "../dataType";

type SaveType = "expence" | "income" | "transfer";
const FormField = ({ saveType }: { saveType: SaveType }) => {
  const initCommonRecord = {
    date: yearMonthDayToYyyymmdd(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      new Date().getDate()
    ),
    amount: 0,
    description: "",
    uuid: "X",
  };
  let initUniqueRecord;
  if (saveType === "expence") {
    initUniqueRecord = {
      record_type: "expence",
      category: "",
      account: "",
      member: "",
    };
  } else if (saveType === "income") {
    initUniqueRecord = {
      record_type: "income",
      category: "",
      account: "",
      member: "",
    };
  } else {
    initUniqueRecord = {
      record_type: "transfer",
      from_account: "",
      to_account: "",
      commission: 0,
    };
  }
  const [record, setRecord] = useState<Record>({
    ...initCommonRecord,
    ...initUniqueRecord,
  });

  useEffect(() => {
    setRecord({
      ...initCommonRecord,
      ...initUniqueRecord,
    });
  }, [saveType]);

  const handleSave = async () => {
    try {
      let message = await invoke(`save_${saveType}`, {
        [saveType]: { ...record, uuid: crypto.randomUUID() },
      });
      console.log(message);
      setRecord({
        ...initCommonRecord,
        ...initUniqueRecord,
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <h1></h1>
      <Form
        record={record}
        setRecord={setRecord}
        onSubmit={handleSave}
        submitButtonText="Save"
      ></Form>
    </>
  );
};
const SaveNewRecords = ({
  handleOverlay,
}: {
  handleOverlay: HandleOverlay;
}) => {
  const [saveType, setSaveType] = useState<SaveType>("expence");

  const changeType = (ev: React.ChangeEvent<HTMLSelectElement>) => {
    setSaveType(ev.currentTarget.value as SaveType);
  };
  return (
    <>
      <h2>新規記録 保存形式：{saveType}</h2>
      <button
        type="button"
        onClick={() => {
          handleOverlay("close");
        }}
      >
        cancel
      </button>
      <select name="" id="" onChange={changeType} defaultValue={"expence"}>
        <option value="expence">出費</option>
        <option value="income">収入</option>
        <option value="transfer">振替</option>
      </select>
      <FormField saveType={saveType} />
    </>
  );
};
export default SaveNewRecords;
