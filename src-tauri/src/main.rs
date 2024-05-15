// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    tauri::Builder::default()
        .manage(AppState {
            string_ring: Mutex::new(StringRing::new()),
        })
        .invoke_handler(tauri::generate_handler![greet, insert_data])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
//////////

use std::sync::Mutex;

struct AppState {
    string_ring: Mutex<StringRing>,
}

//////////////////////////
mod utils;
use utils::{str_to_image, StringRing};
#[tauri::command]
fn insert_data(
    data: &str,
    width: i32,
    height: i32,
    num_nails: i32,
    opacity: f64,
    state: tauri::State<AppState>,
) {
    assert_eq!(width, height);
    assert!(num_nails > 0);
    assert!(opacity >= 0.0 && opacity <= 1.0);
    let image = str_to_image(data, width, height);
    let mut stringring = state.string_ring.lock().unwrap();
    stringring.set_parameters(width / 2, height / 2, width / 2, num_nails, image, opacity);
}
