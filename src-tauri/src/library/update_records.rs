use std::{
    fs::{File, OpenOptions},
    path::PathBuf,
};

use crate::library::data::{Expence, HasCommonField, Income, Record, Transfer};
use csv::{ReaderBuilder, WriterBuilder};
use serde::{Deserialize, Serialize};
use tauri::Manager;

#[derive(Debug, Deserialize)]
pub enum UpdateAction {
    Update(Record),
    Delete(Record),
}

#[tauri::command]
pub fn update_records(
    app_handle: tauri::AppHandle,
    update_action: UpdateAction,
) -> Result<(), String> {
    match update_action {
        UpdateAction::Update(new_record) => process_update(app_handle, new_record),
        UpdateAction::Delete(target_record) => process_delete(app_handle, target_record),
    }
}

fn process_update(app_handle: tauri::AppHandle, record: Record) -> Result<(), String> {
    match record {
        Record::Expence(exp_record) => {
            let (file_name, new_record) = ("expences", exp_record);
            let file_path = get_file_path(app_handle, file_name)?;

            let file = match OpenOptions::new().read(true).open(&file_path) {
                Ok(file) => file,
                Err(e) => return Err(format!("failed to open file:{}", e)),
            };

            let current_records = deserialize_current_csv::<Expence>(file)?;
            let updated_records = create_updated_records::<Expence>(current_records, new_record)?;

            write_updated_records::<Expence>(&file_path, updated_records)?;
            Ok(())
        }
        Record::Income(inc_record) => {
            let (file_name, new_record) = ("incomes", inc_record);
            let file_path = get_file_path(app_handle, file_name)?;

            let file = match OpenOptions::new().read(true).open(&file_path) {
                Ok(file) => file,
                Err(e) => return Err(format!("failed to open file:{}", e)),
            };

            let current_records = deserialize_current_csv::<Income>(file)?;
            let updated_records = create_updated_records::<Income>(current_records, new_record)?;

            write_updated_records::<Income>(&file_path, updated_records)?;
            Ok(())
        }
        Record::Transfer(trf_record) => {
            let (file_name, new_record) = ("transfers", trf_record);
            let file_path = get_file_path(app_handle, file_name)?;

            let file = match OpenOptions::new().read(true).open(&file_path) {
                Ok(file) => file,
                Err(e) => return Err(format!("failed to open file:{}", e)),
            };

            let current_records = deserialize_current_csv::<Transfer>(file)?;
            let updated_records = create_updated_records::<Transfer>(current_records, new_record)?;

            write_updated_records::<Transfer>(&file_path, updated_records)?;
            Ok(())
        }
    }
}

fn process_delete(app_handle: tauri::AppHandle, record: Record) -> Result<(), String> {
    match record {
        Record::Expence(exp_record) => {
            let (file_name, new_record) = ("expences", exp_record);
            let file_path = get_file_path(app_handle, file_name)?;

            let file = match OpenOptions::new().read(true).open(&file_path) {
                Ok(file) => file,
                Err(e) => return Err(format!("failed to open file:{}", e)),
            };

            let current_records = deserialize_current_csv::<Expence>(file)?;
            let updated_records = create_deleted_records::<Expence>(current_records, new_record)?;

            write_updated_records::<Expence>(&file_path, updated_records)?;
            Ok(())
        }
        Record::Income(inc_record) => {
            let (file_name, new_record) = ("incomes", inc_record);
            let file_path = get_file_path(app_handle, file_name)?;

            let file = match OpenOptions::new().read(true).open(&file_path) {
                Ok(file) => file,
                Err(e) => return Err(format!("failed to open file:{}", e)),
            };

            let current_records = deserialize_current_csv::<Income>(file)?;
            let updated_records = create_deleted_records::<Income>(current_records, new_record)?;

            write_updated_records::<Income>(&file_path, updated_records)?;
            Ok(())
        }
        Record::Transfer(trf_record) => {
            let (file_name, new_record) = ("transfers", trf_record);
            let file_path = get_file_path(app_handle, file_name)?;

            let file = match OpenOptions::new().read(true).open(&file_path) {
                Ok(file) => file,
                Err(e) => return Err(format!("failed to open file:{}", e)),
            };

            let current_records = deserialize_current_csv::<Transfer>(file)?;
            let updated_records = create_deleted_records::<Transfer>(current_records, new_record)?;

            write_updated_records::<Transfer>(&file_path, updated_records)?;
            Ok(())
        }
    }
}

fn get_file_path(app_handle: tauri::AppHandle, file_name: &str) -> Result<PathBuf, String> {
    let app_data_path: PathBuf = match app_handle.path().app_data_dir() {
        Ok(path) => path,
        Err(e) => return Err(e.to_string()),
    };

    let file_path = app_data_path.join(format!("{}.csv", file_name));

    Ok(file_path)
}

fn deserialize_current_csv<T>(file: File) -> Result<Vec<T>, String>
where
    T: for<'de> Deserialize<'de> + Serialize + HasCommonField + std::fmt::Debug + Clone,
{
    let mut reader = ReaderBuilder::new().has_headers(true).from_reader(&file);

    let mut records = Vec::<T>::new();

    for record in reader.deserialize::<T>() {
        let record = match record {
            Ok(record) => record,
            Err(e) => return Err(format!("failed to deserialize CSV :{}", e)),
        };
        records.push(record)
    }

    Ok(records)
}

fn create_updated_records<T>(mut records: Vec<T>, new_record: T) -> Result<Vec<T>, String>
where
    T: for<'de> Deserialize<'de> + Serialize + HasCommonField + std::fmt::Debug + Clone,
{
    let mut found = false;
    for record in records.iter_mut() {
        if record.get_uuid() == new_record.get_uuid() {
            *record = new_record.clone();
            found = true;
            break;
        }
    }

    if !found {
        return Err(format!(
            "record with uuid {} not found",
            new_record.get_uuid()
        ));
    }
    Ok(records)
}
fn create_deleted_records<T>(mut records: Vec<T>, new_record: T) -> Result<Vec<T>, String>
where
    T: for<'de> Deserialize<'de> + Serialize + HasCommonField + std::fmt::Debug + Clone,
{
    let initial_len = records.len();

    records.retain(|record| record.get_uuid() != new_record.get_uuid());

    if initial_len == records.len() {
        return Err(format!(
            "Record with UUID {} not found",
            new_record.get_uuid()
        ));
    }

    Ok(records)
}

fn write_updated_records<T>(file_path: &PathBuf, updated_records: Vec<T>) -> Result<(), String>
where
    T: for<'de> Deserialize<'de> + Serialize + HasCommonField + std::fmt::Debug + Clone,
{
    let file = match OpenOptions::new()
        .write(true)
        .truncate(true) // 既存ファイルを破棄、空ファイルにする
        .open(file_path)
    {
        Ok(file) => file,
        Err(e) => return Err(format!("Failed to open file for writing: {}", e)),
    };

    let mut writer = WriterBuilder::new().from_writer(file);

    // ここでヘッダーが自動的に書き込まれる
    for record in updated_records.iter() {
        writer
            .serialize(record)
            .map_err(|e| format!("Failed to serialize record: {}", e))?;
    }
    writer
        .flush()
        .map_err(|e| format!("Failed to flush writer: {}", e))?;
    Ok(())
}
