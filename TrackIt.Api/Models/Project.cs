using System.ComponentModel.DataAnnotations.Schema;
using TrackIt.Api.Models;

namespace TrackIt.Api.Models
{
    public class Project
    {
        public int Id { get; set; }
        public required string Name { get; set; } // <-- Fix is here
        public ICollection<TaskItem> TaskItems { get; set; } = new List<TaskItem>();

        [ForeignKey("User")]
        public required string UserId { get; set; }
        public ApplicationUser User { get; set; } = null!;
    }
}