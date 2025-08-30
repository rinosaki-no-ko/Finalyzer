use crate::library::data::Expence;
use csv::WriterBuilder;
use std::fs::OpenOptions;
use std::path::PathBuf;
use tauri::Manager;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod library;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn save_expence(app_handle: tauri::AppHandle, expence: Expence) -> Result<String, String> {
    // OSに応じてアプリデータを格納する最適なディレクトリを探す。
    let app_data_path: PathBuf = match app_handle.path().app_data_dir() {
        Ok(path) => path,
        Err(e) => return Err(e.to_string()),
    };

    // アプリデータを格納するディレクトリ内のexpences.csvファイルを持ってくる。
    let file_path = app_data_path.join("expences.csv");

    // 初回起動時、アプリデータディレクトリにfinalyzer用のディレクトリを作成する。
    if let Some(parent) = file_path.parent() {
        if let Err(e) = std::fs::create_dir_all(parent) {
            return Err(format!("Failed to create parent directories: {}", e));
        }
    }

    // ファイルを開いていくよ。
    let file = match OpenOptions::new()
        // .write(true)
        .append(true)
        .create(true)
        .open(&file_path)
    {
        Ok(file) => file,
        Err(e) => return Err(format!("failed to open file:{}", e)),
    };

    let mut wtr = WriterBuilder::new().has_headers(false).from_writer(file);

    if let Err(e) = wtr.serialize(expence) {
        return Err(format!("Failed to write to CSV: {}", e));
    }

    if let Err(e) = wtr.flush() {
        return Err(format!("failed to flush writer: {}", e));
    }

    Ok("Expence saved successfully!".to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, save_expence])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
