import { useState } from "react";
import FormForSaveNewRecords from "./FormForSaveNewRecords";
import { HandleOverlay } from "../dataType";

type SaveType = "expence" | "income" | "transfer";
const SaveNewRecords = ({
  handleOverlay,
}: {
  handleOverlay: HandleOverlay;
}) => {
  const [saveType, setSaveType]: [
    SaveType,
    React.Dispatch<React.SetStateAction<SaveType>>
  ] = useState("expence") as [
    SaveType,
    React.Dispatch<React.SetStateAction<SaveType>>
  ];

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
      <FormForSaveNewRecords saveType={saveType}></FormForSaveNewRecords>
    </>
  );
};

export default SaveNewRecords;
