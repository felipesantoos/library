use crate::application::dtos::NoteDto;
use crate::ports::repositories::NoteRepository;

/// Use case for getting a note by ID
pub struct GetNoteUseCase<'a> {
    note_repository: &'a dyn NoteRepository,
}

impl<'a> GetNoteUseCase<'a> {
    pub fn new(note_repository: &'a dyn NoteRepository) -> Self {
        GetNoteUseCase { note_repository }
    }

    pub fn execute(&self, id: i64) -> Result<NoteDto, String> {
        let note = self.note_repository
            .find_by_id(id)?
            .ok_or_else(|| format!("Note with id {} not found", id))?;

        Ok(NoteDto::from(note))
    }
}

