import { useEffect, useState } from "react";
import React from "react";
import { invoke } from "@tauri-apps/api/core";
import { AppSettings } from "../../utils/dataTypes";

const SettingsPage = () => {
  const [appVersion, setAppVersion] = useState("");
  const [appSettings, setAppSettings] = useState({} as AppSettings);
  useEffect(() => {
    invoke("get_app_version").then((val) => setAppVersion(val as string));
    invoke("fetch_settings").then((val) => setAppSettings(val as AppSettings));
  }, []);
  return (
    <div className="page-container settings-container">
      <h1>Settings</h1>
      <p>Finalyzer {appVersion}</p>
      {Object.entries(appSettings).map(([key, val]) => (
        <React.Fragment key={key}>
          <p>
            {key}: {val}
          </p>
        </React.Fragment>
      ))}
    </div>
  );
};
export default SettingsPage;
