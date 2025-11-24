use crate::app::dtos::{NoteDto, CreateNoteCommand, UpdateNoteCommand, ListNotesFilters};
use crate::core::domains::note::Note;
use crate::core::interfaces::primary::NoteService;
use crate::core::interfaces::secondary::{NoteRepository, BookRepository};

/// Implementation of NoteService
pub struct NoteServiceImpl<'a> {
    note_repository: &'a dyn NoteRepository,
    book_repository: &'a dyn BookRepository,
}

impl<'a> NoteServiceImpl<'a> {
    pub fn new(
        note_repository: &'a dyn NoteRepository,
        book_repository: &'a dyn BookRepository,
    ) -> Self {
        NoteServiceImpl {
            note_repository,
            book_repository,
        }
    }
}

impl<'a> NoteService for NoteServiceImpl<'a> {
    fn create(&self, command: CreateNoteCommand) -> Result<NoteDto, String> {
        // Validate book exists
        self.book_repository
            .find_by_id(command.book_id)?
            .ok_or_else(|| format!("Book with id {} not found", command.book_id))?;

        // Create note entity with validation
        let mut note = Note::new(command.book_id, command.content)?;

        // Set optional fields
        note.reading_id = command.reading_id;
        note.page = command.page;

        // Save via repository
        self.note_repository.create(&mut note)?;

        // Convert to DTO and return
        Ok(NoteDto::from(note))
    }

    fn update(&self, command: UpdateNoteCommand) -> Result<NoteDto, String> {
        // Get existing note
        let mut note = self.note_repository
            .find_by_id(command.id)?
            .ok_or_else(|| format!("Note with id {} not found", command.id))?;

        // Update fields if provided
        if let Some(content) = command.content {
            if content.trim().is_empty() {
                return Err("Note content cannot be empty".to_string());
            }
            note.content = content;
        }

        // Update page if provided in command
        // Option<Option<i32>> allows us to distinguish:
        // - None = field not provided (don't change)
        // - Some(None) = field provided as null (clear the value)
        // - Some(Some(value)) = field provided with value (set the value)
        match &command.page {
            None => {
                // Field not provided, don't change
                eprintln!("[update_note] page field not provided, keeping existing value: {:?}", note.page);
            }
            Some(page_opt) => {
                eprintln!("[update_note] page field provided: {:?}, current note.page: {:?}, setting to: {:?}", 
                         page_opt, note.page, page_opt);
                note.page = page_opt.clone();
                eprintln!("[update_note] after setting, note.page is now: {:?}", note.page);
            }
        }

        // Update timestamp
        note.updated_at = chrono::Utc::now();

        // Save via repository
        self.note_repository.update(&note)?;

        // Convert to DTO and return
        Ok(NoteDto::from(note))
    }

    fn delete(&self, id: i64) -> Result<(), String> {
        // Check if note exists
        self.note_repository
            .find_by_id(id)?
            .ok_or_else(|| format!("Note with id {} not found", id))?;

        // Delete via repository
        self.note_repository.delete(id)?;

        Ok(())
    }

    fn get(&self, id: i64) -> Result<NoteDto, String> {
        let note = self.note_repository
            .find_by_id(id)?
            .ok_or_else(|| format!("Note with id {} not found", id))?;

        Ok(NoteDto::from(note))
    }

    fn list(&self, filters: ListNotesFilters) -> Result<Vec<NoteDto>, String> {
        let notes = if let Some(b_id) = filters.book_id {
            // Filter by book
            self.note_repository.find_by_book_id(b_id)?
        } else {
            // Get all notes
            self.note_repository.find_all()?
        };

        Ok(notes.into_iter().map(NoteDto::from).collect())
    }
}

