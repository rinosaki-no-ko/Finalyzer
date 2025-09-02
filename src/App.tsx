import { useState, useEffect } from "react";
import "./App.css";
import SaveNewRecords from "./features/SaveNewRecords/SaveNewRecords";
import ViewRecords from "./features/ViewRecords/ViewRecords";
import { invoke } from "@tauri-apps/api/core";

const App = () => {
  const [feature, setFeature] = useState("SaveNewRecords");
  const [appVersion, setAppVersion] = useState("");
  useEffect(() => {
    invoke("get_app_version").then((val) => setAppVersion(val as string));
  }, []);

  const showFeature = () => {
    if (feature === "SaveNewRecords") {
      return <SaveNewRecords></SaveNewRecords>;
    } else if (feature === "ViewRecords") {
      return <ViewRecords></ViewRecords>;
    }
  };
  return (
    <main className="containers">
      <h1>Finalyzer {appVersion}</h1>
      <select
        name=""
        id=""
        defaultValue={"SaveNewRecords"}
        onChange={(ev: React.ChangeEvent<HTMLSelectElement>) => {
          setFeature(ev.currentTarget.value);
        }}
      >
        <option value="SaveNewRecords">新規記録</option>
        <option value="ViewRecords">記録確認</option>
      </select>
      {showFeature()}
    </main>
  );
};

export default App;
