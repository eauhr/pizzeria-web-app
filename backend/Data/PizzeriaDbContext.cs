using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public class PizzeriaDbContext : DbContext
{
    public PizzeriaDbContext(DbContextOptions<PizzeriaDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();

    public DbSet<Category> Categories => Set<Category>();

    public DbSet<Product> Products => Set<Product>();

    public DbSet<Order> Orders => Set<Order>();

    public DbSet<OrderItem> OrderItems => Set<OrderItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<Product>()
            .Property(p => p.Price)
            .HasPrecision(10, 2);

        modelBuilder.Entity<Order>()
            .Property(o => o.TotalPrice)
            .HasPrecision(10, 2);

        modelBuilder.Entity<OrderItem>()
            .Property(oi => oi.Price)
            .HasPrecision(10, 2);

        modelBuilder.Entity<Product>()
            .HasOne(p => p.Category)
            .WithMany(c => c.Products)
            .HasForeignKey(p => p.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Order>()
            .HasOne(o => o.User)
            .WithMany(u => u.Orders)
            .HasForeignKey(o => o.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<OrderItem>()
            .HasOne(oi => oi.Order)
            .WithMany(o => o.OrderItems)
            .HasForeignKey(oi => oi.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<OrderItem>()
            .HasOne(oi => oi.Product)
            .WithMany(p => p.OrderItems)
            .HasForeignKey(oi => oi.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Category>().HasData(
    new Category { Id = 1, Name = "Pizza" },
    new Category { Id = 2, Name = "Pasta" },
    new Category { Id = 3, Name = "Wine" }
);

modelBuilder.Entity<Product>().HasData(
    new Product { Id = 1, Name = "Margherita", Description = "Tomato sauce, mozzarella", Price = 7.11m, ImageUrl = "", IsAvailable = true, CategoryId = 1, CreatedAt = new DateTime(2026, 1, 1) },
    new Product { Id = 2, Name = "Quattro Formaggi", Description = "Tomato sauce, four cheeses", Price = 9.05m, ImageUrl = "", IsAvailable = true, CategoryId = 1, CreatedAt = new DateTime(2026, 1, 1) },
    new Product { Id = 3, Name = "Diavolo", Description = "Tomato, mozzarella, spicy salami, chili, garlic", Price = 8.79m, ImageUrl = "", IsAvailable = true, CategoryId = 1, CreatedAt = new DateTime(2026, 1, 1) },
    new Product { Id = 4, Name = "Spaghetti alla Carbonara", Description = "Cream, ham, egg, parmesan", Price = 8.44m, ImageUrl = "", IsAvailable = true, CategoryId = 2, CreatedAt = new DateTime(2026, 1, 1) },
    new Product { Id = 5, Name = "Tagliatelle al Salmone", Description = "Salmon, mushroom, garlic, cream, tomato", Price = 10.79m, ImageUrl = "", IsAvailable = true, CategoryId = 2, CreatedAt = new DateTime(2026, 1, 1) },
    new Product { Id = 6, Name = "Lasagne al Forno", Description = "Beef ragù, béchamel, gouda", Price = 9.31m, ImageUrl = "", IsAvailable = true, CategoryId = 2, CreatedAt = new DateTime(2026, 1, 1) },
    new Product { Id = 7, Name = "Castra Rubra Rosé", Description = "750ml · 8.7% vol", Price = 19.94m, ImageUrl = "", IsAvailable = true, CategoryId = 3, CreatedAt = new DateTime(2026, 1, 1) },
    new Product { Id = 8, Name = "Santa Cristina Rosato", Description = "750ml · 8.7% vol", Price = 34.26m, ImageUrl = "", IsAvailable = true, CategoryId = 3, CreatedAt = new DateTime(2026, 1, 1) }
);
    }
}