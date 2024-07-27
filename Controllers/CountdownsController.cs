using System;
using System.Data;
using System.Linq;
using System.Text;
using System.Web.Mvc;
using CountDown.Entities;
using Microsoft.AspNet.Identity;
using Newtonsoft.Json.Serialization;
using Newtonsoft.Json;
using System.ComponentModel;
using System.Web.Script.Serialization;


namespace CountDown.Controllers
{

	[Authorize]
	public class CountdownsController : Controller
	{
		private DataContext db = new DataContext();

		// GET: Countdowns
		public ActionResult Index()
		{
			string user = User.Identity.GetUserId();
			var userCountdowns = db.Countdowns.Where(c => c.UserId == user).ToList();
			return View(userCountdowns);
		}

		[HttpPost]
		public ActionResult Save(Countdown countdata)
		{
			string userId = User.Identity.GetUserId();
			try
			{
				if (ModelState.IsValid)
				{

					var countdownEntity = new Countdown
					{
						UserId = userId,
						StartDate = DateTime.Now,
						EndDate = countdata.EndDate,
						Title = countdata.Title,
						CreateDate = DateTime.Now
					};

					db.Countdowns.Add(countdownEntity);
					db.SaveChanges();


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


		[HttpPost]

		public ActionResult Delete(int id)
		{
			try
			{
				var countdown = db.Countdowns.Find(id);
				if (countdown == null)
				{
					return Json(new { success = false, message = "Countdown bulunamadı." });
				}

				db.Countdowns.Remove(countdown);
				db.SaveChanges();

				return Json(new { success = true, message = "Countdown başarıyla silindi." });
			}
			catch (Exception ex)
			{
				return Json(new { success = false, message = "Silme işlemi sırasında bir hata oluştu: " + ex.Message });
			}
		}

		[HttpGet]
		public ActionResult GetCountdowns()

		{

			try
			{
				string user = User.Identity.GetUserId();
				var userCountdowns = db.Countdowns.Where(c => c.UserId == user).ToList();

				//JavaScriptSerializer ile JSON dönüşümü, tarih formatını belirleyerek
				var serializer = new JavaScriptSerializer();
				serializer.RegisterConverters(new JavaScriptConverter[] { new CustomDateTimeConverter() });

				var jsonResult = new ContentResult
				{
					Content = serializer.Serialize(userCountdowns),
					
					ContentType = "application/json"
				};

				return jsonResult;
			}
			catch (Exception ex)
			{

				return Json(new
				{
					success = false,
					message = "Silme işlemi sırasında bir hata oluştu: " + ex.Message
				});
			}

		}

		[HttpPost]
		public ActionResult UpdateCountdown(int id, string title, DateTime endDate)
		{
			try
			{
				// Güncellemeyi yap
				var countdown = db.Countdowns.Find(id);
				if (countdown != null)
				{
					countdown.Title = title;
					countdown.EndDate = endDate;
					db.SaveChanges();
				}

				return Json(new { success = true });
			}
			catch (Exception ex)
			{
				// Hata işleme
				return Json(new { success = false, message = ex.InnerException.Message });
			}
		}



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
