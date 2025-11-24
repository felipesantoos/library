use crate::app::dtos::reading_dto::{ReadingDto, CreateReadingCommand, ListReadingsFilters};
use crate::core::domains::reading::Reading;
use crate::core::domains::book::BookStatus;
use crate::core::interfaces::primary::ReadingService;
use crate::core::interfaces::secondary::{ReadingRepository, BookRepository};

/// Implementation of ReadingService
pub struct ReadingServiceImpl<'a> {
    reading_repository: &'a dyn ReadingRepository,
    book_repository: &'a dyn BookRepository,
}

impl<'a> ReadingServiceImpl<'a> {
    pub fn new(
        reading_repository: &'a dyn ReadingRepository,
        book_repository: &'a dyn BookRepository,
    ) -> Self {
        ReadingServiceImpl {
            reading_repository,
            book_repository,
        }
    }
}

impl<'a> ReadingService for ReadingServiceImpl<'a> {
    fn create(&self, command: CreateReadingCommand) -> Result<ReadingDto, String> {
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
        if book.status == BookStatus::Completed {
            let mut updated_book = book;
            updated_book.status = BookStatus::Rereading;
            self.book_repository.update(&updated_book)?;
        }

        Ok(created.into())
    }

    fn get(&self, id: i64) -> Result<ReadingDto, String> {
        let reading = self.reading_repository.find_by_id(id)?
            .ok_or_else(|| format!("Reading with id {} not found", id))?;
        Ok(reading.into())
    }

    fn get_current(&self, book_id: i64) -> Result<Option<ReadingDto>, String> {
        let reading = self.reading_repository.find_current_reading(book_id)?;
        Ok(reading.map(|r| r.into()))
    }

    fn list(&self, filters: ListReadingsFilters) -> Result<Vec<ReadingDto>, String> {
        let readings = if let Some(b_id) = filters.book_id {
            self.reading_repository.find_by_book_id(b_id)?
        } else {
            self.reading_repository.find_all()?
        };
        Ok(readings.into_iter().map(|r| r.into()).collect())
    }
}

