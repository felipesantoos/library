use crate::application::dtos::{NoteDto, UpdateNoteCommand};
use crate::ports::repositories::NoteRepository;

/// Use case for updating an existing note
pub struct UpdateNoteUseCase<'a> {
    note_repository: &'a dyn NoteRepository,
}

impl<'a> UpdateNoteUseCase<'a> {
    pub fn new(note_repository: &'a dyn NoteRepository) -> Self {
        UpdateNoteUseCase { note_repository }
    }

    pub fn execute(&self, command: UpdateNoteCommand) -> Result<NoteDto, String> {
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
}

