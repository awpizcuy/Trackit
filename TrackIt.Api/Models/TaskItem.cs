namespace TrackIt.Api.Models
{
    public enum TaskStatus { ToDo, InProgress, Done }

    public class TaskItem
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public string? Description { get; set; }
        public TaskStatus Status { get; set; }
        public int ProjectId { get; set; }
        public Project Project { get; set; } = null!;
        public DateTime? DueDate { get; set; }
        public int Priority { get; set; }
    }
}