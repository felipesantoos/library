// Main library module

// Domain layer
pub mod domain;

// Ports layer
pub mod ports;

// Application layer  
pub mod application;

// Infrastructure layer
pub mod infrastructure;

// Adapters layer
pub mod adapters;

use infrastructure::database::{DatabaseConnection, Migration};
use adapters::tauri::AppState;
use adapters::tauri::commands::{
    create_book, get_book, list_books, update_book, delete_book,
    create_session, get_session, list_sessions, update_session, delete_session,
    create_note, get_note, list_notes, delete_note,
    create_goal, get_goal, list_goals, delete_goal, get_statistics,
    get_setting, set_setting, get_all_settings,
    create_tag, list_tags, delete_tag, add_tags_to_book, remove_tag_from_book,
    create_collection, list_collections, update_collection, delete_collection,
    add_books_to_collection, remove_book_from_collection,
};

pub fn run() {
    // Initialize database connection
    let db_conn = match initialize_database() {
        Ok(conn) => conn,
        Err(e) => {
            eprintln!("Failed to initialize database: {}", e);
            // Try to create connection anyway - might work without migration
            DatabaseConnection::new().unwrap_or_else(|e| {
                eprintln!("Failed to create database connection: {}", e);
                panic!("Cannot start application without database");
            })
        }
    };

    // Create app state with database connection
    let app_state = AppState::new(db_conn);

    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .manage(app_state)
        .invoke_handler(tauri::generate_handler![
            create_book,
            get_book,
            list_books,
            update_book,
            delete_book,
            create_session,
            get_session,
            list_sessions,
            update_session,
            delete_session,
            create_note,
            get_note,
            list_notes,
            delete_note,
            create_goal,
            get_goal,
            list_goals,
            delete_goal,
            get_statistics,
            get_setting,
            set_setting,
            get_all_settings,
            create_tag,
            list_tags,
            delete_tag,
            add_tags_to_book,
            remove_tag_from_book,
            create_collection,
            list_collections,
            update_collection,
            delete_collection,
            add_books_to_collection,
            remove_book_from_collection,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn initialize_database() -> Result<DatabaseConnection, String> {
    let db_conn = DatabaseConnection::new()?;
    let conn = db_conn.get_connection();
    let locked_conn = conn.lock().map_err(|e| format!("Lock error: {}", e))?;
    
    Migration::run_migrations(&locked_conn)?;
    
    Ok(db_conn)
}
