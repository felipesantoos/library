use crate::application::dtos::reading_dto::ReadingDto;
use crate::ports::repositories::reading_repository::ReadingRepository;

pub struct GetReadingUseCase<'a> {
    reading_repository: &'a dyn ReadingRepository,
}

impl<'a> GetReadingUseCase<'a> {
    pub fn new(reading_repository: &'a dyn ReadingRepository) -> Self {
        GetReadingUseCase { reading_repository }
    }

    pub fn execute(&self, id: i64) -> Result<ReadingDto, String> {
        let reading = self.reading_repository.find_by_id(id)?
            .ok_or_else(|| format!("Reading with id {} not found", id))?;
        Ok(reading.into())
    }
}

