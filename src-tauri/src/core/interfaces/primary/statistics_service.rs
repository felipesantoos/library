use crate::app::dtos::statistics_dto::StatisticsDto;

/// Primary interface for statistics service operations
pub trait StatisticsService: Send + Sync {
    fn get(&self) -> Result<StatisticsDto, String>;
}

