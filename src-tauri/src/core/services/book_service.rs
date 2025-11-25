use crate::app::dtos::{BookDto, CreateBookCommand, UpdateBookCommand, BookSummaryDto, ListBooksFilters};
use crate::core::domains::book::{Book, BookStatus, BookType};
use crate::core::interfaces::primary::BookService;
use crate::core::interfaces::secondary::{BookRepository, NoteRepository};
use crate::core::domains::note::Note;
use std::collections::HashMap;

/// Implementation of BookService
pub struct BookServiceImpl<'a> {
    book_repository: &'a dyn BookRepository,
    note_repository: &'a dyn NoteRepository,
}

impl<'a> BookServiceImpl<'a> {
    pub fn new(
        book_repository: &'a dyn BookRepository,
        note_repository: &'a dyn NoteRepository,
    ) -> Self {
        BookServiceImpl {
            book_repository,
            note_repository,
        }
    }
}

impl<'a> BookService for BookServiceImpl<'a> {
    fn create(&self, command: CreateBookCommand) -> Result<BookDto, String> {
        // Convert command to domain entity
        let book_type = match command.book_type.as_str() {
            "physical_book" => BookType::PhysicalBook,
            "ebook" => BookType::Ebook,
            "audiobook" => BookType::Audiobook,
            "article" => BookType::Article,
            "PDF" => BookType::Pdf,
            "comic" => BookType::Comic,
            _ => return Err(format!("Invalid book type: {}", command.book_type)),
        };

        // Create book entity with validation
        let mut book = Book::new(
            command.title,
            book_type,
            command.total_pages,
            command.total_minutes,
        )?;

        // Set optional fields
        book.author = command.author;
        book.genre = command.genre;
        book.isbn = command.isbn;
        book.publication_year = command.publication_year;
        book.cover_url = command.cover_url;
        book.url = command.url;

        // Validate
        book.validate_current_page()?;

        // Save via repository
        self.book_repository.create(&mut book)?;

        // Convert to DTO and return
        Ok(BookDto::from(book))
    }

    fn update(&self, command: UpdateBookCommand) -> Result<BookDto, String> {
        // Get existing book
        let mut book = self.book_repository
            .find_by_id(command.id)?
            .ok_or_else(|| format!("Book with id {} not found", command.id))?;

        // Update fields if provided
        if let Some(title) = command.title {
            if title.trim().is_empty() {
                return Err("Title cannot be empty".to_string());
            }
            book.title = title;
        }

        if let Some(author) = command.author {
            book.author = Some(author);
        }

        if let Some(genre) = command.genre {
            book.genre = Some(genre);
        }

        if let Some(book_type_str) = command.book_type {
            book.book_type = string_to_book_type(&book_type_str)?;
        }

        if let Some(isbn) = command.isbn {
            book.isbn = Some(isbn);
        }

        if let Some(pub_year) = command.publication_year {
            book.publication_year = Some(pub_year);
        }

        if let Some(total_pages) = command.total_pages {
            book.total_pages = Some(total_pages);
        }

        if let Some(total_minutes) = command.total_minutes {
            book.total_minutes = Some(total_minutes);
        }

        if let Some(current_page) = command.current_page_text {
            book.update_current_page(current_page)?;
        }

        if let Some(current_minutes) = command.current_minutes_audio {
            book.update_current_minutes_audio(current_minutes)?;
        }

        // Auto-update status based on progress (only if status wasn't explicitly provided)
        if command.status.is_none() {
            // Check if book is completed
            let is_completed = match book.book_type {
                crate::core::domains::book::BookType::Audiobook => {
                    if let Some(total) = book.total_minutes {
                        book.current_minutes_audio >= total
                    } else {
                        false
                    }
                }
                _ => {
                    if let Some(total) = book.total_pages {
                        book.current_page_text >= total
                    } else {
                        false
                    }
                }
            };

            if is_completed && book.status != crate::core::domains::book::BookStatus::Completed {
                book.mark_as_completed();
            } else if !is_completed {
                // Check if book should be marked as reading
                let has_progress = book.current_page_text > 0 || book.current_minutes_audio > 0;
                if has_progress && book.status == crate::core::domains::book::BookStatus::NotStarted {
                    book.mark_as_reading();
                }
            }
        }

        // Manual status update (if explicitly provided)
        if let Some(status_str) = command.status {
            let old_status = book.status.clone();
            book.status = string_to_book_status(&status_str)?;
            
            // Update status_changed_at if status actually changed
            if old_status != book.status {
                book.status_changed_at = Some(chrono::Utc::now());
            }
        }

        if let Some(is_archived) = command.is_archived {
            book.is_archived = is_archived;
            // If archiving, remove from wishlist
            if is_archived {
                book.is_wishlist = false;
            }
        }

        if let Some(is_wishlist) = command.is_wishlist {
            book.is_wishlist = is_wishlist;
            // If adding to wishlist, unarchive
            if is_wishlist {
                book.is_archived = false;
            }
        }

        if let Some(cover_url) = command.cover_url {
            book.cover_url = Some(cover_url);
        }

        if let Some(url) = command.url {
            book.url = Some(url);
        }

        // Update timestamp
        book.updated_at = chrono::Utc::now();

        // Validate
        book.validate_current_page()?;

        // Save via repository
        self.book_repository.update(&book)?;

        // Convert to DTO and return
        Ok(BookDto::from(book))
    }

    fn delete(&self, id: i64) -> Result<(), String> {
        // Check if book exists
        self.book_repository
            .find_by_id(id)?
            .ok_or_else(|| format!("Book with id {} not found", id))?;

        // Delete via repository (cascade deletes should be handled by database)
        self.book_repository.delete(id)?;

        Ok(())
    }

    fn get(&self, id: i64) -> Result<BookDto, String> {
        let book = self.book_repository
            .find_by_id(id)?
            .ok_or_else(|| format!("Book with id {} not found", id))?;

        Ok(BookDto::from(book))
    }

    fn list(&self, filters: ListBooksFilters) -> Result<Vec<BookDto>, String> {
        // First, fix any inconsistent data (books that are both archived and in wishlist)
        // This needs to happen before filtering to catch all inconsistent books
        let all_books = self.book_repository.find_all()?;
        let mut needs_update = Vec::new();
        for book in &all_books {
            if book.is_archived && book.is_wishlist {
                if let Some(book_id) = book.id {
                    needs_update.push(book_id);
                }
            }
        }
        
        // Fix books that are both archived and in wishlist
        // Business rule: a book cannot be both archived and in wishlist
        // Strategy: Always unarchive (wishlist takes priority) unless we're specifically filtering archived=true
        for book_id in &needs_update {
            if let Ok(Some(mut book)) = self.book_repository.find_by_id(*book_id) {
                // If we're specifically looking at archived books (is_archived=true and not filtering wishlist=true),
                // keep it archived and remove from wishlist
                // Otherwise, always unarchive (wishlist takes priority)
                if filters.is_archived == Some(true) && filters.is_wishlist != Some(true) {
                    book.is_wishlist = false;
                } else {
                    // Default: unarchive (wishlist takes priority)
                    book.is_archived = false;
                }
                let _ = self.book_repository.update(&book);
            }
        }

        let status_enum = filters.status
            .as_ref()
            .map(|s| string_to_book_status(s))
            .transpose()?;

        let book_type_enum = filters.book_type
            .as_ref()
            .map(|t| string_to_book_type(t))
            .transpose()?;

        eprintln!("[BookService] Calling find_with_filters with: status={:?}, book_type={:?}, is_archived={:?}, is_wishlist={:?}, collection_id={:?}",
                  status_enum, book_type_enum, filters.is_archived, filters.is_wishlist, filters.collection_id);

        let books = self.book_repository.find_with_filters(
            status_enum,
            book_type_enum,
            filters.is_archived,
            filters.is_wishlist,
            filters.collection_id,
        )?;

        eprintln!("[BookService] Found {} books from repository", books.len());

        Ok(books.into_iter().map(BookDto::from).collect())
    }

    fn generate_summary(&self, book_id: i64) -> Result<BookSummaryDto, String> {
        // Get book
        let book = self.book_repository
            .find_by_id(book_id)?
            .ok_or_else(|| format!("Book with id {} not found", book_id))?;

        // Get all notes for the book
        let notes = self.note_repository.find_by_book_id(book_id)?;

        // Compile notes summary
        let notes_summary = if notes.is_empty() {
            "No notes recorded for this book.".to_string()
        } else {
            notes
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

        // Simple keyword extraction for themes (basic implementation)
        let key_themes = extract_themes(&notes);

        Ok(BookSummaryDto {
            book_id: book.id.unwrap_or(0),
            book_title: book.title,
            book_author: book.author,
            total_notes: notes.len(),
            notes_summary,
            key_themes,
            generated_at: chrono::Utc::now().to_rfc3339(),
        })
    }
}

fn string_to_book_status(s: &str) -> Result<BookStatus, String> {
    match s {
        "not_started" => Ok(BookStatus::NotStarted),
        "reading" => Ok(BookStatus::Reading),
        "paused" => Ok(BookStatus::Paused),
        "abandoned" => Ok(BookStatus::Abandoned),
        "completed" => Ok(BookStatus::Completed),
        "rereading" => Ok(BookStatus::Rereading),
        _ => Err(format!("Invalid status: {}", s)),
    }
}

fn string_to_book_type(s: &str) -> Result<BookType, String> {
    match s {
        "physical_book" => Ok(BookType::PhysicalBook),
        "ebook" => Ok(BookType::Ebook),
        "audiobook" => Ok(BookType::Audiobook),
        "article" => Ok(BookType::Article),
        "PDF" => Ok(BookType::Pdf),
        "comic" => Ok(BookType::Comic),
        _ => Err(format!("Invalid book type: {}", s)),
    }
}

/// Simple theme extraction (basic keyword frequency analysis)
fn extract_themes(notes: &[Note]) -> Vec<String> {
    // Collect all text content
    let mut all_text = String::new();
    
    for note in notes {
        all_text.push_str(&note.content);
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

