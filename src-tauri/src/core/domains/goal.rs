use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum GoalType {
    PagesMonthly,
    BooksYearly,
    MinutesDaily,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Goal {
    pub id: Option<i64>,
    pub goal_type: GoalType,
    pub target_value: i32,
    pub period_year: Option<i32>,
    pub period_month: Option<u32>, // 1-12
    pub is_active: bool,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub updated_at: chrono::DateTime<chrono::Utc>,
}

impl Goal {
    /// Creates a new Goal with validation
    pub fn new(goal_type: GoalType, target_value: i32) -> Result<Self, String> {
        if target_value <= 0 {
            return Err("Target value must be greater than 0".to_string());
        }

        Ok(Goal {
            id: None,
            goal_type,
            target_value,
            period_year: None,
            period_month: None,
            is_active: true,
            created_at: chrono::Utc::now(),
            updated_at: chrono::Utc::now(),
        })
    }

    /// Creates a monthly pages goal
    pub fn new_monthly_pages(year: i32, month: u32, target_pages: i32) -> Result<Self, String> {
        if month < 1 || month > 12 {
            return Err("Month must be between 1 and 12".to_string());
        }

        let mut goal = Self::new(GoalType::PagesMonthly, target_pages)?;
        goal.period_year = Some(year);
        goal.period_month = Some(month);
        Ok(goal)
    }

    /// Creates a yearly books goal
    pub fn new_yearly_books(year: i32, target_books: i32) -> Result<Self, String> {
        let mut goal = Self::new(GoalType::BooksYearly, target_books)?;
        goal.period_year = Some(year);
        goal.period_month = None;
        Ok(goal)
    }
}

