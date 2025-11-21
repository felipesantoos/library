use crate::ports::repositories::{BookRepository, NoteRepository};
use crate::domain::entities::{Book, Note, NoteType};

/// Use case for generating automatic book summary from notes and highlights
pub struct GenerateBookSummaryUseCase<'a> {
    book_repository: &'a dyn BookRepository,
    note_repository: &'a dyn NoteRepository,
}

#[derive(Debug, Clone)]
pub struct BookSummary {
    pub book_id: i64,
    pub book_title: String,
    pub book_author: Option<String>,
    pub total_notes: usize,
    pub total_highlights: usize,
    pub notes_summary: String,
    pub highlights_text: Vec<String>,
    pub key_themes: Vec<String>, // Extracted themes (simple keyword extraction for now)
    pub generated_at: chrono::DateTime<chrono::Utc>,
}

impl<'a> GenerateBookSummaryUseCase<'a> {
    pub fn new(
        book_repository: &'a dyn BookRepository,
        note_repository: &'a dyn NoteRepository,
    ) -> Self {
        GenerateBookSummaryUseCase {
            book_repository,
            note_repository,
        }
    }

    pub fn execute(&self, book_id: i64) -> Result<BookSummary, String> {
        // Get book
        let book = self.book_repository
            .find_by_id(book_id)?
            .ok_or_else(|| format!("Book with id {} not found", book_id))?;

        // Get all notes for the book
        let notes = self.note_repository.find_by_book_id(book_id)?;

        // Separate notes and highlights
        let (notes_list, highlights_list): (Vec<_>, Vec<_>) = notes
            .into_iter()
            .partition(|note| note.note_type == NoteType::Note);

        // Compile notes summary
        let notes_summary = if notes_list.is_empty() {
            "No notes recorded for this book.".to_string()
        } else {
            notes_list
                .iter()
                .filter_map(|note| {
                    if !note.content.trim().is_empty() {
                        Some(format!("• {}", note.content.trim()))
                    } else {
                        None
                    }
                })
                .collect::<Vec<_>>()
                .join("\n\n")
        };

        // Extract highlights text
        let highlights_text: Vec<String> = highlights_list
            .iter()
            .filter_map(|highlight| {
                if let Some(excerpt) = &highlight.excerpt {
                    if !excerpt.trim().is_empty() {
                        let page_info = highlight.page
                            .map(|p| format!(" (Page {})", p))
                            .unwrap_or_default();
                        return Some(format!("\"{}\"{}", excerpt.trim(), page_info));
                    }
                }
                None
            })
            .collect();

        // Simple keyword extraction for themes (basic implementation)
        // Extract common words from notes and highlights (future: use better NLP)
        let key_themes = self.extract_themes(&notes_list, &highlights_list);

        Ok(BookSummary {
            book_id: book.id.unwrap_or(0),
            book_title: book.title,
            book_author: book.author,
            total_notes: notes_list.len(),
            total_highlights: highlights_list.len(),
            notes_summary,
            highlights_text,
            key_themes,
            generated_at: chrono::Utc::now(),
        })
    }

    /// Simple theme extraction (basic keyword frequency analysis)
    /// Future: implement more sophisticated NLP-based extraction
    fn extract_themes(&self, notes: &[Note], highlights: &[Note]) -> Vec<String> {
        use std::collections::HashMap;

        // Collect all text content
        let mut all_text = String::new();
        
        for note in notes {
            all_text.push_str(&note.content);
            all_text.push_str(" ");
        }
        
        for highlight in highlights {
            if let Some(excerpt) = &highlight.excerpt {
                all_text.push_str(excerpt);
                all_text.push_str(" ");
            }
            all_text.push_str(&highlight.content);
            all_text.push_str(" ");
        }

        // Simple word frequency (filter out common words)
        let stop_words: Vec<&str> = vec![
            "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
            "of", "with", "by", "from", "as", "is", "was", "are", "were", "be",
            "been", "have", "has", "had", "do", "does", "did", "will", "would",
            "could", "should", "may", "might", "must", "can", "this", "that",
            "these", "those", "i", "you", "he", "she", "it", "we", "they", "me",
            "him", "her", "us", "them", "my", "your", "his", "her", "its", "our",
            "their", "what", "which", "who", "whom", "whose", "where", "when",
            "why", "how", "all", "each", "every", "both", "few", "more", "most",
            "other", "some", "such", "no", "nor", "not", "only", "own", "same",
            "so", "than", "too", "very", "just", "now", "then", "here", "there",
            "about", "into", "through", "during", "before", "after", "above",
            "below", "up", "down", "out", "off", "over", "under", "again",
            "further", "once", "mais", "maior", "menor", "muito", "pouco",
            "quando", "como", "porque", "onde", "qual", "que", "este", "esse",
            "aquele", "um", "uma", "o", "a", "os", "as", "de", "do", "da", "dos",
            "das", "em", "no", "na", "nos", "nas", "para", "com", "sem", "por",
            "entre", "sobre", "até", "desde", "contra", "através", "durante",
        ];

        let lowercase_text = all_text.to_lowercase();
        let words: Vec<String> = lowercase_text
            .split_whitespace()
            .filter(|w| w.len() > 3) // Filter short words
            .filter(|w| !stop_words.contains(&w))
            .map(|w| w.to_string())
            .collect();

        let mut word_counts: HashMap<String, usize> = HashMap::new();
        for word in words {
            *word_counts.entry(word).or_insert(0) += 1;
        }

        // Get top 5 most frequent words as themes
        let mut themes: Vec<(usize, String)> = word_counts
            .into_iter()
            .map(|(word, count)| (count, word))
            .collect();
        themes.sort_by(|a, b| b.0.cmp(&a.0));
        
        themes
            .into_iter()
            .take(5)
            .map(|(_, word)| word)
            .collect()
    }
}

