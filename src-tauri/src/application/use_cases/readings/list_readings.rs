use crate::application::dtos::reading_dto::ReadingDto;
use crate::domain::entities::reading::Reading;
use crate::ports::repositories::reading_repository::ReadingRepository;

pub struct ListReadingsUseCase<'a> {
    reading_repository: &'a dyn ReadingRepository,
}

impl<'a> ListReadingsUseCase<'a> {
    pub fn new(reading_repository: &'a dyn ReadingRepository) -> Self {
        ListReadingsUseCase { reading_repository }
    }

    pub fn execute(&self, book_id: i64) -> Result<Vec<ReadingDto>, String> {
        let readings = self.reading_repository.find_by_book_id(book_id)?;
        Ok(readings.into_iter().map(|r| r.into()).collect())
    }
}

