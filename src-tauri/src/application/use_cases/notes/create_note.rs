use crate::domain::entities::{Note, NoteType};
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

        // Parse note type
        let note_type = match command.note_type.as_str() {
            "note" => NoteType::Note,
            "highlight" => NoteType::Highlight,
            _ => return Err(format!("Invalid note type: {}", command.note_type)),
        };

        // Create note entity with validation
        let mut note = if note_type == NoteType::Highlight {
            // For highlights, excerpt is required
            let excerpt = command.excerpt.ok_or("Highlight excerpt is required")?;
            Note::new_highlight(command.book_id, excerpt, command.content)?
        } else {
            Note::new(command.book_id, note_type, command.content)?
        };

        // Set optional fields
        note.reading_id = command.reading_id;
        note.page = command.page;
        
        if let Some(sentiment_str) = command.sentiment {
            note.sentiment = Some(string_to_sentiment(&sentiment_str)?);
        }

        // Save via repository
        self.note_repository.create(&mut note)?;

        // Convert to DTO and return
        Ok(NoteDto::from(note))
    }
}

fn string_to_sentiment(s: &str) -> Result<crate::domain::entities::Sentiment, String> {
    use crate::domain::entities::Sentiment;
    match s {
        "inspiration" => Ok(Sentiment::Inspiration),
        "doubt" => Ok(Sentiment::Doubt),
        "reflection" => Ok(Sentiment::Reflection),
        "learning" => Ok(Sentiment::Learning),
        _ => Err(format!("Invalid sentiment: {}", s)),
    }
}

