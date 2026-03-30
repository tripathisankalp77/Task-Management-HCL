using System.ComponentModel.DataAnnotations;

namespace TaskManagerApi.DTOs
{
    public class CreateTaskDto
    {
        [Required(ErrorMessage = "Title is required")]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Required(ErrorMessage = "Status is required")]
        [RegularExpression("^(Pending|Completed)$",
            ErrorMessage = "Status must be 'Pending' or 'Completed'")]
        public string Status { get; set; } = "Pending";

        public DateTime? DueDate { get; set; }
    }

    public class UpdateTaskDto
    {
        [Required(ErrorMessage = "Title is required")]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Required(ErrorMessage = "Status is required")]
        [RegularExpression("^(Pending|Completed)$",
            ErrorMessage = "Status must be 'Pending' or 'Completed'")]
        public string Status { get; set; } = "Pending";

        public DateTime? DueDate { get; set; }
    }

    public class TaskResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime? DueDate { get; set; }
        public int UserId { get; set; }
        public string? UserName { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
