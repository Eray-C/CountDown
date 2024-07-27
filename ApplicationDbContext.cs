using CountDown.Entities;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
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
	}
}