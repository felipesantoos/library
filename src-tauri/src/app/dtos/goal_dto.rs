use serde::{Deserialize, Serialize};
use crate::core::domains::goal::{Goal, GoalType};

/// Goal Data Transfer Object for API communication
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GoalDto {
    pub id: Option<i64>,
    pub goal_type: String, // Serialized GoalType
    pub target_value: i32,
    pub period_year: Option<i32>,
    pub period_month: Option<u32>,
    pub is_active: bool,
    pub created_at: String, // ISO8601 string
    pub updated_at: String, // ISO8601 string
    pub current_progress: i32, // Calculated progress
    pub progress_percentage: f64, // Calculated percentage (0-100)
}

impl From<Goal> for GoalDto {
    fn from(goal: Goal) -> Self {
        GoalDto {
            id: goal.id,
            goal_type: goal_type_to_string(&goal.goal_type),
            target_value: goal.target_value,
            period_year: goal.period_year,
            period_month: goal.period_month,
            is_active: goal.is_active,
            created_at: goal.created_at.to_rfc3339(),
            updated_at: goal.updated_at.to_rfc3339(),
            current_progress: 0, // Will be calculated by use case
            progress_percentage: 0.0, // Will be calculated by use case
        }
    }
}

fn goal_type_to_string(goal_type: &GoalType) -> String {
    match goal_type {
        GoalType::PagesMonthly => "pages_monthly".to_string(),
        GoalType::BooksYearly => "books_yearly".to_string(),
        GoalType::MinutesDaily => "minutes_daily".to_string(),
    }
}

fn string_to_goal_type(s: &str) -> Result<GoalType, String> {
    match s {
        "pages_monthly" => Ok(GoalType::PagesMonthly),
        "books_yearly" => Ok(GoalType::BooksYearly),
        "minutes_daily" => Ok(GoalType::MinutesDaily),
        _ => Err(format!("Invalid goal type: {}", s)),
    }
}

/// Command for creating a goal
#[derive(Debug, Deserialize)]
pub struct CreateGoalCommand {
    pub goal_type: String,
    pub target_value: i32,
    pub period_year: Option<i32>,
    pub period_month: Option<u32>,
    pub is_active: Option<bool>,
}

/// Command for updating a goal
#[derive(Debug, Deserialize)]
pub struct UpdateGoalCommand {
    pub id: i64,
    pub target_value: Option<i32>,
    pub is_active: Option<bool>,
}

/// Statistics Data Transfer Object
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StatisticsDto {
    pub pages_read_this_month: i32,
    pub total_pages_read: i32,
    pub books_completed: i32,
    pub sessions_this_month: i32,
    pub average_pages_per_session: f64,
    pub pages_per_month: Vec<MonthlyPagesDto>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MonthlyPagesDto {
    pub year: i32,
    pub month: u32,
    pub pages: i32,
}

