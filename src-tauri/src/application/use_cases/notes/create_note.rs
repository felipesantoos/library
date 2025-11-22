use crate::domain::entities::Note;
use crate::application::dtos::{NoteDto, CreateNoteCommand};
use crate::ports::repositories::{NoteRepository, BookRepository};

/// Use case for creating a new note
pub struct CreateNoteUseCase<'a> {
    note_repository: &'a dyn NoteRepository,
    book_repository: &'a dyn BookRepository,
}

impl<'a> CreateNoteUseCase<'a> {
    pub fn new(
        note_repository: &'a dyn NoteRepository,
        book_repository: &'a dyn BookRepository,
    ) -> Self {
        CreateNoteUseCase {
            note_repository,
            book_repository,
        }
    }

    pub fn execute(&self, command: CreateNoteCommand) -> Result<NoteDto, String> {
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
}

