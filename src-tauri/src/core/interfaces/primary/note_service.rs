use crate::app::dtos::note_dto::{NoteDto, CreateNoteCommand, UpdateNoteCommand, ListNotesFilters};

/// Primary interface for note service operations
pub trait NoteService: Send + Sync {
    fn create(&self, command: CreateNoteCommand) -> Result<NoteDto, String>;
    fn update(&self, command: UpdateNoteCommand) -> Result<NoteDto, String>;
    fn delete(&self, id: i64) -> Result<(), String>;
    fn get(&self, id: i64) -> Result<NoteDto, String>;
    fn list(&self, filters: ListNotesFilters) -> Result<Vec<NoteDto>, String>;
}

