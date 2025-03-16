using CountDown.Entities;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace CountDown
{
	public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
	{
		public ApplicationDbContext() : base("name=DefaultConnection", throwIfV1Schema: false) { }

		public static ApplicationDbContext Create()
		{
			return new ApplicationDbContext();
		}
		public DbSet<Countdown> Countdowns { get; set; }
        public DbSet<Countup> Countups { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Countup>()
                .HasKey(c => c.Id);
            modelBuilder.Entity<Countup>()
                .Property(c => c.Id)
                .HasDatabaseGeneratedOption(DatabaseGeneratedOption.Identity);
        }
    }
}