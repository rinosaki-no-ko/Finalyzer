mod library;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            library::save_new_records::save_expence,
            library::save_new_records::save_income,
            library::save_new_records::save_transfer,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
