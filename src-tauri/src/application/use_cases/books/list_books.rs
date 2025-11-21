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

