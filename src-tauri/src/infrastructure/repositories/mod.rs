// Repository implementations (infrastructure/adapters)
// Will contain: sqlite_book_repository, sqlite_session_repository, etc.

pub mod sqlite_book_repository;
pub mod sqlite_session_repository;
pub mod sqlite_note_repository;
pub mod sqlite_goal_repository;
pub mod sqlite_settings_repository;
pub mod sqlite_tag_repository;
pub mod sqlite_collection_repository;

pub use sqlite_book_repository::*;
pub use sqlite_session_repository::*;
pub use sqlite_note_repository::*;
pub use sqlite_goal_repository::*;
pub use sqlite_settings_repository::*;
pub use sqlite_tag_repository::*;
pub use sqlite_collection_repository::*;

