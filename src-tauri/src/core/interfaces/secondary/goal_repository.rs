use crate::core::domains::goal::{Goal, GoalType};

/// Repository trait for Goal entity (Port/Interface)
pub trait GoalRepository: Send + Sync {
    /// Creates a new goal
    fn create(&self, goal: &mut Goal) -> Result<(), String>;

    /// Updates an existing goal
    fn update(&self, goal: &Goal) -> Result<(), String>;

    /// Deletes a goal by ID
    fn delete(&self, id: i64) -> Result<(), String>;

    /// Finds a goal by ID
    fn find_by_id(&self, id: i64) -> Result<Option<Goal>, String>;

    /// Finds all goals
    fn find_all(&self) -> Result<Vec<Goal>, String>;

    /// Finds active goals
    fn find_active(&self) -> Result<Vec<Goal>, String>;

    /// Finds goals by type
    fn find_by_type(&self, goal_type: GoalType) -> Result<Vec<Goal>, String>;

    /// Finds goals by period
    fn find_by_period(
        &self,
        year: Option<i32>,
        month: Option<u32>,
    ) -> Result<Vec<Goal>, String>;
}

