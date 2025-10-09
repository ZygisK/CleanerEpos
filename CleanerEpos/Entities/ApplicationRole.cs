using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace CleanerEpos.Entities;

[NotMapped]
public class ApplicationRole : IdentityRole
{
}