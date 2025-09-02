import { useState, useEffect } from "react";
import "./App.css";
import SaveNewRecords from "./features/SaveNewRecords/SaveNewRecords";
import { invoke } from "@tauri-apps/api/core";

const App = () => {
  const [feature, setFeature] = useState("SaveNewRecord");
  const [appVersion, setAppVersion] = useState("");
  useEffect(() => {
    invoke("get_app_version").then((val) => setAppVersion(val as string));
  }, []);

  const showFeature = () => {
    if (feature === "SaveNewRecord") {
      return <SaveNewRecords></SaveNewRecords>;
    }
  };
  return (
    <main className="container">
      <h1>Finalyzer {appVersion}</h1>
      <select
        name=""
        id=""
        defaultValue={"SaveNewRecord"}
        onChange={(ev: React.ChangeEvent<HTMLSelectElement>) => {
          setFeature(ev.currentTarget.value);
        }}
      >
        <option value="SaveNewRecord">新規記録</option>
        <option value="ViewRecord">記録確認</option>
      </select>
      {showFeature()}
    </main>
  );
};

export default App;
