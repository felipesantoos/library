use crate::app::dtos::goal_dto::{GoalDto, CreateGoalCommand, UpdateGoalCommand};

/// Primary interface for goal service operations
pub trait GoalService: Send + Sync {
    fn create(&self, command: CreateGoalCommand) -> Result<GoalDto, String>;
    fn update(&self, command: UpdateGoalCommand) -> Result<GoalDto, String>;
    fn delete(&self, id: i64) -> Result<(), String>;
    fn get(&self, id: i64) -> Result<GoalDto, String>;
    fn list(&self, include_inactive: bool) -> Result<Vec<GoalDto>, String>;
}

