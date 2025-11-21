use crate::domain::entities::{Book, BookType};
use crate::application::dtos::{BookDto, CreateBookCommand};
use crate::ports::repositories::BookRepository;

/// Use case for creating a new book
pub struct CreateBookUseCase<'a> {
    book_repository: &'a dyn BookRepository,
}

impl<'a> CreateBookUseCase<'a> {
    pub fn new(book_repository: &'a dyn BookRepository) -> Self {
        CreateBookUseCase { book_repository }
    }

    pub fn execute(&self, command: CreateBookCommand) -> Result<BookDto, String> {
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
}

