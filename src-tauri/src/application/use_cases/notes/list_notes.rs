use crate::application::dtos::NoteDto;
use crate::ports::repositories::NoteRepository;

/// Use case for listing notes with filters
pub struct ListNotesUseCase<'a> {
    note_repository: &'a dyn NoteRepository,
}

impl<'a> ListNotesUseCase<'a> {
    pub fn new(note_repository: &'a dyn NoteRepository) -> Self {
        ListNotesUseCase { note_repository }
    }

    pub fn execute(
        &self,
        book_id: Option<i64>,
        search_query: Option<String>,
    ) -> Result<Vec<NoteDto>, String> {
        let notes = if let Some(query) = search_query {
            // Search by content
            self.note_repository.search_by_content(&query)?
        } else if let Some(b_id) = book_id {
            // Filter by book
            self.note_repository.find_by_book_id(b_id)?
        } else {
            // Get all notes
            self.note_repository.find_all()?
        };

        Ok(notes.into_iter().map(NoteDto::from).collect())
    }
}

