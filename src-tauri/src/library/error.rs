use serde::Serialize;
use thiserror::Error;

#[derive(Debug, Serialize, Error)] // Serializeはtauriへ渡すjsonへの変換用。Errorはthiserrorが提供するマクロ
#[serde(tag = "type", content = "message")] //jsonへ変換する際の形式を指定。{"type": "FileIO", "message": "エラー詳細"}といった形式になる
pub enum AppError {
    #[error("Tauri API error: {0}")]
    Tauri(String),

    #[error("Failed to create parent directories: {0}")]
    CreateDir(String),

    #[error("Failed to create/open file: {0}")]
    FileIO(String),

    #[error("Failed to parse JSON data: {0}")]
    JsonParse(String),

    #[error("Failed to write JSON data: {0}")]
    JsonWrite(String),
}

// 以下で既存のエラーをAppErrorに自動変換する静的メソッドを追加！これにより?演算子が使用可能に！！
impl From<std::io::Error> for AppError {
    fn from(error: std::io::Error) -> Self {
        AppError::FileIO(error.to_string())
    }
}

impl From<serde_json::Error> for AppError {
    fn from(error: serde_json::Error) -> Self {
        AppError::JsonParse(error.to_string())
    }
}

impl From<tauri::Error> for AppError {
    fn from(error: tauri::Error) -> Self {
        AppError::Tauri(error.to_string())
    }
}
