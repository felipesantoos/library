// Repository traits (ports/interfaces)
// Will contain: book_repository, session_repository, note_repository, etc.

pub mod book_repository;
pub mod session_repository;
pub mod note_repository;
pub mod goal_repository;
pub mod settings_repository;
pub mod tag_repository;
pub mod collection_repository;
pub mod journal_repository;
pub mod agenda_repository;
pub mod reading_repository;
pub mod backup_repository;

pub use book_repository::*;
pub use session_repository::*;
pub use note_repository::*;
pub use goal_repository::*;
pub use settings_repository::*;
pub use tag_repository::*;
pub use collection_repository::*;
pub use journal_repository::*;
pub use agenda_repository::*;
pub use reading_repository::*;
pub use backup_repository::*;

