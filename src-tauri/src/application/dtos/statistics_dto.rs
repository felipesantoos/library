use serde::{Deserialize, Serialize};

/// Statistics Data Transfer Object for API communication
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StatisticsDto {
    pub today: TodayStatistics,
    pub this_month: MonthStatistics,
    pub current_book: Option<CurrentBookStatistics>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TodayStatistics {
    pub pages_read: i32,
    pub minutes_read: i32,
    pub sessions_count: i32,
    pub duration_seconds: i32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MonthStatistics {
    pub pages_read: i32,
    pub minutes_read: i32,
    pub sessions_count: i32,
    pub books_completed: i32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CurrentBookStatistics {
    pub book_id: i64,
    pub title: String,
    pub author: Option<String>,
    pub cover_url: Option<String>,
    pub current_page: i32,
    pub total_pages: Option<i32>,
    pub progress_percentage: f64,
    pub status: String,
}

