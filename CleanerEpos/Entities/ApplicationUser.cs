using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CleanerEpos.Entities;

public class ApplicationUser : IdentityUser
{
    public string FullName { get; set; }
    public override bool EmailConfirmed { get; set; } = true;
}

public class ApplicationUserConfig : IEntityTypeConfiguration<ApplicationUser>
{
    public void Configure(EntityTypeBuilder<ApplicationUser> builder)
    {
        builder.HasKey(x => x.Id);
        builder.HasIndex(u => u.NormalizedEmail);
        builder.Property(x => x.Email).IsRequired();
        builder.Property(x => x.UserName).IsRequired();

    }
}