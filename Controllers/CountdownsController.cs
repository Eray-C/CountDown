using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using CountDown.Entities;

namespace CountDown.Controllers
{
	public class CountdownsController : Controller
	{
		private DataContext db = new DataContext();

		// GET: Countdowns
		public ActionResult Index()
		{
			return View(db.Countdowns.ToList());
		}
		[HttpPost]

		public ActionResult Save(Countdown countdata)
		{
			try
			{
				if (ModelState.IsValid)
				{
				
					
					{
						var countdownEntity = new Countdown
						{
							UserId = null, 
							StartDate = DateTime.Now,
							EndDate = countdata.EndDate,
							Title = countdata.Title,
							CreateDate = DateTime.Now
						};

						db.Countdowns.Add(countdownEntity);
						db.SaveChanges();
					}

					return Json(new { success = true, message = "Countdown başarıyla kaydedildi." });
				}
				else
				{
					var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
					return Json(new { success = false, message = "Geçersiz giriş verileri.", errors });
				}
			}
			catch (Exception ex)
			{
				// Inner exception detaylarını loglayalım
				var innerExceptionMessage = ex.InnerException != null ? ex.InnerException.Message : "Inner exception yok.";
				return Json(new { success = false, message = "Kayıt sırasında bir hata oluştu: " + ex.Message, innerException = innerExceptionMessage });
			}
		}

		// GET: Countdowns/Details/5

		protected override void Dispose(bool disposing)
		{
			if (disposing)
			{
				db.Dispose();
			}
			base.Dispose(disposing);
		}
	}
}
