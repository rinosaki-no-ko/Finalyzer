mod library;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            library::save_new_records::save_expence,
            library::save_new_records::save_income,
            library::save_new_records::save_transfer,
            library::get_records::get_income_records,
            library::get_records::get_expence_records,
            library::get_records::get_transfer_records,
            library::update_records::update_records,
            library::handle_settings::fetch_settings,
            library::utils::get_app_version,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
