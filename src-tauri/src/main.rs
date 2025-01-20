// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::path::PathBuf;
use std::process::Command;
use tauri::Manager;

#[tauri::command]
fn show_in_folder(path: String) {
    let path_buf = PathBuf::from(path);

    #[cfg(target_os = "windows")]
    {
        Command::new("explorer")
            .args(["/select,", path_buf.to_str().unwrap()])
            .spawn()
            .expect("Failed to open folder in Explorer");
    }

    #[cfg(target_os = "macos")]
    {
        Command::new("open")
            .args(["-R", path_buf.to_str().unwrap()])
            .spawn()
            .expect("Failed to open folder in Finder");
    }

    #[cfg(target_os = "linux")]
    {
        Command::new("xdg-open")
            .arg(path_buf.parent().unwrap())
            .spawn()
            .expect("Failed to open folder in file manager");
    }
}

#[tauri::command]
fn clear_cache(app: tauri::AppHandle) -> Result<(), String> {
    tauri::async_runtime::block_on(async {
        use std::fs;
        let temp_dir = app
            .path()
            .app_cache_dir()
            .expect("Failed to get cache directory");

        for entry in fs::read_dir(temp_dir).map_err(|e| e.to_string())? {
            let entry = entry.map_err(|e| e.to_string())?;
            if entry.file_name().to_string_lossy().contains("question-") {
                fs::remove_file(entry.path()).map_err(|e| e.to_string())?;
            }
        }
        println!("Cache cleared successfully.");
        Ok(())
    })
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![show_in_folder, clear_cache])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
