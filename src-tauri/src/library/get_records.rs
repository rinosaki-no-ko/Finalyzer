use crate::library::data::{Expence, Income, Transfer};
use csv::{Reader, ReaderBuilder};
use std::fs::{File, OpenOptions};
use std::path::PathBuf;
use tauri::Manager;

#[tauri::command]
pub fn get_records(app_handle: tauri::AppHandle) -> Result<Vec<Expence>, String> {
    let mut rdr = match create_reader(app_handle, SaveType::Expence) {
        Ok(rdr) => rdr,
        Err(ReaderErrors::NotExist) => return Ok(Vec::new()),
        Err(ReaderErrors::Other(e)) => return Err(e),
    };

    let mut records = Vec::<Expence>::new();
    for result in rdr.deserialize::<Expence>() {
        let record = match result {
            Ok(record) => record,
            Err(e) => return Err(e.to_string()),
        };
        records.push(record)
    }
    Ok(records)
}

enum SaveType {
    Expence,
    Income,
    Transfer,
}
enum ReaderErrors {
    NotExist,
    Other(String),
}
fn create_reader(
    app_handle: tauri::AppHandle,
    save_type: SaveType,
) -> Result<Reader<File>, ReaderErrors> {
    let app_data_path: PathBuf = match app_handle.path().app_data_dir() {
        Ok(path) => path,
        Err(e) => return Err(ReaderErrors::Other(e.to_string())),
    };

    let target_file = match save_type {
        SaveType::Expence => "expences",
        SaveType::Income => "incomes",
        SaveType::Transfer => "transfers",
    };

    let file_path = app_data_path.join(format!("{target_file}.csv"));

    if !file_path.exists() {
        return Err(ReaderErrors::NotExist);
    }

    let file = match OpenOptions::new().read(true).open(&file_path) {
        Ok(file) => file,
        Err(e) => return Err(ReaderErrors::Other(format!("failed to open file:{}", e))),
    };

    let rdr = ReaderBuilder::new().has_headers(true).from_reader(file);

    Ok(rdr)
}
