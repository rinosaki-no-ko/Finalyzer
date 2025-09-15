use crate::library::data::{Expence, Income, Transfer};
use crate::library::error::AppError;
use csv::{Writer, WriterBuilder};
use std::fs::{File, OpenOptions};
use std::path::PathBuf;
use tauri::{App, Manager};

#[tauri::command]
pub fn save_expence(app_handle: tauri::AppHandle, expence: Expence) -> Result<(), AppError> {
    let mut wtr = create_writer(app_handle, SaveType::Expence)?;

    wtr.serialize(expence)
        .map_err(|e| AppError::CsvWrite(e.to_string()))?;

    wtr.flush().map_err(|e| AppError::CsvWrite(e.to_string()))?;

    Ok(())
}

#[tauri::command]
pub fn save_income(app_handle: tauri::AppHandle, income: Income) -> Result<(), AppError> {
    let mut wtr = create_writer(app_handle, SaveType::Income)?;

    wtr.serialize(income)
        .map_err(|e| AppError::CsvWrite(e.to_string()))?;

    wtr.flush().map_err(|e| AppError::CsvWrite(e.to_string()))?;

    Ok(())
}

#[tauri::command]
pub fn save_transfer(app_handle: tauri::AppHandle, transfer: Transfer) -> Result<(), AppError> {
    let mut wtr = create_writer(app_handle, SaveType::Transfer)?;

    wtr.serialize(transfer)
        .map_err(|e| AppError::CsvWrite(e.to_string()))?;

    wtr.flush().map_err(|e| AppError::CsvWrite(e.to_string()))?;

    Ok(())
}

enum SaveType {
    Expence,
    Income,
    Transfer,
}

fn create_writer(
    app_handle: tauri::AppHandle,
    save_type: SaveType,
) -> Result<Writer<File>, AppError> {
    // OSに応じてアプリデータを格納する最適なディレクトリを探す。
    let app_data_path: PathBuf = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| AppError::Tauri(e.to_string()))?; /*finalyzerディレクトリがなければ作成する。あれば何もしない。冪等性（べきとうせい）のある操作*/

    // アプリデータを格納するディレクトリ内のexpences.csvファイルを持ってくる。
    let file_name = match save_type {
        SaveType::Expence => "expences",
        SaveType::Income => "incomes",
        SaveType::Transfer => "transfers",
    };
    let file_path = app_data_path.join(format!("{file_name}.csv"));

    // 初回起動時、アプリデータディレクトリにfinalyzer用のディレクトリを作成する。
    if let Some(parent) = file_path.parent() {
        std::fs::create_dir_all(parent).map_err(|e| AppError::CreateDir(e.to_string()))?
    }

    // 新規作成か否かを判定
    let file_exists = file_path.exists();

    // ファイルを開いていくよ。
    let file = OpenOptions::new()
        // .write(true)
        .append(true)
        .create(true)
        .open(&file_path)
        .map_err(|e| AppError::FileIO(e.to_string()))?;

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

        wtr.write_record(header)
            .map_err(|e| AppError::CsvWrite(e.to_string()))?;

        wtr.flush().map_err(|e| AppError::CsvWrite(e.to_string()))?;
    }

    Ok(wtr)
}
