using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TrackIt.Api.Data;
using TrackIt.Api.Models;

namespace TrackIt.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectsController : ControllerBase
    {
        // DTO for the create project request
        public record CreateProjectDto(string Name);

        private readonly ApplicationDbContext _context;

        public ProjectsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Project>>> GetProjects()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var projects = await _context.Projects
                .Where(p => p.UserId == userId)
                .ToListAsync();
            return Ok(projects);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Project>> GetProject(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var project = await _context.Projects
                .Include(p => p.TaskItems)
                .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);

            if (project == null)
            {
                return NotFound();
            }

            return Ok(project);
        }

        // --- MAIN FIX IS HERE ---
        [HttpPost]
        // Change the parameter from [FromBody] Project to [FromBody] CreateProjectDto
        public async Task<ActionResult<Project>> CreateProject([FromBody] CreateProjectDto projectDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            // Create a new Project entity manually
            var newProject = new Project
            {
                Name = projectDto.Name,
                UserId = userId // Set UserId from the authenticated user
            };

            _context.Projects.Add(newProject);
            await _context.SaveChangesAsync();
            
            return CreatedAtAction(nameof(GetProject), new { id = newProject.Id }, newProject);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProject(int id, [FromBody] Project project)
        {
            if (id != project.Id)
            {
                return BadRequest("ID proyek tidak cocok.");
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var projectToUpdate = await _context.Projects.FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);

            if (projectToUpdate == null)
            {
                return NotFound("Proyek tidak ditemukan atau Anda tidak memiliki izin.");
            }

            projectToUpdate.Name = project.Name;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var project = await _context.Projects.FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);
            
            if (project == null)
            {
                return NotFound("Proyek tidak ditemukan atau Anda tidak memiliki izin.");
            }

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}