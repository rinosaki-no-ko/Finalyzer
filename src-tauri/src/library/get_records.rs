use crate::library::data::{Expence, Income, Transfer};
use crate::library::error::AppError;
use csv::{Reader, ReaderBuilder};
use std::fs::{File, OpenOptions};
use std::path::PathBuf;
use tauri::{App, Manager};
#[tauri::command]
pub fn get_expence_records(app_handle: tauri::AppHandle) -> Result<Vec<Expence>, AppError> {
    let mut rdr = match create_reader(app_handle, SaveType::Expence) {
        Ok(rdr) => rdr,
        Err(ReaderErrors::NotExist) => return Ok(Vec::new()),
        Err(ReaderErrors::Other(e)) => return Err(AppError::FileIO(e.to_string())),
    };

    let mut records = Vec::<Expence>::new();
    for result in rdr.deserialize::<Expence>() {
        let record = result.map_err(|e| AppError::CsvParse(e.to_string()))?;
        records.push(record)
    }
    Ok(records)
}

#[tauri::command]
pub fn get_income_records(app_handle: tauri::AppHandle) -> Result<Vec<Income>, AppError> {
    let mut rdr = match create_reader(app_handle, SaveType::Income) {
        Ok(rdr) => rdr,
        Err(ReaderErrors::NotExist) => return Ok(Vec::new()),
        Err(ReaderErrors::Other(e)) => return Err(AppError::FileIO(e.to_string())),
    };

    let mut records = Vec::<Income>::new();
    for result in rdr.deserialize::<Income>() {
        let record = result.map_err(|e| AppError::CsvParse(e.to_string()))?;
        records.push(record)
    }
    Ok(records)
}
#[tauri::command]
pub fn get_transfer_records(app_handle: tauri::AppHandle) -> Result<Vec<Transfer>, AppError> {
    let mut rdr = match create_reader(app_handle, SaveType::Transfer) {
        Ok(rdr) => rdr,
        Err(ReaderErrors::NotExist) => return Ok(Vec::new()),
        Err(ReaderErrors::Other(e)) => return Err(AppError::FileIO(e.to_string())),
    };

    let mut records = Vec::<Transfer>::new();
    for result in rdr.deserialize::<Transfer>() {
        let record = result.map_err(|e| AppError::CsvParse(e.to_string()))?;
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
        Err(e) => return Err(ReaderErrors::Other(e.to_string())),
    };

    let rdr = ReaderBuilder::new().has_headers(true).from_reader(file);

    Ok(rdr)
}
