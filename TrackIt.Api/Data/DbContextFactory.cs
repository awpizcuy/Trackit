using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace TrackIt.Api.Data;

public class DbContextFactory : IDesignTimeDbContextFactory<DbContext>
{
    public DbContext CreateDbContext(string[] args)
    {
        IConfigurationRoot configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json")
            .Build();

        var builder = new DbContextOptionsBuilder<DbContext>();
        var connectionString = configuration.GetConnectionString("DefaultConnection");

        // Modifikasi ada di sini. Tambahkan 'o => o.MigrationsAssembly(...)'
        builder.UseSqlite(connectionString, o => 
            o.MigrationsAssembly(typeof(DbContext).Assembly.FullName));

        return new DbContext(builder.Options);
    }
}