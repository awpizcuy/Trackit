using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TrackIt.Api.Data;
using TrackIt.Api.Hubs;
using TrackIt.Api.Models;

namespace TrackIt.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        // DTOs
        public record CreateTaskDto(string Title, string? Description, int ProjectId, DateTime? DueDate, int Priority);
        public record UpdateTaskDto(string Title, string? Description, int Status, DateTime? DueDate, int Priority);
        public record UpdateTaskStatusDto(int Status); // DTO untuk update status

        private readonly ApplicationDbContext _context;
        private readonly IHubContext<KanbanHub> _hubContext;

        public TasksController(ApplicationDbContext context, IHubContext<KanbanHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        [HttpPost]
        public async Task<ActionResult<TaskItem>> CreateTask([FromBody] CreateTaskDto taskDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var project = await _context.Projects.FirstOrDefaultAsync(p => p.Id == taskDto.ProjectId && p.UserId == userId);
            
            if (project == null) return NotFound("Project not found or you do not have permission.");

            var newTaskItem = new TaskItem
            {
                Title = taskDto.Title,
                Description = taskDto.Description ?? string.Empty,
                ProjectId = taskDto.ProjectId,
                Status = TrackIt.Api.Models.TaskStatus.ToDo,
                DueDate = taskDto.DueDate,
                Priority = taskDto.Priority
            };

            _context.TaskItems.Add(newTaskItem);
            await _context.SaveChangesAsync();

            await _hubContext.Clients.All.SendAsync("BoardUpdated", newTaskItem.ProjectId.ToString());
            return CreatedAtAction(nameof(GetTask), new { id = newTaskItem.Id }, newTaskItem);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TaskItem>> GetTask(int id)
        {
            var taskItem = await _context.TaskItems.FindAsync(id);
            if (taskItem == null) return NotFound();
            return Ok(taskItem);
        }

        // --- INI ADALAH METHOD YANG PERLU DIPERBAIKI/DITAMBAHKAN ---
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateTaskStatus(int id, [FromBody] UpdateTaskStatusDto updateDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var taskItem = await _context.TaskItems
                .Include(t => t.Project)
                .FirstOrDefaultAsync(t => t.Id == id && t.Project.UserId == userId);

            if (taskItem == null)
            {
                return NotFound("Task not found or you do not have permission.");
            }

            if (!Enum.IsDefined(typeof(TrackIt.Api.Models.TaskStatus), updateDto.Status))
            {
                return BadRequest("Invalid task status.");
            }

            taskItem.Status = (TrackIt.Api.Models.TaskStatus)updateDto.Status;
            
            await _context.SaveChangesAsync();
            await _hubContext.Clients.All.SendAsync("BoardUpdated", taskItem.ProjectId.ToString());

            return NoContent();
        }
        
        // Method UpdateTask yang lebih lengkap untuk modal edit
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, [FromBody] UpdateTaskDto updateDto)
        {
             var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var taskItem = await _context.TaskItems
                .Include(t => t.Project)
                .FirstOrDefaultAsync(t => t.Id == id && t.Project.UserId == userId);

            if (taskItem == null)
            {
                return NotFound("Task not found or you do not have permission.");
            }

            taskItem.Title = updateDto.Title;
            taskItem.Description = updateDto.Description ?? taskItem.Description;
            taskItem.Status = (TrackIt.Api.Models.TaskStatus)updateDto.Status;
            taskItem.DueDate = updateDto.DueDate;
            taskItem.Priority = updateDto.Priority;
            
            await _context.SaveChangesAsync();
            await _hubContext.Clients.All.SendAsync("BoardUpdated", taskItem.ProjectId.ToString());

            return NoContent();
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var taskItem = await _context.TaskItems
                .Include(t => t.Project)
                .FirstOrDefaultAsync(t => t.Id == id && t.Project.UserId == userId);
            
            if (taskItem == null) return NotFound("Task not found or you do not have permission.");
            
            var projectId = taskItem.ProjectId;
            _context.TaskItems.Remove(taskItem);
            
            await _context.SaveChangesAsync();
            await _hubContext.Clients.All.SendAsync("BoardUpdated", projectId.ToString());
            
            return NoContent();
        }
    }
}