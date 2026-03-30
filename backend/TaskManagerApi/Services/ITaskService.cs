using TaskManagerApi.DTOs;

namespace TaskManagerApi.Services
{
    public interface ITaskService
    {
        Task<IEnumerable<TaskResponseDto>> GetTasksByUserIdAsync(int userId);
        Task<TaskResponseDto?> GetTaskByIdAsync(int id, int userId);
        Task<TaskResponseDto> CreateTaskAsync(CreateTaskDto dto, int userId);
        Task<TaskResponseDto?> UpdateTaskAsync(int id, UpdateTaskDto dto, int userId);
        Task<bool> DeleteTaskAsync(int id, int userId);
    }
}
