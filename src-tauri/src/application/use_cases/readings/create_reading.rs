use crate::application::dtos::reading_dto::{CreateReadingCommand, ReadingDto};
use crate::domain::entities::reading::{Reading, ReadingStatus};
use crate::ports::repositories::reading_repository::ReadingRepository;
use crate::ports::repositories::book_repository::BookRepository;
use crate::domain::entities::book::BookStatus;

pub struct CreateReadingUseCase<'a> {
    reading_repository: &'a dyn ReadingRepository,
    book_repository: &'a dyn BookRepository,
}

impl<'a> CreateReadingUseCase<'a> {
    pub fn new(
        reading_repository: &'a dyn ReadingRepository,
        book_repository: &'a dyn BookRepository,
    ) -> Self {
        CreateReadingUseCase {
            reading_repository,
            book_repository,
        }
    }

    pub fn execute(&self, command: CreateReadingCommand) -> Result<ReadingDto, String> {
        // Verify book exists
        let book = self.book_repository.find_by_id(command.book_id)?
            .ok_or_else(|| format!("Book with id {} not found", command.book_id))?;

        // Get next reading number
        let reading_number = self.reading_repository.get_next_reading_number(command.book_id)?;

        // Create new reading
        let mut reading = Reading::new(command.book_id, reading_number)?;
        reading.mark_as_started(); // Automatically mark as started

        let created = self.reading_repository.create(&reading)?;

        // Update book status to "rereading" if it was completed
        if book.status == crate::domain::entities::book::BookStatus::Completed {
            let mut updated_book = book;
            updated_book.status = BookStatus::Rereading;
            self.book_repository.update(&updated_book)?;
        }

        Ok(created.into())
    }
}

