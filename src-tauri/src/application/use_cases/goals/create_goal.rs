use crate::domain::entities::{Goal, GoalType};
use crate::application::dtos::CreateGoalCommand;
use crate::ports::repositories::GoalRepository;

/// Use case for creating a new goal
pub struct CreateGoalUseCase<'a> {
    goal_repository: &'a dyn GoalRepository,
}

impl<'a> CreateGoalUseCase<'a> {
    pub fn new(goal_repository: &'a dyn GoalRepository) -> Self {
        CreateGoalUseCase { goal_repository }
    }

    pub fn execute(&self, command: CreateGoalCommand) -> Result<Goal, String> {
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

        Ok(goal)
    }
}

