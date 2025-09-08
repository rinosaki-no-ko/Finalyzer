use crate::library::data::{Expence, Income, Transfer};
use csv::{Writer, WriterBuilder};
use std::fs::{File, OpenOptions};
use std::path::PathBuf;
use tauri::Manager;

#[tauri::command]
pub fn save_expence(app_handle: tauri::AppHandle, expence: Expence) -> Result<String, String> {
    let mut wtr = match create_writer(app_handle, SaveType::Expence) {
        Ok(wtr) => wtr,
        Err(e) => return Err(format!("Error occured : {}", e)),
    };

    if let Err(e) = wtr.serialize(expence) {
        return Err(format!("Failed to write to CSV: {}", e));
    }

    if let Err(e) = wtr.flush() {
        return Err(format!("failed to flush writer: {}", e));
    }

    Ok("Expence saved successfully!".to_string())
}

#[tauri::command]
pub fn save_income(app_handle: tauri::AppHandle, income: Income) -> Result<String, String> {
    let mut wtr = match create_writer(app_handle, SaveType::Income) {
        Ok(wtr) => wtr,
        Err(e) => return Err(format!("Error occured : {}", e)),
    };

    if let Err(e) = wtr.serialize(income) {
        return Err(format!("Failed to write to CSV: {}", e));
    }

    if let Err(e) = wtr.flush() {
        return Err(format!("failed to flush writer: {}", e));
    }

    Ok("Income saved successfully!".to_string())
}

#[tauri::command]
pub fn save_transfer(app_handle: tauri::AppHandle, transfer: Transfer) -> Result<String, String> {
    let mut wtr = match create_writer(app_handle, SaveType::Transfer) {
        Ok(wtr) => wtr,
        Err(e) => return Err(format!("Error occured : {}", e)),
    };

    if let Err(e) = wtr.serialize(transfer) {
        return Err(format!("Failed to write to CSV: {}", e));
    }

    if let Err(e) = wtr.flush() {
        return Err(format!("failed to flush writer: {}", e));
    }

    Ok("Transfers saved successfully!".to_string())
}

enum SaveType {
    Expence,
    Income,
    Transfer,
}

fn create_writer(
    app_handle: tauri::AppHandle,
    save_type: SaveType,
) -> Result<Writer<File>, String> {
    // OSに応じてアプリデータを格納する最適なディレクトリを探す。
    let app_data_path: PathBuf = match app_handle.path().app_data_dir() {
        Ok(path) => path,
        Err(e) => return Err(e.to_string()),
    };

    // アプリデータを格納するディレクトリ内のexpences.csvファイルを持ってくる。
    let file_name = match save_type {
        SaveType::Expence => "expences",
        SaveType::Income => "incomes",
        SaveType::Transfer => "transfers",
    };
    let file_path = app_data_path.join(format!("{file_name}.csv"));

    // 初回起動時、アプリデータディレクトリにfinalyzer用のディレクトリを作成する。
    if let Some(parent) = file_path.parent() {
        if let Err(e) = std::fs::create_dir_all(parent) {
            return Err(format!("Failed to create parent directories: {}", e));
        }
    }

    // 新規作成か否かを判定
    let file_exists = file_path.exists();

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

    if !file_exists {
        // 初期化処理
        let header = match save_type {
            SaveType::Expence | SaveType::Income => &[
                "record_type",
                "date",
                "category",
                "amount",
                "description",
                "account",
                "member",
                "uuid",
            ],

            SaveType::Transfer => &[
                "record_type",
                "date",
                "from_account",
                "to_account",
                "amount",
                "commission",
                "description",
                "uuid",
            ],
        };

        if let Err(e) = wtr.write_record(header) {
            return Err(format!("Failed to create new CSV: {}", e));
        }

        if let Err(e) = wtr.flush() {
            return Err(format!("failed to create new CSV: {}", e));
        }
    }

    Ok(wtr)
}
