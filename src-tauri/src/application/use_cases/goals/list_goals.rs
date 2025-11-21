use crate::domain::entities::GoalType;
use crate::application::dtos::{GoalDto, StatisticsDto};
use crate::ports::repositories::{GoalRepository, SessionRepository, BookRepository};
use crate::domain::entities::BookStatus;
use chrono::Datelike;

/// Use case for listing active goals with progress
pub struct ListGoalsUseCase<'a> {
    goal_repository: &'a dyn GoalRepository,
    session_repository: &'a dyn SessionRepository,
    book_repository: &'a dyn BookRepository,
}

impl<'a> ListGoalsUseCase<'a> {
    pub fn new(
        goal_repository: &'a dyn GoalRepository,
        session_repository: &'a dyn SessionRepository,
        book_repository: &'a dyn BookRepository,
    ) -> Self {
        ListGoalsUseCase {
            goal_repository,
            session_repository,
            book_repository,
        }
    }

    pub fn execute(&self, include_inactive: bool) -> Result<Vec<GoalDto>, String> {
        let goals = if include_inactive {
            self.goal_repository.find_all()?
        } else {
            self.goal_repository.find_active()?
        };

        let now = chrono::Utc::now();
        let current_date = now.date_naive();
        let current_year = Datelike::year(&current_date);
        let current_month = Datelike::month(&current_date);

        let goal_dtos: Vec<GoalDto> = goals
            .into_iter()
            .map(|goal| {
                let (progress, percentage) = self.calculate_progress(&goal, current_year, current_month);
                let mut dto = crate::application::dtos::GoalDto::from(goal);
                dto.current_progress = progress;
                dto.progress_percentage = percentage;
                dto
            })
            .collect();

        Ok(goal_dtos)
    }

    fn calculate_progress(&self, goal: &crate::domain::entities::Goal, current_year: i32, current_month: u32) -> (i32, f64) {
        match goal.goal_type {
            GoalType::PagesMonthly => {
                if let (Some(goal_year), Some(goal_month)) = (goal.period_year, goal.period_month) {
                    if goal_year == current_year && goal_month == current_month {
                        // Calculate pages read this month
                        let start_date = chrono::NaiveDate::from_ymd_opt(goal_year, goal_month, 1)
                            .unwrap_or_else(|| chrono::NaiveDate::from_ymd_opt(2024, 1, 1).unwrap());
                        
                        // Calculate last day of month
                        let next_month = if goal_month == 12 {
                            chrono::NaiveDate::from_ymd_opt(goal_year + 1, 1, 1)
                        } else {
                            chrono::NaiveDate::from_ymd_opt(goal_year, goal_month + 1, 1)
                        };
                        let end_date = next_month
                            .unwrap_or_else(|| chrono::NaiveDate::from_ymd_opt(2024, 1, 1).unwrap())
                            .pred_opt()
                            .unwrap_or(start_date);
                        
                        if let Ok(sessions) = self.session_repository.find_by_date_range(start_date, end_date) {
                            let pages = sessions.iter()
                                .map(|s| s.pages_read.unwrap_or(0))
                                .sum();
                            let percentage = if goal.target_value > 0 {
                                (pages as f64 / goal.target_value as f64 * 100.0).min(100.0)
                            } else {
                                0.0
                            };
                            (pages, percentage)
                        } else {
                            (0, 0.0)
                        }
                    } else {
                        (0, 0.0)
                    }
                } else {
                    (0, 0.0)
                }
            }
            GoalType::BooksYearly => {
                if let Some(goal_year) = goal.period_year {
                    if goal_year == current_year {
                        // Count completed books this year
                        if let Ok(books) = self.book_repository.find_by_status(BookStatus::Completed) {
                            let completed = books.iter()
                                .filter(|b| {
                                    if let Some(status_changed) = b.status_changed_at {
                                        Datelike::year(&status_changed.date_naive()) == goal_year
                                    } else {
                                        false
                                    }
                                })
                                .count() as i32;
                            let percentage = if goal.target_value > 0 {
                                (completed as f64 / goal.target_value as f64 * 100.0).min(100.0)
                            } else {
                                0.0
                            };
                            (completed, percentage)
                        } else {
                            (0, 0.0)
                        }
                    } else {
                        (0, 0.0)
                    }
                } else {
                    (0, 0.0)
                }
            }
            GoalType::MinutesDaily => {
                // Calculate minutes read today
                let today = chrono::Utc::now().date_naive();
                if let Ok(sessions) = self.session_repository.find_by_date_range(today, today) {
                    let minutes = sessions.iter()
                        .map(|s| s.minutes_read.unwrap_or(0))
                        .sum();
                    let percentage = if goal.target_value > 0 {
                        (minutes as f64 / goal.target_value as f64 * 100.0).min(100.0)
                    } else {
                        0.0
                    };
                    (minutes, percentage)
                } else {
                    (0, 0.0)
                }
            }
        }
    }
}

/// Use case for getting statistics
pub struct GetStatisticsUseCase<'a> {
    session_repository: &'a dyn SessionRepository,
    book_repository: &'a dyn BookRepository,
}

impl<'a> GetStatisticsUseCase<'a> {
    pub fn new(
        session_repository: &'a dyn SessionRepository,
        book_repository: &'a dyn BookRepository,
    ) -> Self {
        GetStatisticsUseCase {
            session_repository,
            book_repository,
        }
    }

    pub fn execute(&self) -> Result<StatisticsDto, String> {
        let now = chrono::Utc::now();
        let current_date = now.date_naive();
        let current_year = Datelike::year(&current_date);
        let current_month = Datelike::month(&current_date);

        // Pages read this month
        let month_start = chrono::NaiveDate::from_ymd_opt(current_year, current_month, 1)
            .unwrap_or_else(|| chrono::NaiveDate::from_ymd_opt(2024, 1, 1).unwrap());
        
        // Calculate last day of month
        let next_month = if current_month == 12 {
            chrono::NaiveDate::from_ymd_opt(current_year + 1, 1, 1)
        } else {
            chrono::NaiveDate::from_ymd_opt(current_year, current_month + 1, 1)
        };
        let month_end = next_month
            .unwrap_or_else(|| chrono::NaiveDate::from_ymd_opt(2024, 1, 1).unwrap())
            .pred_opt()
            .unwrap_or(month_start);
        
        let month_sessions = self.session_repository.find_by_date_range(month_start, month_end)?;
        let pages_read_this_month: i32 = month_sessions.iter()
            .map(|s| s.pages_read.unwrap_or(0))
            .sum();
        let sessions_this_month = month_sessions.len() as i32;

        // Total pages read
        let all_sessions = self.session_repository.find_all()?;
        let total_pages_read: i32 = all_sessions.iter()
            .map(|s| s.pages_read.unwrap_or(0))
            .sum();

        // Books completed
        let all_books = self.book_repository.find_all()?;
        let books_completed = all_books.iter()
            .filter(|b| b.status == crate::domain::entities::BookStatus::Completed)
            .count() as i32;

        // Average pages per session
        let average_pages_per_session = if sessions_this_month > 0 {
            pages_read_this_month as f64 / sessions_this_month as f64
        } else {
            0.0
        };

        // Pages per month (last 12 months)
        let mut pages_per_month = Vec::new();
        for i in 0..12 {
            let date = now.date_naive() - chrono::Duration::days(30 * i);
            let year = Datelike::year(&date);
            let month = Datelike::month(&date);
            let month_start = chrono::NaiveDate::from_ymd_opt(year, month, 1)
                .unwrap_or_else(|| chrono::NaiveDate::from_ymd_opt(2024, 1, 1).unwrap());
            
            // Calculate last day of month
            let next_month = if month == 12 {
                chrono::NaiveDate::from_ymd_opt(year + 1, 1, 1)
            } else {
                chrono::NaiveDate::from_ymd_opt(year, month + 1, 1)
            };
            let month_end = next_month
                .unwrap_or_else(|| chrono::NaiveDate::from_ymd_opt(2024, 1, 1).unwrap())
                .pred_opt()
                .unwrap_or(month_start);
            
            if let Ok(sessions) = self.session_repository.find_by_date_range(month_start, month_end) {
                let pages: i32 = sessions.iter()
                    .map(|s| s.pages_read.unwrap_or(0))
                    .sum();
                pages_per_month.push(crate::application::dtos::MonthlyPagesDto {
                    year,
                    month,
                    pages,
                });
            }
        }
        pages_per_month.reverse();

        Ok(StatisticsDto {
            pages_read_this_month,
            total_pages_read,
            books_completed,
            sessions_this_month,
            average_pages_per_session,
            pages_per_month,
        })
    }
}
