use crate::library::error::AppError;
use serde::{Deserialize, Serialize};
use serde_json;
use std::{
    fs::File,
    io::{BufReader, BufWriter},
    path::PathBuf,
};
use tauri::Manager;

const DEFAULT_SETTINGS_JSON: &str = include_str!("../default-settings.json");

#[tauri::command]
pub fn fetch_settings(app_handle: tauri::AppHandle) -> Result<AppSettings, AppError> {
    let app_data_path: PathBuf = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| AppError::FileIO(e.to_string()))?;
    let file_path = app_data_path.join("settings.json");

    if let Some(parent) = file_path.parent() {
        std::fs::create_dir_all(parent).map_err(|e| AppError::CreateDir(e.to_string()))?
    };

    if file_path.exists() {
        let file = File::open(&file_path).map_err(|e| AppError::FileIO(e.to_string()))?;

        let rdr = BufReader::new(file);

        let settings: AppSettings =
            serde_json::from_reader(rdr).map_err(|e| AppError::JsonParse(e.to_string()))?;

        Ok(settings)
    } else {
        let default_settings: AppSettings = serde_json::from_str(DEFAULT_SETTINGS_JSON)
            .map_err(|e| AppError::JsonParse(e.to_string()))?;

        let file = File::create(&file_path).map_err(|e| AppError::FileIO(e.to_string()))?;

        let wtr = BufWriter::new(file);

        serde_json::to_writer_pretty(wtr, &default_settings)
            .map_err(|e| AppError::JsonWrite(e.to_string()))?;

        Ok(default_settings)
    }
}

#[derive(Serialize, Deserialize)]
pub struct AppSettings {
    pub categories: Vec<String>,
    pub accounts: Vec<String>,
    pub members: Vec<String>,
}
