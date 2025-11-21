use crate::ports::repositories::GoalRepository;

/// Use case for deleting a goal
pub struct DeleteGoalUseCase<'a> {
    goal_repository: &'a dyn GoalRepository,
}

impl<'a> DeleteGoalUseCase<'a> {
    pub fn new(goal_repository: &'a dyn GoalRepository) -> Self {
        DeleteGoalUseCase { goal_repository }
    }

    pub fn execute(&self, id: i64) -> Result<(), String> {
        // Check if goal exists
        self.goal_repository
            .find_by_id(id)?
            .ok_or_else(|| format!("Goal with id {} not found", id))?;

        // Delete via repository
        self.goal_repository.delete(id)?;

        Ok(())
    }
}

