use crate::application::dtos::reading_dto::ReadingDto;
use crate::ports::repositories::reading_repository::ReadingRepository;

pub struct GetCurrentReadingUseCase<'a> {
    reading_repository: &'a dyn ReadingRepository,
}

impl<'a> GetCurrentReadingUseCase<'a> {
    pub fn new(reading_repository: &'a dyn ReadingRepository) -> Self {
        GetCurrentReadingUseCase { reading_repository }
    }

    pub fn execute(&self, book_id: i64) -> Result<Option<ReadingDto>, String> {
        let reading = self.reading_repository.find_current_reading(book_id)?;
        Ok(reading.map(|r| r.into()))
    }
}

