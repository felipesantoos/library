use crate::application::dtos::GoalDto;
use crate::ports::repositories::GoalRepository;

/// Use case for getting a goal by ID
pub struct GetGoalUseCase<'a> {
    goal_repository: &'a dyn GoalRepository,
}

impl<'a> GetGoalUseCase<'a> {
    pub fn new(goal_repository: &'a dyn GoalRepository) -> Self {
        GetGoalUseCase { goal_repository }
    }

    pub fn execute(&self, id: i64) -> Result<GoalDto, String> {
        let goal = self.goal_repository
            .find_by_id(id)?
            .ok_or_else(|| format!("Goal with id {} not found", id))?;

        Ok(GoalDto::from(goal))
    }
}

