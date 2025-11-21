use crate::domain::entities::{BookStatus, BookType};
use crate::application::dtos::{BookDto, UpdateBookCommand};
use crate::ports::repositories::BookRepository;

/// Use case for updating an existing book
pub struct UpdateBookUseCase<'a> {
    book_repository: &'a dyn BookRepository,
}

impl<'a> UpdateBookUseCase<'a> {
    pub fn new(book_repository: &'a dyn BookRepository) -> Self {
        UpdateBookUseCase { book_repository }
    }

    pub fn execute(&self, command: UpdateBookCommand) -> Result<BookDto, String> {
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
        }

        if let Some(is_wishlist) = command.is_wishlist {
            book.is_wishlist = is_wishlist;
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

