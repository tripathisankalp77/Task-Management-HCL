using TaskManagerApi.DTOs;
using TaskManagerApi.Models;
using TaskManagerApi.Repositories;

namespace TaskManagerApi.Services
{
    public class TaskService : ITaskService
    {
        private readonly ITaskRepository _taskRepository;

        public TaskService(ITaskRepository taskRepository)
        {
            _taskRepository = taskRepository;
        }

        public async Task<IEnumerable<TaskResponseDto>> GetTasksByUserIdAsync(int userId)
        {
            var tasks = await _taskRepository.GetByUserIdAsync(userId);
            return tasks.Select(MapToResponse);
        }

        public async Task<TaskResponseDto?> GetTaskByIdAsync(int id, int userId)
        {
            var task = await _taskRepository.GetByIdAsync(id);
            // Only return the task if it belongs to the requesting user
            if (task == null || task.UserId != userId) return null;
            return MapToResponse(task);
        }

        public async Task<TaskResponseDto> CreateTaskAsync(CreateTaskDto dto, int userId)
        {
            var task = new TaskItem
            {
                Title       = dto.Title,
                Description = dto.Description,
                Status      = dto.Status,
                DueDate     = dto.DueDate,
                UserId      = userId,          // Always from JWT claim, never from body
                CreatedAt   = DateTime.UtcNow,
                UpdatedAt   = DateTime.UtcNow
            };
            var created = await _taskRepository.CreateAsync(task);
            return MapToResponse(created);
        }

        public async Task<TaskResponseDto?> UpdateTaskAsync(int id, UpdateTaskDto dto, int userId)
        {
            var task = await _taskRepository.GetByIdAsync(id);
            // Ensure the task belongs to the requesting user
            if (task == null || task.UserId != userId) return null;

            task.Title       = dto.Title;
            task.Description = dto.Description;
            task.Status      = dto.Status;
            task.DueDate     = dto.DueDate;
            task.UpdatedAt   = DateTime.UtcNow;

            var updated = await _taskRepository.UpdateAsync(task);
            return updated == null ? null : MapToResponse(updated);
        }

        public async Task<bool> DeleteTaskAsync(int id, int userId)
        {
            var task = await _taskRepository.GetByIdAsync(id);
            // Ensure the task belongs to the requesting user
            if (task == null || task.UserId != userId) return false;
            return await _taskRepository.DeleteAsync(id);
        }

        private static TaskResponseDto MapToResponse(TaskItem task) => new()
        {
            Id          = task.Id,
            Title       = task.Title,
            Description = task.Description,
            Status      = task.Status,
            DueDate     = task.DueDate,
            UserId      = task.UserId,
            UserName    = task.User?.Name,
            CreatedAt   = task.CreatedAt,
            UpdatedAt   = task.UpdatedAt
        };
    }
}
