use crate::application::dtos::NoteDto;
use crate::domain::entities::{NoteType, Sentiment};
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
        note_type: Option<String>,
        sentiment: Option<String>,
        search_query: Option<String>,
    ) -> Result<Vec<NoteDto>, String> {
        let notes = if let Some(query) = search_query {
            // Search by content
            self.note_repository.search_by_content(&query)?
        } else if let Some(b_id) = book_id {
            // Filter by book
            self.note_repository.find_by_book_id(b_id)?
        } else if let Some(type_str) = note_type {
            // Filter by type
            let note_type_enum = match type_str.as_str() {
                "note" => NoteType::Note,
                "highlight" => NoteType::Highlight,
                _ => return Err(format!("Invalid note type: {}", type_str)),
            };
            self.note_repository.find_by_type(note_type_enum)?
        } else if let Some(sentiment_str) = sentiment {
            // Filter by sentiment
            let sentiment_enum = match sentiment_str.as_str() {
                "inspiration" => Sentiment::Inspiration,
                "doubt" => Sentiment::Doubt,
                "reflection" => Sentiment::Reflection,
                "learning" => Sentiment::Learning,
                _ => return Err(format!("Invalid sentiment: {}", sentiment_str)),
            };
            self.note_repository.find_by_sentiment(sentiment_enum)?
        } else {
            // Get all notes
            self.note_repository.find_all()?
        };

        Ok(notes.into_iter().map(NoteDto::from).collect())
    }
}

