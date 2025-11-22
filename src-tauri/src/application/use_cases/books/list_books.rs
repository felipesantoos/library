use crate::application::dtos::BookDto;
use crate::domain::entities::{BookStatus, BookType};
use crate::ports::repositories::BookRepository;

/// Use case for listing books with filters
pub struct ListBooksUseCase<'a> {
    book_repository: &'a dyn BookRepository,
}

impl<'a> ListBooksUseCase<'a> {
    pub fn new(book_repository: &'a dyn BookRepository) -> Self {
        ListBooksUseCase { book_repository }
    }

    pub fn execute(
        &self,
        status: Option<String>,
        book_type: Option<String>,
        is_archived: Option<bool>,
        is_wishlist: Option<bool>,
    ) -> Result<Vec<BookDto>, String> {
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
                if is_archived == Some(true) && is_wishlist != Some(true) {
                    book.is_wishlist = false;
                } else {
                    // Default: unarchive (wishlist takes priority)
                    book.is_archived = false;
                }
                let _ = self.book_repository.update(&book);
            }
        }

        let status_enum = status
            .as_ref()
            .map(|s| string_to_book_status(s))
            .transpose()?;

        let book_type_enum = book_type
            .as_ref()
            .map(|t| string_to_book_type(t))
            .transpose()?;

        let books = self.book_repository.find_with_filters(
            status_enum,
            book_type_enum,
            is_archived,
            is_wishlist,
        )?;

        Ok(books.into_iter().map(BookDto::from).collect())
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

