using Microsoft.AspNetCore.Identity;

namespace TrackIt.Api.Models
{
    public class ApplicationUser : IdentityUser
    {
         public string? FullName { get; set; }
    }
}