import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

const SettingsPage = () => {
  const [appVersion, setAppVersion] = useState("");
  useEffect(() => {
    invoke("get_app_version").then((val) => setAppVersion(val as string));
  }, []);
  return (
    <div className="page-container settings-container">
      <h1>Settings</h1>
      <p>Finalyzer {appVersion}</p>
    </div>
  );
};
export default SettingsPage;
