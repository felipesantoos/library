use crate::application::dtos::BookDto;
use crate::ports::repositories::BookRepository;

/// Use case for getting a book by ID
pub struct GetBookUseCase<'a> {
    book_repository: &'a dyn BookRepository,
}

impl<'a> GetBookUseCase<'a> {
    pub fn new(book_repository: &'a dyn BookRepository) -> Self {
        GetBookUseCase { book_repository }
    }

    pub fn execute(&self, id: i64) -> Result<BookDto, String> {
        let book = self.book_repository
            .find_by_id(id)?
            .ok_or_else(|| format!("Book with id {} not found", id))?;

        Ok(BookDto::from(book))
    }
}

