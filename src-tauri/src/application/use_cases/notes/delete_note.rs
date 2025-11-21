use crate::ports::repositories::NoteRepository;

/// Use case for deleting a note
pub struct DeleteNoteUseCase<'a> {
    note_repository: &'a dyn NoteRepository,
}

impl<'a> DeleteNoteUseCase<'a> {
    pub fn new(note_repository: &'a dyn NoteRepository) -> Self {
        DeleteNoteUseCase { note_repository }
    }

    pub fn execute(&self, id: i64) -> Result<(), String> {
        // Check if note exists
        self.note_repository
            .find_by_id(id)?
            .ok_or_else(|| format!("Note with id {} not found", id))?;

        // Delete via repository
        self.note_repository.delete(id)?;

        Ok(())
    }
}

