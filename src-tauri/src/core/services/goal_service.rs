use crate::app::dtos::goal_dto::{GoalDto, CreateGoalCommand, UpdateGoalCommand, ListGoalsFilters};
use crate::core::domains::goal::{Goal, GoalType};
use crate::core::interfaces::primary::GoalService;
use crate::core::interfaces::secondary::{GoalRepository, SessionRepository, BookRepository};
use crate::core::domains::book::BookStatus;
use chrono::Datelike;

/// Implementation of GoalService
pub struct GoalServiceImpl<'a> {
    goal_repository: &'a dyn GoalRepository,
    session_repository: &'a dyn SessionRepository,
    book_repository: &'a dyn BookRepository,
}

impl<'a> GoalServiceImpl<'a> {
    pub fn new(
        goal_repository: &'a dyn GoalRepository,
        session_repository: &'a dyn SessionRepository,
        book_repository: &'a dyn BookRepository,
    ) -> Self {
        GoalServiceImpl {
            goal_repository,
            session_repository,
            book_repository,
        }
    }
}

impl<'a> GoalService for GoalServiceImpl<'a> {
    fn create(&self, command: CreateGoalCommand) -> Result<GoalDto, String> {
        // Parse goal type
        let goal_type = match command.goal_type.as_str() {
            "pages_monthly" => GoalType::PagesMonthly,
            "books_yearly" => GoalType::BooksYearly,
            "minutes_daily" => GoalType::MinutesDaily,
            _ => return Err(format!("Invalid goal type: {}", command.goal_type)),
        };

        // Create goal entity with validation
        let mut goal = if let (Some(year), Some(month)) = (command.period_year, command.period_month) {
            match goal_type {
                GoalType::PagesMonthly => {
                    Goal::new_monthly_pages(year, month, command.target_value)?
                }
                GoalType::BooksYearly => {
                    Goal::new_yearly_books(year, command.target_value)?
                }
                GoalType::MinutesDaily => {
                    Goal::new(goal_type, command.target_value)?
                }
            }
        } else if let Some(year) = command.period_year {
            match goal_type {
                GoalType::BooksYearly => {
                    Goal::new_yearly_books(year, command.target_value)?
                }
                _ => Goal::new(goal_type, command.target_value)?,
            }
        } else {
            Goal::new(goal_type, command.target_value)?
        };

        // Set optional fields
        if let Some(is_active) = command.is_active {
            goal.is_active = is_active;
        }

        // Save via repository
        self.goal_repository.create(&mut goal)?;

        Ok(GoalDto::from(goal))
    }

    fn update(&self, command: UpdateGoalCommand) -> Result<GoalDto, String> {
        // Get existing goal
        let mut goal = self.goal_repository
            .find_by_id(command.id)?
            .ok_or_else(|| format!("Goal with id {} not found", command.id))?;

        // Update fields if provided
        if let Some(target_value) = command.target_value {
            goal.target_value = target_value;
        }

        if let Some(is_active) = command.is_active {
            goal.is_active = is_active;
        }

        // Update timestamp
        goal.updated_at = chrono::Utc::now();

        // Save via repository
        self.goal_repository.update(&goal)?;

        Ok(GoalDto::from(goal))
    }

    fn delete(&self, id: i64) -> Result<(), String> {
        // Check if goal exists
        self.goal_repository
            .find_by_id(id)?
            .ok_or_else(|| format!("Goal with id {} not found", id))?;

        // Delete via repository
        self.goal_repository.delete(id)?;

        Ok(())
    }

    fn get(&self, id: i64) -> Result<GoalDto, String> {
        let goal = self.goal_repository
            .find_by_id(id)?
            .ok_or_else(|| format!("Goal with id {} not found", id))?;

        Ok(GoalDto::from(goal))
    }

    fn list(&self, filters: ListGoalsFilters) -> Result<Vec<GoalDto>, String> {
        let include_inactive = filters.include_inactive.unwrap_or(false);
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
                let mut dto = GoalDto::from(goal);
                dto.current_progress = progress;
                dto.progress_percentage = percentage;
                dto
            })
            .collect();

        Ok(goal_dtos)
    }
}

impl<'a> GoalServiceImpl<'a> {
    fn calculate_progress(&self, goal: &Goal, current_year: i32, current_month: u32) -> (i32, f64) {
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

