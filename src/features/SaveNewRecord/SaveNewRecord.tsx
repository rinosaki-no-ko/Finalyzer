// import { invoke } from "@tauri-apps/api/core";
// import { Income, Expence, Transfer } from "../../utils/dataTypes";
// import { useState } from "react";
import SaveExpence from "./SaveExpence";

// type DataType = "expence" | "income" | "transfer";
// const [commonForm, setCommonForm] = useState();

const SaveNewRecord = () => {
  return (
    <>
      <h2>新規記録</h2>
      <SaveExpence></SaveExpence>
    </>
  );
};
export default SaveNewRecord;
